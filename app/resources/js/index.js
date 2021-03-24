/* eslint-env browser */

import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/image/maps/Maps.js";
import Colyseus from "/app/resources/js/ColyseusProvider.js";
//import initDraggables from "/app/recources/js/draggables.js";

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	pos = {
		x: 0,
		y: 0,
	},
	mapArray = Object.entries(maps),
	client, roomGlobal, activeMap;

function setDrawPosition(event) {
	pos.x = event.clientX - canvas.offsetLeft;
	pos.y = event.clientY - canvas.offsetTop;
}

function draw(e) {
	if (e.buttons !== 1) { //button 1 = linke maustaste, muss gedrückt sein
		return;
	}
	ctx.beginPath(); // begin

	ctx.lineWidth = Config.DRAW_DEFAULT_LINE_WIDTH;
	ctx.lineCap = Config.DRAW_DEFAULT_LINE_CAP;
	ctx.strokeStyle = Config.DRAW_DEFAULT_COLOR;

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

function changeMap(mapName) {
	console.log("function: changeMap");
	activeMap = mapName;
	let mapPath, background, canvasMin;
	mapArray.forEach(function(map) {
		if (map[1].name === mapName) {
			mapPath = map[1].imagePath;
		}
	});
	mapPath = "/app/resources/image/maps/" + mapPath;
	background = new Image();
	background.src = mapPath; 
	canvasMin = Math.min(canvas.width, canvas.height);
	background.onload = function() {
		ctx.drawImage(background,0,0,canvasMin,canvasMin);
	};
}

// Setzt außerdem Default Map
function initDropDown() {
	let dropDownMenuMapSelect = document.getElementById("drop-down-map-select");
	mapArray.forEach(function(map) {
		let option = document.createElement("option");
		option.innerHTML = map[1].name;

		dropDownMenuMapSelect.appendChild(option);
	});

	changeMap(dropDownMenuMapSelect.value);
	dropDownMenuMapSelect.addEventListener("change", onMapDropDownChange);
}

function initCanvas() {
	canvas.addEventListener("mousemove", draw, false);
	canvas.addEventListener("mousedown", setDrawPosition, false);
	canvas.addEventListener("mouseenter", setDrawPosition, false);
	canvas.addEventListener("mouseup",function() {
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
			console.log(state.canvasURI);
			img.src = state.canvasURI;
		});
	}).catch(e => {
		console.log("JOIN ERROR", e);
	});
}

//src: https://forum.kirupa.com/t/create-a-draggable-element-in-javascript/638149/5
function initDraggables() {
	//var container = document.querySelector(".container");
	var containerT = document.getElementById("containerT");
	var containerCT = document.getElementById("containerCT");
	var containerBomb = document.getElementById("containerBomb");

    var activeItem = null;
	console.log(containerT);

    var active = false;

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

    function dragEnd(e) {
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
	document.getElementById("hegrenade").onclick = function() {changeToHeGrenade()};
	document.getElementById("decoy").onclick = function() {changeToDecoy()};
	document.getElementById("flashbang").onclick = function() {changeToFlashbang()};
	document.getElementById("incendiary").onclick = function() {changeToIncendiary()};
	document.getElementById("smoke").onclick = function() {changeToSmoke()};

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
	initColyseusClient();
	initCanvas();
	initDropDown();
	initDraggables();
	initGrenades();
}

init();