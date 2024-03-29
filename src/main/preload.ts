import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'get-data'
  | 'createNewUserFile'
  | 'get-nodes'
  | 'get-node-info'
  | 'get-account'
  | 'create-account'
  | 'get-balance'
  | 'browse-file'
  | 'upload-click'
  | 'node-ping'
  | 'node-init-tx'
  | 'node-http-upload'
  | 'node-compute-hash'
  | 'node-hash-progress'
  | 'file-progress'
  | 'file-error'
  | 'file-complete'
  | 'contract-conclude-tx'
  | 'db-insert-file'
  | 'get-all-files'
  | 'get-info'
  | 'node-contract-info'
  | 'node-http-download'
  | 'node-http-download-abort'
  | 'open-finder'
  | 'export-account'
  | 'browse-load-account'
  | 'load-account-from-file'
  | 'remove-account'
  | 'encrypt-file'
  | 'decrypt-file'
  | 'conclude-tx'
  | 'delete-file'
  | 'node-get-proof'
  | 'get-segments-count';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: string, ...args: any[]): Promise<any> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
});
