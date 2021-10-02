// Import modules.
const path = require("path"),
    url = require("url"),
    fs = require("fs"),
    electron = require("electron"),
    express = require("express"),
    colors = require("colors"),
    io = require("socket.io")(5858);

// Get required objects from 'electron' object.
const { app, BrowserWindow, ipcMain } = electron;

// Create empty variable.
let mainWindow;

// Event when electron has been loaded.
app.on("ready", function () {

    // Create new browser window.
    mainWindow = new BrowserWindow({
        title: "Youtube Converter",
        transparent: true,
        width: 700,
        height: 650,
        minHeight: 650,
        minWidth: 700,
        resizable: true,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: true,
        }
    });

    // Load html page into browser window using url format.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "view", "index.html"),
        slashes: true,
        protocol: "file:"
    }));

    // Handle IPC requests.


    ipcMain.on("app:close", function (event, args) {

        mainWindow.close();
        app.exit();
        process.exit();

    });

    ipcMain.on("app:toggleWindowSize", function (event, args) {

        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }

    });

    ipcMain.on("app:minimize", function (event, args) {

        mainWindow.minimize();

    });
});