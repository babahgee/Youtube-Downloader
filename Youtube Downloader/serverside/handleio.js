const fs = require("fs"),
    path = require("path");
const { downloadQueue } = require("./convertvideos");

function handle(socket) {

    socket.on("app:convert_queue", function (data) {

        const p = data.path;

        if (!fs.existsSync(p)) {

            socket.emit("app_response:errorcode:path_not_exist", `The path '${p}' does not exist.`);

            console.log("Directory does not exist");
        }

        downloadQueue(p, data.fields, socket);

    });

}

module.exports = {
    handle: handle
}