/* eslint-env browser */

import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/image/maps/Maps.js";
import Colyseus from "/app/resources/js/ColyseusProvider.js";
//import initDraggables from "/app/recources/js/draggables.js";

var canvas = document.getElementById("canvas"),
	background = document.getElementById("background"),
	ctx = canvas.getContext("2d"),
	eraserCheckbox = document.getElementById("erase-checkbox"),

	drawPos = {
		x: 0,
		y: 0,
	},
	mapArray = Object.entries(maps),
	utilityIsSelected = false,
	client, roomGlobal, activeMap,
	draggablePositions = { //eslint-disable-line
		t1: {
			x: 0,
			y: 0,
		},
		t2: {
			x: 0,
			y: 0,
		},
		t3: {
			x: 0,
			y: 0,
		},
		t4: {
			x: 0,
			y: 0,
		},
		t5: {
			x: 0,
			y: 0,
		},
		ct1: {
			x: 0,
			y: 0,
		},
		ct2: {
			x: 0,
			y: 0,
		},
		ct3: {
			x: 0,
			y: 0,
		},
		ct4: {
			x: 0,
			y: 0,
		},
		ct5: {
			x: 0,
			y: 0,
		},
		bomb: {
			x: 0,
			y: 0,
		},
	};

function setDrawPosition(event) {
	drawPos.x = event.clientX - canvas.offsetLeft;
	drawPos.y = event.clientY - canvas.offsetTop;
}

