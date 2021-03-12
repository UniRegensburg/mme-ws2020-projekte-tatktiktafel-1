/* eslint-env browser */

import Config from "/app/resources/js/Config.js";

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	pos = {
		x: 0,
		y: 0,
	};

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

function init() {
	canvas.addEventListener("mousemove", draw, false);
	canvas.addEventListener("mousedown", setDrawPosition, false);
	canvas.addEventListener("mouseenter", setDrawPosition, false);
}

init();