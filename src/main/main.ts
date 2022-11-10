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
import fs from 'fs';
import path from 'path';
import NodeAPI from '../node-api/node-api';
import { ContractAPI } from './contract-api';
import DB_API, { IAccount } from './db-api';
import MenuBuilder from './menu';

import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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
  fs.writeFileSync('./vallet.json', data);
  event.reply('createNewUserFile', 'File created');
});

ipcMain.on('get-data', (event, arg) => {
  console.log(arg);
  event.reply('get-data', 'husnain is getting data');
});

ipcMain.handle('get-node-info', async (event, hostname) => {
  const stats = await NodeAPI.GetStats(hostname);
  return stats;
});

ipcMain.handle('create-account', async (event, account: IAccount) => {
  await DB_API.createAccount(account);
});
ipcMain.handle('get-balance', async (event, addr: string) => {
  return ContractAPI.getBalance(addr);
});
ipcMain.handle('get-account', async (event, hostname) => {
  const account = await DB_API.getAccount();
  return account;
});
ipcMain.handle('browse-file', async (event) => {
  const selectedPath = dialog.showOpenDialogSync(mainWindow!, {});
  if (!selectedPath || selectedPath.length == 0) return null;
  const { name, ext } = path.parse(selectedPath[0]);

  const stats = fs.statSync(selectedPath[0]);
  return { path: selectedPath[0], size: stats.size, name, ext };
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

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

let spinning = false;

// Reel labels
const reel1 = new TouchBarButton({});
const reel2 = new TouchBarLabel({});
const reel3 = new TouchBarLabel({});

// Spin result label
const result = new TouchBarLabel({});

// Spin button
const spin = new TouchBarButton({
  label: '⇪ Upload',
  backgroundColor: '#3a4780',
  click: () => {
    mainWindow?.webContents.send('upload-click');
    // ipcRenderer.emit('upload-click');
    // // Ignore clicks if already spinning
    // if (spinning) {
    //   return;
    // }

    // spinning = true;
    // result.label = '';

    // let timeout = 10;
    // const spinLength = 4 * 1000; // 4 seconds
    // const startTime = Date.now();

    // const spinReels = () => {
    //   updateReels();

    //   if (Date.now() - startTime >= spinLength) {
    //     finishSpin();
    //   } else {
    //     // Slow down a bit on each spin
    //     timeout *= 1.1;
    //     setTimeout(spinReels, timeout);
    //   }
    // };

    // spinReels();
  },
});

const getRandomValue = () => {
  const values = ['🍒', '💎', '7️⃣', '🍊', '🔔', '⭐', '🍇', '🍀'];
  return values[Math.floor(Math.random() * values.length)];
};

const updateReels = () => {
  reel1.label = getRandomValue();
  reel2.label = getRandomValue();
  reel3.label = getRandomValue();
};

const finishSpin = () => {
  const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size;
  if (uniqueValues === 1) {
    // All 3 values are the same
    result.label = '💰 Jackpot!';
    result.textColor = '#FDFF00';
  } else if (uniqueValues === 2) {
    // 2 values are the same
    result.label = '😍 Winner!';
    result.textColor = '#FDFF00';
  } else {
    // No values are the same
    result.label = '🙁 Spin Again';
    result.textColor = null;
  }
  spinning = false;
};

const touchBar = new TouchBar({
  items: [spin],
});

let window;

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

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
