import Config from "/app/resources/js/Config.js";

function initButtons() {
    let createButton = document.getElementById("btnCreateRoom"),
    submitButton = document.getElementById("btnEnterRoom");

    createButton.addEventListener("click",createRoom);
    submitButton.addEventListener("click",enterRoom);
}

// Generate random 5-digit code and enter room
function createRoom() {
    let roomCode = Math.floor(Math.random() * (Config.MAX_M - Config.MIN_M + 1)) + Config.MIN_M;
    redirect(roomCode);
}

// Get 5-digit code from input-field and enter room
function enterRoom(e) {
    e.preventDefault();
    let roomCode = document.getElementById("roomCodeInput").value; 
    redirect(roomCode);
}

// Enter room by replacing URL
function redirect(roomCode) {
    location.replace(`http://localhost:8000/app/${roomCode}`);   
}

function init() {
    initButtons();
}

init();