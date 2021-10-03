import { generateUniqueID, socket } from "./static/static.essentials.js";
import "./static/static.titlebar.js";

const addQueueItemButton = document.querySelector(".button-add-item-to-queue"),
    mainQueue = document.querySelector(".downloader-queue-items"),
    convertButton = document.querySelector(".button-convert-videos");

const fields = {};

function createQueueItem() {

    const fieldID = generateUniqueID(26).id;

    const mainElement = document.createElement("div");
    mainElement.className = "queue-item";
    mainElement.setAttribute("item-id", fieldID);

    const urlInput = document.createElement("div");
    urlInput.className = "queue-item-url";
    urlInput.setAttribute("contenteditable", true);
    urlInput.setAttribute("placeholder", "Enter YouTube URL");
    urlInput.setAttribute("spellcheck", false);
    mainElement.appendChild(urlInput);

    urlInput.addEventListener("keydown", function (event) {
        switch (event.keyCode) {
            case 13:

                event.preventDefault();

                break;
        }
    });

    urlInput.addEventListener("paste", function (event) {
        event.preventDefault();

        const text = event.clipboardData.getData('text/plain');

        document.execCommand('insertText', false, text);
    });

    const arrow = document.createElement("div");
    arrow.className = "queue-item-arrow";
    mainElement.appendChild(arrow);

    const fileNameInput = document.createElement("div");
    fileNameInput.className = "queue-item-filename";
    fileNameInput.setAttribute("contenteditable", true);
    fileNameInput.setAttribute("placeholder", "Enter file name");
    fileNameInput.setAttribute("spellcheck", false);
    mainElement.appendChild(fileNameInput);

    const overlay = document.createElement("div");
    overlay.className = "queue-item-overlay";
    mainElement.appendChild(overlay);

    const container = document.createElement("div");
    container.className = "container";
    overlay.appendChild(container);

    const progressBarWrapper = document.createElement("div");
    progressBarWrapper.className = "queue-item-progress-wrapper";
    container.appendChild(progressBarWrapper);

    const progressBar = document.createElement("div");
    progressBar.className = "queue-item-progress";
    progressBarWrapper.appendChild(progressBar);


    fields[fieldID] = mainElement;

    return mainElement;
}

function checkInputFields() {

    const queueItems = document.querySelectorAll(".queue-item"),
        tempObj = [];

    queueItems.forEach(function (item) {

        const url = item.querySelector(".queue-item-url"),
            fileName = item.querySelector(".queue-item-filename"),
            fieldID = item.getAttribute("item-id");

        const returningObject = {
            field: fieldID,
            url: null,
            fileName: fileName.innerText == "" ? null : fileName.innerText
        };

        const value = url.innerText;

        // If value is not empty.
        if (value == "" || value == undefined) {

            url.classList.add("error");

            setTimeout(function () {
                url.classList.remove("error");
            }, 2000);

            return;
        }

        // Check protocol.

        /**@type {Array} */
        let seperator = value.split(":"),
            protocol = seperator[0],
            domain = value.substring(protocol.length + 7).split("/")[0];

        if (!seperator[0] == "http" && !seperator[0] == "https") {

            url.classList.add("error");

            setTimeout(function () {
                url.classList.remove("error");
            }, 2000);

            return;
        }

        if (domain !== "youtube.com") {

            url.classList.add("error");

            setTimeout(function () {
                url.classList.remove("error");
            }, 2000);

            return;

        }

        returningObject.url = value;

        tempObj.push(returningObject);
    });

    return tempObj;
}

window.addEventListener("load", function () {

    addQueueItemButton.addEventListener("click", function (e) {

        const item = createQueueItem();

        mainQueue.appendChild(item);

    });

    convertButton.addEventListener("click", function () {
        const objs = checkInputFields(),
            path = document.querySelector(".downloader-output-path");

        if (objs.length == 0) {

            return;
        }

        if (path.innerText == "") return; 

        socket.emit("app:convert_queue", {path: path.innerText, fields: objs});

    });

    socket.on("downloader:onprogress", function (data) {
        const fieldID = data.field;

        if (typeof fields[fieldID] == "undefined") return;

        const field = fields[fieldID],
            progressBar = field.querySelector(".queue-item-progress");

        field.classList.add("active");
        progressBar.style.width = data.percentage + "%";
    });

    socket.on("downloader:onfinish", function (data) {
        const fieldID = data.field;

        if (typeof fields[fieldID] == "undefined") return;

        const field = fields[fieldID],
            progressBar = field.querySelector(".queue-item-progress");

        progressBar.style.width = "100%";

        setTimeout(function () {
            field.classList.remove("active");
        }, 1000);
    });

});