function draw(e) {
	/* Abfrage, ob linke Maustaste gedrückt ist. */
	if (e.buttons !== 1) { //button 1 = linke maustaste, muss gedrückt sein
		return;
	}
	/* Abfrage, ob eine utility aktiviert ist. */
	else if(utilityIsSelected === true){
	return;
	}
	ctx.beginPath(); // begin
	/* Radieren */
	if(eraserCheckbox.checked === true){
		ctx.globalCompositeOperation = "destination-out";
		ctx.lineWidth = Config.DRAW_DEFAULT_ERASER_WIDTH;
	}
	/* Zeichnen */
	else{
	ctx.globalCompositeOperation = "source-over"; 
	ctx.lineWidth = Config.DRAW_DEFAULT_LINE_WIDTH;
	ctx.lineCap = Config.DRAW_DEFAULT_LINE_CAP;
	ctx.strokeStyle = document.getElementById("drop-down-color-select").value;
	}
	ctx.moveTo(pos.x, pos.y); // Startposition
	setDrawPosition(e); //Neue Position wird festgelegt
	ctx.lineTo(pos.x, pos.y); // Zielposition
	ctx.stroke(); // Ausführen
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
		// ctx.globalCompositeOperation = "source-over";
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
				ctx.clearRect(0,0,canvas.width,canvas.height);
				
				ctx.drawImage(img,0,0);
			};
			// console.log(state.canvasURI);
			img.src = state.canvasURI;
			Object.keys(draggablePositions).forEach((key) => {
				let stateX = state.draggables[key].x, 
				stateY = state.draggables[key].y, 
				localX = draggablePositions[key].x,
				localY = draggablePositions[key].y;
				// console.log(stateX,stateY,localX,localY);
				if (stateX !== localX || stateY !== localY) {
					document.getElementById(key).style.transform = `translate3d(${stateX}px, ${stateY}px, 0px)`;
					draggablePositions[key].x = stateX;
					draggablePositions[key].y = stateY;
				}

			});
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

				activeItem.xOffset = draggablePositions[activeItem.id].x;
				activeItem.yOffset = draggablePositions[activeItem.id].y;

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
		let itemId, itemX, itemY, temp;
      if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
      }
      itemId = activeItem.id;
      temp = activeItem.style.transform.replace(/translate3d|px|\(|\)/gi, "").split(",");
      itemX = parseInt(temp[0].trim());
      itemY = parseInt(temp[1].trim());

      draggablePositions[itemId].x = itemX;
      draggablePositions[itemId].y = itemY;
      roomGlobal.send("draggablemoved", {id: itemId, x: itemX, y: itemY});

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
	let hegrenade = document.getElementById("hegrenade"),
	decoy = document.getElementById("decoy"),
	flashbang = document.getElementById("flashbang"),
	incendiary = document.getElementById("incendiary"),
	smoke = document.getElementById("smoke"),
	canvas = document.getElementsByClassName("canvas")[0],
	chosenGrenade = null;

	hegrenade.onclick = function() {changeToHeGrenade();};
	decoy.onclick = function() {changeToDecoy();};
	flashbang.onclick = function() {changeToFlashbang();};
	incendiary.onclick = function() {changeToIncendiary();};
	smoke.onclick = function() {changeToSmoke();};

	canvas.onclick = function() {placeGrenade();};

	function resetPickedGrenades() {
		let grenades = document.getElementsByClassName("grenades"), i;
		for (i = 0; i < grenades.length; i++) {
			grenades[i].style.opacity = 1;
			console.log(grenades[i]);
		}
	}	

	function changeToHeGrenade() {
		if (chosenGrenade !== "hegrenade") {
			resetPickedGrenades();
			canvas.id = "canvasHeGrenade";
			chosenGrenade = "hegrenade";
			hegrenade.style.opacity = 0.5;
			utilityIsSelected = true;
		} else {
			canvas.id = "canvas";
			chosenGrenade = null;
			hegrenade.style.opacity = 1;
			utilityIsSelected = false;
		}
	}
	function changeToDecoy() {
		if (chosenGrenade !== "decoy") {
			resetPickedGrenades();
			canvas.id = "canvasDecoy";
			chosenGrenade = "decoy";
			decoy.style.opacity = 0.5;
			utilityIsSelected = true;
		} else {
			canvas.id = "canvas";
			chosenGrenade = null;
			decoy.style.opacity = 1;
			utilityIsSelected = false;
		}
	}
	function changeToFlashbang() {
		if (chosenGrenade !== "flashbang") {
			resetPickedGrenades();
			canvas.id = "canvasFlashbang";
			chosenGrenade = "flashbang";
			flashbang.style.opacity = 0.5;
			utilityIsSelected = true;
		} else {
			canvas.id = "canvas";
			chosenGrenade = null;
			flashbang.style.opacity = 1;
			utilityIsSelected = false;
		}

	}
	function changeToIncendiary() {
		if (chosenGrenade !== "incendiary") {
			resetPickedGrenades();
			canvas.id = "canvasIncendiary";
			chosenGrenade = "incendiary";
			incendiary.style.opacity = 0.5;
			utilityIsSelected = true;
		} else {
			canvas.id = "canvas";
			chosenGrenade = null;
			incendiary.style.opacity = 1;
			utilityIsSelected = false;
		}
	}
	function changeToSmoke() {
		if (chosenGrenade !== "smoke") {
			resetPickedGrenades();
			canvas.id = "canvasSmoke";
			chosenGrenade = "smoke";
			smoke.style.opacity = 0.5;
			utilityIsSelected = true;
		} else {
			canvas.id = "canvas";
			chosenGrenade = null;
			smoke.style.opacity = 1;
			utilityIsSelected = false;
		}
	}
	
	function placeGrenade() {
		let xPos = event.clientX - canvas.offsetLeft,
		yPos = event.clientY - canvas.offsetTop;

		if (chosenGrenade === "hegrenade") {
			drawGrenade();
		} else if (chosenGrenade === "decoy") {
			drawGrenade();
			console.log("Decoy");
		} else if (chosenGrenade === "flashbang") {
			drawGrenade();
			console.log("Flashbang");
		} else if (chosenGrenade === "incendiary") {
			drawGrenade();
			console.log("Incendiary");
		} else if (chosenGrenade === "smoke") {
			drawGrenade();
			console.log("Smoke");
		}
		roomGlobal.send("canvaschanged",{canvasURI: canvas.toDataURL()});

		function drawGrenade() {
			let c = document.getElementsByClassName("canvas")[0], ctx = c.getContext("2d"), newGrenade = document.getElementById(chosenGrenade);
			ctx.drawImage(newGrenade, xPos, yPos);
		}

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