/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  ipcRenderer,
  shell,
  TouchBar,
} from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { ethers } from 'ethers';
import fs, { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { IFile } from 'main/IFile';
import { format } from 'date-fns';
import { pipeline } from 'stream/promises';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import { sha256 } from 'ethers/lib/utils';
import sha256File from 'sha256-file';
import MerkleTree from 'merkletreejs';
import NodeAPI, { IGetMerkleProofResponse } from '../node-api/node-api';
import { ContractAPI } from './contract-api';
import DB_API, { IAccount, LoadAccountInfoFromFile } from './db-api';
import MenuBuilder from './menu';

import { resolveHtmlPath } from './util';
import { generateMerkleRootFromMerkleTreeDir } from './merkle-util';

export const globalIV = 'a0d336ccd2aee9a6';

/**
 * Used to abort the upload/download operation with the key
 */
const abortControllerMapping: Record<string, AbortController> = {};

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
ipcMain.on('ipc-example', async (event, arg) => {
  console.log('ipc-example', arg);
  event.reply('ipc-example', 'pong');
});

ipcMain.on('createNewUserFile', async (event, arg: { username: string }) => {
  const { address, privateKey, publicKey } = ethers.Wallet.createRandom();
  const data = JSON.stringify({
    username: arg.username,
    address,
    privateKey,
    publicKey,
  });
  fs.writeFileSync('./Wallet.json', data);
  event.reply('createNewUserFile', 'File created');
});

ipcMain.on('get-data', (event, arg) => {
  console.log(arg);
  event.reply('get-data', 'husnain is getting data');
});

ipcMain.handle('get-node-info', async (event, hostname) => {
  console.log('get-node-info::', hostname);
  const stats = await NodeAPI.GetStats(hostname);
  return stats;
});

ipcMain.handle('get-all-files', async (event) => {
  const files = await DB_API.getAllFiles();
  return files;
});
ipcMain.handle(
  'node-ping',
  async (event, { host, fileSize, segmentsCount, timePeriod }) => {
    const data = await NodeAPI.Ping(host, fileSize, segmentsCount, timePeriod);
    return data;
  }
);

ipcMain.handle('node-file-abort', (event, { fileKey }) => {
  const c = abortControllerMapping[fileKey];
  if (c) {
    c.abort();
    return true;
  }
  return false;
});
ipcMain.handle(
  'node-compute-hash',
  async (event, { filePath, segmentsCount }) => {
    console.log('Getting root hash');
    const hash = await NodeAPI.ComputeMerkleRootHash(
      filePath,
      segmentsCount,
      (p) => {
        mainWindow?.webContents.send('node-hash-progress', {
          filePath,
          progress: p,
        });
      }
    );
    return hash;
  }
);
ipcMain.handle(
  'node-http-upload',
  (event, { url, filePath, token, fileKey }) => {
    const onProgress = (p: number) => {
      console.log('>P:', p);
      mainWindow?.webContents.send('file-progress', {
        fileKey,
        progress: p,
        operation: 'UPLOAD',
      });
    };
    const onError = (err: Error) => {
      mainWindow?.webContents.send('file-error', {
        fileKey,
        name: err.name,
        msg: err.message,
        operation: 'UPLOAD',
      });
    };
    const onComplete = ({ download_url }: any) => {
      mainWindow?.webContents.send('file-complete', {
        fileKey,
        download_url,
        operation: 'UPLOAD',
      });
    };

    const controller = NodeAPI.HTTPUploadFile(
      filePath,
      url,
      token,
      onProgress,
      onError,
      onComplete,
      fileKey
    );
    abortControllerMapping[fileKey] = controller;

    return fileKey;
  }
);

ipcMain.handle('node-http-download-abort', (event, { fileKey }) => {
  if (abortControllerMapping[fileKey]) {
    try {
      abortControllerMapping[fileKey].abort();
      return true;
    } catch (er) {
      console.warn(er);
    }
  }
  return false;
});

ipcMain.handle(
  'node-http-download',
  (event, { url, token, fileKey, name, decrypt, sha256: fileSha256 }) => {
    const dest = path.join(
      process.env.HOME || process.env.USERPROFILE || './',
      'downloads/',
      name
    );

    const onProgress = (p: number) => {
      mainWindow?.webContents.send('file-progress', {
        fileKey,
        progress: p,
        operation: 'DOWNLOAD',
      });
    };
    const onError = (err: Error) => {
      console.log('Sending File Download Error');
      mainWindow?.webContents.send('file-error', {
        fileKey,
        name: err.name,
        msg: err.message,
        operation: 'DOWNLOAD',
      });
    };
    const onComplete = () => {
      if (fileSha256) {
        const s = sha256File(dest);
        console.log('Integrity : (found,required)', s, fileSha256);
        if (s !== fileSha256) {
          console.log(
            'Integrity check failed: (found,required)',
            s,
            fileSha256
          );
          mainWindow?.webContents.send('file-error', {
            fileKey,
            name: 'Integrity Failed',
            msg: 'File data is corrrupted. Please try downloading.',
            operation: 'DOWNLOAD',
          });
          return;
        }
      }

      if (decrypt && decrypt.key) {
        const encKey = Buffer.from(
          sha256(Buffer.from(decrypt.key.slice(2), 'utf-8'))
            .slice(2)
            .substring(0, 32),
          'utf-8'
        );
        // console.log('ENC');
        // console.log(sha256(key));
        // console.log(encKey);

        const iv = Buffer.from(globalIV, 'utf-8');

        const nPath = dest.concat('.dec');
        pipeline(
          createReadStream(dest),
          createDecipheriv('aes-256-cbc', encKey, iv),
          createWriteStream(nPath)
        )
          .then(() => {
            fs.rmSync(dest);
            fs.renameSync(nPath, dest);

            mainWindow?.webContents.send('file-complete', {
              fileKey,
              dest,
              operation: 'DOWNLOAD',
            });
          })
          .catch((er) => {
            console.warn(er);

            mainWindow?.webContents.send('file-error', {
              fileKey,
              name: 'Decryption Failed',
              msg: 'Failed to decrypt file',
              operation: 'DOWNLOAD',
            });
          });
      } else {
        mainWindow?.webContents.send('file-complete', {
          fileKey,
          dest,
          operation: 'DOWNLOAD',
        });
      }
    };

    const controller = NodeAPI.HTTPDownloadFile(
      url,
      token,
      fileKey,
      dest,
      onProgress,
      onError,
      onComplete
    );
    abortControllerMapping[fileKey] = controller;

    return { fileKey, dest };
  }
);

ipcMain.handle(
  'node-init-tx',
  async (
    event,
    {
      host,
      userAddress,
      fileSize,
      segmentsCount,
      timeStart,
      timeEnd,
      fileHash,
      bid,
    }
  ) => {
    console.log('Call');
    const token = await NodeAPI.InitTransaction(
      host,
      userAddress,
      bid,
      fileHash,
      fileSize,
      segmentsCount,
      timeStart,
      timeEnd
    );
    return token;
  }
);

export interface IPCcontractConcludeTx {
  fileKey: string;
  contractAddress: string;
  privateKey: string;
  weiValue: string;
  userAddress: string;
  bidAmount: string;
  fileSize: number;
  merkleRootHash: string;
  segmentsCount: number;
  timerStart: number;
  timerEnd: number;
  concludeTimeoutLength: number;
  proveTimeoutLength: number;
}

ipcMain.handle(
  'contract-conclude-tx',
  async (
    event,
    {
      fileKey,
      contractAddress,
      privateKey,
      weiValue,
      userAddress,
      bidAmount,
      fileSize,
      merkleRootHash,
      segmentsCount,
      timerStart,
      timerEnd,
      concludeTimeoutLength,
      proveTimeoutLength,
    }: IPCcontractConcludeTx
  ) => {
    console.log('ContractAPI.concludeTransaction');
    try {
      const res = await ContractAPI.concludeTransaction(
        contractAddress,
        privateKey,
        weiValue,
        {
          merkleRootHash,
          fileSize,
          segmentsCount,
          timerStart,
          timerEnd,
          bidAmount,
          userAddress,
          concludeTimeoutLength,
          proveTimeoutLength,
        }
      );
      mainWindow?.webContents.send('conclude-tx', {
        fileKey,

        status: true,
      });
      return res;
    } catch (er) {
      mainWindow?.webContents.send('conclude-tx', {
        fileKey,

        status: false,
      });
      throw er;
    }
  }
);
ipcMain.handle('create-account', async (event, account: IAccount) => {
  console.log('Creating account');
  await DB_API.createAccount(account);
  console.log('Account created');
});

ipcMain.handle('open-finder', async (event, filePath: string) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('remove-account', async (event) => {
  const id = dialog.showMessageBoxSync(mainWindow!, {
    message:
      "Make sure you've exported your account. You can't undo this operation.",
    buttons: ['Cancel', 'Remove Account'],
    type: 'warning',
    cancelId: 0,
    defaultId: 0,
  });
  if (id !== 1) {
    return false;
  }
  try {
    await DB_API.disconnect();
  } catch (er) {
    console.warn(er);
  }
  fs.rmSync(path.join(getAssetPath(), 'account.db'));
  return true;
});

ipcMain.handle('browse-load-account', async (event) => {
  const f = dialog.showOpenDialogSync(mainWindow!, {
    filters: [{ name: 'Hyperspace Account', extensions: ['db'] }],
  });
  if (!f || !f[0]) return null;

  return { path: f[0], account: await LoadAccountInfoFromFile(f[0]) };
});

ipcMain.handle('load-account-from-file', async (event, file) => {
  const dest = path.join(getAssetPath(), 'account.db');

  if (!fs.existsSync(file)) throw new Error("file doesn't exists");
  if (fs.existsSync(dest)) {
    fs.rmSync(dest);
  }
  fs.copyFileSync(file, dest);
  if (!fs.existsSync(dest)) throw new Error('failed to copy account file');
});

ipcMain.handle('export-account', async (event, prefix) => {
  const dir = dialog.showOpenDialogSync(mainWindow!, {
    properties: ['openDirectory'],
    message: 'Select directory',
  });
  if (!dir || !dir[0]) return;
  const dest = path.join(
    dir[0],
    `${prefix}.db`
    // `${prefix}-account-${format(new Date(), 'dd-mm-yyyy-hh-mm-ss')}.db`
  );
  fs.copyFileSync(getAssetPath('account.db'), dest);

  shell.showItemInFolder(dest);
});
ipcMain.handle('get-balance', async (event, addr: string) => {
  return ContractAPI.getBalance(addr);
});

ipcMain.handle('get-segments-count', async (event, filePath) => {
  const fstats = fs.statSync(filePath);

  const fileSize = fstats.size;
  const segmentsCount = Math.ceil(fileSize / (1024 * 1));
  return segmentsCount;
});

ipcMain.handle('get-account', async (event, hostname) => {
  const account = await DB_API.getAccount();
  return account;
});
ipcMain.handle('db-insert-file', async (event, file: IFile) => {
  await DB_API.insertFile(file);
  return true;
});

ipcMain.handle('browse-file', async (event) => {
  const selectedPath = dialog.showOpenDialogSync(mainWindow!, {});
  if (!selectedPath || selectedPath.length === 0) return null;
  const { name, ext } = path.parse(selectedPath[0]);
  if (await DB_API.fileExists(name + ext)) {
    dialog.showErrorBox(
      'File Already Uploaded',
      "Your've already uploaded this file."
    );
    return null;
  }
  const stats = fs.statSync(selectedPath[0]);
  const fileSha256 = sha256File(selectedPath[0]);
  return {
    path: selectedPath[0],
    size: stats.size,
    name,
    ext,
    sha256: fileSha256,
  };
});
ipcMain.handle('get-nodes', async (event, arg) => {
  console.log('Handling get-nodes');

  return ContractAPI.getStorageNodesAddress();
  // .then((nodes) => {
  //   console.log('Got nodes', nodes);
  //   event.reply('get-nodes', nodes);
  // })
  // .catch((er) => console.log(er));
});
ipcMain.handle('node-contract-info', async (event, address) => {
  return ContractAPI.getStorageNodeInfo(address);
});
ipcMain.handle(
  'node-get-proof',
  async (event, { host, fileKey, segmentIndex, root }) => {
    try {
      const proofResult: IGetMerkleProofResponse = await NodeAPI.GetMerkleProof(
        host,
        fileKey,
        segmentIndex
      );
      console.log(proofResult.root);
      const res = generateMerkleRootFromMerkleTreeDir(
        proofResult.proof,
        proofResult.directions
      );
      console.log('root:', root);
      console.log('VERI:', res);
      return { result: proofResult, error: null };
    } catch (er: any) {
      return {
        result: null,
        error: {
          message: er.message,
          code: er.code,
          details: er.details,
        },
      };
    }
  }
);

ipcMain.handle('delete-file', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    fs.rm(filePath, (er) => {
      if (er) reject(er);
      else resolve(true);
    });
  });
});

