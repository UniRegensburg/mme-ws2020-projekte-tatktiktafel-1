/* eslint-env browser */

import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/image/maps/Maps.js";
import Colyseus from "/app/resources/js/ColyseusProvider.js";

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

function init() {
	ctx.strokeStyle = Config.DRAW_DEFAULT_COLOR; //default color geschickter setzen
	initColyseusClient();
	initCanvas();
	initDropDown();
}

init();