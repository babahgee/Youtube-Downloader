const path = require('path'),
    fs = require('fs'),
    ytdl = require('ytdl-core');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function guid(len) {
    len = typeof len == "number" ? len : 12;

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        generatedID = "";

    for (let i = 0; i < len; i++) {

        generatedID += chars.charAt(Math.floor(Math.random() * chars.length));

    }

    return {
        id: generatedID,
        timestamp: Date.now(),
        length: len,
        /**
         * Filters generated ID
         * @param {"numbers" | "letters" | "lettersUpperCase" | "lettersLowerCase"} filterName
         */
        filter: function (filterName) {

            let tempID = "";

            switch (filterName) {
                case "numbers":

                    tempID = "";

                    for (let i = 0; i < this.id.length; i++) {

                        const char = this.id.charAt(i);

                        // Try parsing the char into a number;
                        const num = parseFloat(char);

                        if (!isNaN(num)) tempID += num;

                    }

                    return tempID;

                    break;
                case "letters":

                    tempID = "";

                    for (let i = 0; i < this.id.length; i++) {

                        const char = this.id.charAt(i);

                        // Try parsing the char into a number;
                        const num = parseFloat(char);

                        if (isNaN(num)) tempID += char;

                    }

                    return tempID;

                    break;
                case "lettersLowerCase":

                    tempID = "";

                    for (let i = 0; i < this.id.length; i++) {

                        const char = this.id.charAt(i);

                        // Try parsing the char into a number;
                        const num = parseFloat(char);

                        if (isNaN(num) && char == char.toLowerCase()) {
                            tempID += char;
                        };

                    }

                    return tempID;

                    break;
                case "lettersUpperCase":

                    tempID = "";

                    for (let i = 0; i < this.id.length; i++) {

                        const char = this.id.charAt(i);

                        // Try parsing the char into a number;
                        const num = parseFloat(char);

                        if (isNaN(num) && char == char.toUpperCase()) {
                            tempID += char;
                        };

                    }

                    return tempID;

                    break;
                default:

                    throw new Error(`The given parameter '${filterName}' is not a recognized filter name for this method.`);

                    return;
                    break;
            }

        }
    }
}

/**
 * Downloads queue.
 * @param {string} p
 * @param {Array} queue
 * @param {Socket} socket
 */
function downloadQueue(p, queue, socket) {

    if (queue.length == 0) return;

    queue.forEach(async function (item) {

        let output = item.fileName == null ? `video-${guid(18).id}` : item.fileName,
            size = 0,
            contentLength = 0;

        let stream = await ytdl(item.url, {
            quality: "highestaudio"
        });

        stream.on("response", function (res) {
            size = res.headers["content-length"] !== undefined ? (res.headers["content-length"] / 1024) : 0;
            contentLength = res.headers["content-length"] !== undefined ? (res.headers["content-length"]) : 0;

            socket.emit("downloader:onprogress", {
                percentage: 0,
                field: item.field,
                size: contentLength
            });
        });

        stream.on("end", function () {
            stream.destroy();
        });


        let f = ffmpeg(stream);

        f.audioBitrate(128);
        f.save(path.join(p, output + ".mp3"));

        f.on("progress", function (progress) {

            const percentage = Math.round(100 / size * progress.targetSize);

            console.log(percentage);

            socket.emit("downloader:onprogress", {
                percentage: percentage < 100 ? percentage : 100,
                field: item.field,
                size: contentLength
            });

        });

        f.on("end", function () {
            console.log("Video succesfully downloaded");

            stream.destroy();

            socket.emit("downloader:onfinish", {
                percentage: 100,
                field: item.field,
                size: contentLength
            });

            f.removeAllListeners("progress");
            f.removeAllListeners("end");


            stream.removeAllListeners("response");
            f = null;
            stream = null;
        });
    });

}

module.exports = {
    downloadQueue: downloadQueue
};