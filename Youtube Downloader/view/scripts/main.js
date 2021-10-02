import "./static/static.titlebar.js";

const addQueueItemButton = document.querySelector(".button-add-item-to-queue"),
    mainQueue = document.querySelector(".downloader-queue-items"),
    convertButton = document.querySelector(".button-convert-videos");

function createQueueItem() {

    const mainElement = document.createElement("div");
    mainElement.className = "queue-item";

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

    return mainElement;
}

function checkInputFields() {

    const queueItems = document.querySelectorAll(".queue-item"),
        tempObj = [];

    queueItems.forEach(function (item) {

        const url = item.querySelector(".queue-item-url"),
            fileName = item.querySelector(".queue-item-filename");

        const returningObject = {
            field: item,
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
        const objs = checkInputFields();

        if (objs.length == 0) {

            return;
        }


    });

});