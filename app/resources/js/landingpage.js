import Config from "/app/resources/js/Config.js";

function initCreateButton() {
    var createButton = document.getElementById("btnCreateRoom"),
    submitButton = document.getElementById("btnEnterRoom");

    createButton.onclick = function() {createRoom();};
    submitButton.onclick = function() {enterRoom();};
}

function createRoom() {
    var roomCode = Math.floor(Math.random() * (Config.MAX_M - Config.MIN_M + 1)) + Config.MIN_M;
    console.log(roomCode);
    console.log("Room created!");
}

function enterRoom() {
    console.log("Room entered!");
}


function init() {
    initCreateButton();
}

init();