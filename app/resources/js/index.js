/* eslint-env browser */

import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/image/maps/Maps.js";
import Colyseus from "/app/resources/js/ColyseusProvider.js";
//import initDraggables from "/app/recources/js/draggables.js";

var canvas = document.getElementById("canvas"),
	background = document.getElementById("background"),
	ctx = canvas.getContext("2d"),
	eraserCheckbox = document.getElementById("erase-checkbox"),

	pos = {
		x: 0,
		y: 0,
	},
	mapArray = Object.entries(maps),
	client, roomGlobal, activeMap;

function setDrawPosition(event) {
	pos.x = event.clientX - canvas.offsetLeft;
	pos.y = event.clientY - canvas.offsetTop; //magische zahl, um abstand nach oben zu reparieren
}

function draw(e) {
	if (e.buttons !== 1) { //button 1 = linke maustaste, muss gedrückt sein
		return;
	}

/* Abfrage, ob eraser checkbox aktiviert ist.*/
	if(eraserCheckbox.checked === true){
		erase(e);
	}
	else{
	ctx.beginPath(); // begin
	
	ctx.globalCompositeOperation = "source-over"; // art, wie über andere sachen übermalt werden sollen
	ctx.lineWidth = Config.DRAW_DEFAULT_LINE_WIDTH;
	ctx.lineCap = Config.DRAW_DEFAULT_LINE_CAP;

	ctx.moveTo(pos.x, pos.y); // from
	setDrawPosition(e);
	ctx.lineTo(pos.x, pos.y); // to

	ctx.stroke(); // draw
	}
}

/* Erase funktion. */
function erase(e){
	ctx.beginPath(); // begin

	ctx.lineWidth = Config.DRAW_DEFAULT_ERASER_WIDTH;
	ctx.globalCompositeOperation = "destination-out";

	ctx.moveTo(pos.x, pos.y); // from
	setDrawPosition(e);
	ctx.lineTo(pos.x, pos.y); // to

	ctx.stroke(); // draw
}

function onMapDropDownChange(event) {
	let selectedMapName = event.target.value;
	if (selectedMapName === activeMap) {
		return;
	}
	changeMap(selectedMapName);
	roomGlobal.send("mapchange", {activeMap: selectedMapName});
}

function onColorDropDownChange(event) {
	let selectedColor = event.target.value;
	if (selectedColor === ctx.strokeStyle) {
		return;
	}
	ctx.strokeStyle = selectedColor;
}

function changeMap(mapName) {
	// console.log("function: changeMap");
	activeMap = mapName;
	let mapPath, /* backgroundImg, */ mapPathUrl;
	mapArray.forEach(function(map) {
		if (map[1].name === mapName) {
			mapPath = map[1].imagePath;
		}
	});
	mapPathUrl = "url('/app/resources/image/maps/" + mapPath + "')";
	console.log(mapPath + " -> " + mapPathUrl);
	background.style.backgroundImage = mapPathUrl;
	/* Alte Version; Neue Version muss verifiziert werden.
	backgroundImg = new Image();
	backgroundImg.src = mapPath; 
	backgroundImg.onload = function() {
		background.style.backgroundImage = mapPathUrl;
	};*/
}

// Setzt außerdem Default Map
function initDropDown() {
	let dropDownMenuMapSelect = document.getElementById("drop-down-map-select"),
	dropDownMenuColorSelect = document.getElementById("drop-down-color-select");
	mapArray.forEach(function(map) {
		let option = document.createElement("option");
		option.innerHTML = map[1].name;

		dropDownMenuMapSelect.appendChild(option);
	});

	changeMap(dropDownMenuMapSelect.value);
	dropDownMenuMapSelect.addEventListener("change", onMapDropDownChange);
	dropDownMenuColorSelect.addEventListener("change", onColorDropDownChange);
}

function initClearCanvasButton(){
	let clearCanvasButton = document.getElementById("clear-canvas-button");
	clearCanvasButton.addEventListener("click",clearCanvas,false);
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	roomGlobal.send("canvaschanged", {canvasURI: canvas.toDataURL()});
	console.log("clearCanvas");
}

function initCanvas() {

	//set canvas size 
	var canvasSize = document.documentElement.clientHeight;
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	canvas.style.width = canvasSize;
	canvas.style.height = canvasSize;

	canvas.addEventListener("mousemove", draw, false);
	canvas.addEventListener("mousedown", setDrawPosition, false);
	canvas.addEventListener("mouseenter", setDrawPosition, false);
	canvas.addEventListener("mouseup",function() {
		ctx.globalCompositeOperation = "source-over";
		roomGlobal.send("test", {timestamp: Date.now()});
		roomGlobal.send("canvaschanged", {canvasURI: canvas.toDataURL()});
	}, false);
}

