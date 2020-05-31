const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

const url = 'http://127.0.0.1:1880/ui';

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700
  });
  mainWindow.loadURL(url);
}

let mainWindow = null;
let tray = null;
let isQuitting = false;

app.whenReady().then(() => {
  createWindow();

  mainWindow.on('close', function(event) {
    if(!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  app.on('activate', function() {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  })

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function() {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', function () {
  if(process.platform !== 'darwin') app.quit()
});
