const fs = require("fs"),
    path = require("path"),
    url = require("url");

const applicationName = "YoutubeDownloader",
    appDataFolder = process.env.APPDATA;

function checkFolderExistance() {

    const dirs = fs.readdirSync(appDataFolder);

    return dirs.includes(applicationName);
}

function createAppDataTemplate() {

    fs.mkdirSync(path.join(appDataFolder, applicationName));
    fs.mkdirSync(path.join(appDataFolder, applicationName, "Application Data"));

    const serverConfig = {
        serverPort: 8000,
        channel: 142,
        useChromiumExtension: true,
        nodeVersion: "14.18.0^ & 16.10.0"
    }

    fs.writeFileSync(path.join(appDataFolder, applicationName, "Application Data", "history.json"), "[]", { encoding: "utf-8" });
    fs.writeFileSync(path.join(appDataFolder, applicationName, "Application Data", "server.json"), JSON.stringify(serverConfig), { encoding: "utf-8" });

    return createUserDataFileTemplate();
}

function createUserDataFileTemplate() {

    const data = {
        outputPath: null,
        theme: "bright",
        animations: true,
        extension: {
            active: true,
            socketPort: 6920,
            express: {
                active: true,
                customSocketPort: true
            }
        }
    }

    fs.writeFileSync(path.join(appDataFolder, applicationName, "Application Data", "configuration.json"), JSON.stringify(data, null, 2), { encoding: "utf-8" });

    return data;
}

function initialize() {

    const folderExists = checkFolderExistance();

    if (!folderExists) return createAppDataTemplate();

    if (!fs.existsSync(path.join(appDataFolder, applicationName, "Application Data", "configuration.json"))) return null;

    const configFile = fs.readFileSync(path.join(appDataFolder, applicationName, "Application Data", "configuration.json"), {encoding: "utf-8"});

    return JSON.parse(configFile);
}


module.exports = {
    initialize: initialize
}