function initColyseusClient() {
	client = new Colyseus.Client("ws://localhost:2567"); // localhost muss durch entsprechende Server-IP ersetzt werden.

	client.joinOrCreate("test").then(room => {
		console.log(room.sessionId, "joined", room.name);
		roomGlobal = room;
		roomGlobal.onStateChange((state) => {
			console.log(new Date(state.lastChanged).toTimeString());
			console.log("testEventSinceServerStart: " + state.testEventSinceServerStart);
			if (state.activeMap !== activeMap) {
				changeMap(state.activeMap);
				document.getElementById("drop-down-map-select").value = state.activeMap;
			}
			let img = new Image();
			img.onload = function() {
				ctx.drawImage(img,0,0); //,canvasMin,canvasMin);
			};
			// console.log(state.canvasURI);
			img.src = state.canvasURI;
		});
	}).catch(e => {
		console.log("JOIN ERROR", e);
	});
}

function initChat() {
	let chatHistory = document.getElementById("chat-box"),
		chatUserInput = document.getElementById("chat-message-text"),
		chatEnterButton = document.getElementById("chat-message-button");
	roomGlobal.onMessage("chat", (message) => {
		let paragraphElement = document.createElement("p");
		paragraphElement.innerHTML = `<b>${message.client.sessionId}:</b> ${message.message.message}`;
		chatHistory.appendChild(paragraphElement);
	});
	function onMessageEntered() {
		roomGlobal.send("chat", { message: chatUserInput.value});
		chatUserInput.value = "";		
	}
	chatEnterButton.addEventListener("click", function() {
		onMessageEntered();
	});
	chatUserInput.addEventListener("keydown", function(event) {
		if (event.code === "Enter") {
			event.preventDefault();
			onMessageEntered();
		}
	});
}

// Hack, sollte wohl mit await o.ä. gelöst werden
function awaitClientInit() {
	if (roomGlobal !== undefined) {
		initChat();
		return;
	}
	setTimeout(awaitClientInit,1000);
}

//src: https://forum.kirupa.com/t/create-a-draggable-element-in-javascript/638149/5
function initDraggables() {
	var containerT = document.getElementById("containerT"),
		containerCT = document.getElementById("containerCT"),
		containerBomb = document.getElementById("containerBomb"),
        activeItem = null,
		active = false;

    containerT.addEventListener("mousedown", dragStart, false);
    containerT.addEventListener("mouseup", dragEnd, false);
    containerT.addEventListener("mousemove", drag, false);

	containerCT.addEventListener("mousedown", dragStart, false);
    containerCT.addEventListener("mouseup", dragEnd, false);
    containerCT.addEventListener("mousemove", drag, false);

	containerBomb.addEventListener("mousedown", dragStart, false);
    containerBomb.addEventListener("mouseup", dragEnd, false);
    containerBomb.addEventListener("mousemove", drag, false);

    function dragStart(e) {

		if (e.target !== e.currentTarget) {
			active = true;

			// this is the item we are interacting with
			activeItem = e.target;

			if (activeItem !== null) {
				if (!activeItem.xOffset) {
					activeItem.xOffset = 0;
				}

				if (!activeItem.yOffset) {
					activeItem.yOffset = 0;
				}

				activeItem.initialX = e.clientX - activeItem.xOffset;
				activeItem.initialY = e.clientY - activeItem.yOffset;
			}
		}
    }

    function dragEnd(e) { //eslint-disable-line no-unused-vars
      if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
      }

      active = false;
      activeItem = null;
    }

    function drag(e) {
      if (active) {
		e.preventDefault();  

		activeItem.currentX = e.clientX - activeItem.initialX;
		activeItem.currentY = e.clientY - activeItem.initialY;

        activeItem.xOffset = activeItem.currentX;
        activeItem.yOffset = activeItem.currentY;

        setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
}

function initGrenades() {
	document.getElementById("hegrenade").onclick = function() {changeToHeGrenade();};
	document.getElementById("decoy").onclick = function() {changeToDecoy();};
	document.getElementById("flashbang").onclick = function() {changeToFlashbang();};
	document.getElementById("incendiary").onclick = function() {changeToIncendiary();};
	document.getElementById("smoke").onclick = function() {changeToSmoke();};

	function changeToHeGrenade() {
		document.getElementsByClassName("canvas")[0].id = "canvasHeGrenade";
	}
	function changeToDecoy() {
		document.getElementsByClassName("canvas")[0].id = "canvasDecoy";
	}
	function changeToFlashbang() {
		document.getElementsByClassName("canvas")[0].id = "canvasFlashbang";
	}
	function changeToIncendiary() {
		document.getElementsByClassName("canvas")[0].id = "canvasIncendiary";
	}
	function changeToSmoke() {
		document.getElementsByClassName("canvas")[0].id = "canvasSmoke";
	}
}

function init() {
	ctx.strokeStyle = Config.DRAW_DEFAULT_COLOR; //default color geschickter setzen
	initColyseusClient();
	initCanvas();
	initDropDown();
	initDraggables();
	initGrenades();
	initClearCanvasButton();
	awaitClientInit();

	// window.addEventListener("scroll",() => {window.scrollTo(0,0);});
}

init();