ipcMain.handle('encrypt-file', async (event, { filePath, dest, key }) => {
  // eslint-disable-next-line no-param-reassign

  const encKey = Buffer.from(
    sha256(Buffer.from(key.slice(2), 'utf-8'))
      .slice(2)
      .substring(0, 32),
    'utf-8'
  );
  // console.log('ENC');
  // console.log(sha256(key));
  // console.log(encKey);

  const iv = Buffer.from(globalIV, 'utf-8');

  return new Promise((resolve, reject) => {
    pipeline(
      createReadStream(filePath),
      createCipheriv('aes-256-cbc', encKey, iv),
      createWriteStream(dest)
    )
      .then(() => {
        const stats = fs.statSync(dest);

        const sha = sha256File(dest);
        console.log('Sha256 of file');
        console.log(sha);
        resolve({ path: dest, size: stats.size, sha256: sha });
      })
      .catch((er) => reject(er?.message || 'failed to encrypt'));
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const { TouchBarButton } = TouchBar;

const BarUploadButton = new TouchBarButton({
  label: '⇪ Upload',
  backgroundColor: '#3a4780',
  click: () => {
    mainWindow?.webContents.send('upload-click');
  },
});

const touchBar = new TouchBar({
  items: [BarUploadButton],
});

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    icon: getAssetPath('icon.png'),
    backgroundColor: '#fff',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 30, y: 20 },

    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.setTouchBar(touchBar);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
