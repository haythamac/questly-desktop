const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('todoApi', {
  load: () => ipcRenderer.invoke('todos:load'),
  save: (data) => ipcRenderer.invoke('todos:save', data),
});
