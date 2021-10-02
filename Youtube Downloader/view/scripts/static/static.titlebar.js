const { ipcRenderer } = require("electron");

const controlButtons = document.querySelectorAll(".titlebar-controls-button");

controlButtons.forEach(function (button) {

    const ipcAttribute = button.getAttribute("ipc-send");

    if (ipcAttribute == null) return;

    button.addEventListener("click", function (event) {


        ipcRenderer.send(ipcAttribute, 0);

    });

});