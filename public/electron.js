const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: 'Pomodoro',
        width: 400,
        height: 430,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'), //connect to react app 
        protocol: 'file',
        slashes: true,
    });

    mainWindow.setWindowButtonVisibility(false);//3 dots
    mainWindow.setMenuBarVisibility(false);//menu bar
    mainWindow.loadURL(startUrl); //load app in electron window

    ipcMain.on('close-app', () => {
        app.quit();
    })

}

app.whenReady().then(createMainWindow);