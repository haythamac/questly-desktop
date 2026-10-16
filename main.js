const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.setPath('userData', path.join(app.getPath('appData'), 'todo-electron'));

const dataFile = () => path.join(app.getPath('userData'), 'todos.json');

ipcMain.handle('todos:load', () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    return { tasks: [], lastOpened: null };
  }
});

ipcMain.handle('todos:save', (_e, data) => {
  fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2));
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 820,
    height: 680,
    minWidth: 480,
    minHeight: 480,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
