const fs = require("fs"),
    path = require("path"),
    electron = require("electron");

const { downloadQueue } = require("./convertvideos");

const { dialog } = electron;


function handle(socket) {

    socket.on("app:convert_queue", function (data) {

        const p = data.path;

        if (!fs.existsSync(p)) {

            socket.emit("app_response:errorcode:path_not_exist", `The path '${p}' does not exist.`);

            console.log("Directory does not exist");
        }

        downloadQueue(p, data.fields, socket);

    });

    socket.on("app:select_path", function (event) {
        const results = dialog.showOpenDialog({
            properties: ["openDirectory"]
        }).then(function (data) {

            console.log(data);

            socket.emit("app_response:select_path", {
                data: data,
                timestamp: Date.now(),
                type: "dialog"
            });

        }).catch(function (err) {

        });
    });
}

module.exports = {
    handle: handle
}