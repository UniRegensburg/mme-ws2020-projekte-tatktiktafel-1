/* eslint-env browser */
/* global Colyseus */
import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/image/maps/Maps.js";

// import * as Colyseus from "/libs/colyseus.js/colyseus.js";

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	pos = {
		x: 0,
		y: 0,
	},
	mapArray = Object.entries(maps),
	client;

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
	changeMap(selectedMapName);
}

function changeMap(mapName) {
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
}

function initColyseusClient() {
	console.log(Colyseus);
	client = new Colyseus.Client("ws://localhost:2567");
	console.log(client);
}

function init() {
	initCanvas();
	initDropDown();
	initColyseusClient();

}

init();