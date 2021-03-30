import Config from "/app/resources/js/Config.js";

function initCreateButton() {
    let createButton = document.getElementById("btnCreateRoom"),
    submitButton = document.getElementById("btnEnterRoom");

    createButton.addEventListener("click",createRoom);
    submitButton.addEventListener("click",enterRoom);
}

function createRoom() {
    let roomCode = Math.floor(Math.random() * (Config.MAX_M - Config.MIN_M + 1)) + Config.MIN_M;
    redirect(roomCode);
}

function enterRoom(e) {
    e.preventDefault();
    let roomCode = document.getElementById("roomCodeInput").value; 
    redirect(roomCode);
}

function redirect(roomCode) {
    location.replace(`http://localhost:8000/app/${roomCode}`);   
}

function init() {
    initCreateButton();
}

init();