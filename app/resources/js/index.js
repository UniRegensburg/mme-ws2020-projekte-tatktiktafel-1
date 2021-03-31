/* eslint-env browser */

import Config from "/app/resources/js/Config.js";
import maps from "/app/resources/js/Maps.js";
import Colyseus from "/app/resources/js/ColyseusProvider.js";

// global variables
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
  itemGetsDragged = false,
  client, roomGlobal, activeMap,
  draggablePositions = {
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

function initColyseusClient() {
  // initialize the client and the connection between the room and the client
  client = new Colyseus.Client(
    Config.SERVER_IP_ADRESS);
  let roomID = window.location.pathname.split("/").pop(),
    matchingRoomFound = false;
  // check if client with roomID already exists
  client.getAvailableRooms("tacticsRoom").then(rooms => {
    rooms.forEach((room) => {
      // if matching id found, connect to room
      if (roomID === room.roomId) {
        matchingRoomFound = true;
        client.joinById(roomID).then(room => {
          roomGlobal = room;
          initRoomStateListener();
          initChat();
        }).catch(e => {
          console.log("JOIN ERROR", e); //eslint-disable-line no-console
        });
      }
    });
    // if no matching id found, create new room
    if (!matchingRoomFound) {
      client.create("tacticsRoom", { roomID: roomID }).then(room => {
        roomGlobal = room;
        initRoomStateListener();
        initChat();
      }).catch(e => {
        console.log("JOIN ERROR", e); //eslint-disable-line no-console
      });
    }
  });

  function initRoomStateListener() {
    // initializes the update functions
    roomGlobal.onStateChange((state) => {
      // changes map if state map is different
      if (state.activeMap !== activeMap) {
        changeMap(state.activeMap);
        document.getElementById("drop-down-map-select").value = state
          .activeMap;
      }
      let img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);
      };
      // updates canvas to state canvas
      img.src = state.canvasURI;
      // updates draggable positions if any are different
      Object.keys(draggablePositions).forEach((key) => {
        let stateX = state.draggables[key].x,
          stateY = state.draggables[key].y,
          localX = draggablePositions[key].x,
          localY = draggablePositions[key].y;
        if (stateX !== localX || stateY !== localY) {
          document.getElementById(key).style.transform =
            `translate3d(${stateX}px, ${stateY}px, 0px)`;
          draggablePositions[key].x = stateX;
          draggablePositions[key].y = stateY;
        }
      });
    });
  }

  function initChat() {
    // initialize the chat with all its functions
    let chatHistory = document.getElementById("chat-box"),
      chatUserInput = document.getElementById("chat-message-text"),
      chatEnterButton = document.getElementById("chat-message-button");
    // update chat box on server message
    roomGlobal.onMessage("chat", (message) => {
      let paragraphElement = document.createElement("p");
      paragraphElement.innerHTML =
        `<b>${message.client.sessionId}:</b> ${message.message.message}`;
      chatHistory.appendChild(paragraphElement);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    });

    function onMessageEntered() {
      // notify server
      roomGlobal.send("chat", { message: chatUserInput.value });
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
}

function initCanvas() {
  // initialize the canvas with all its functions

  // set canvas size 
  var canvasSize = document.documentElement.clientHeight;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.style.width = canvasSize;
  canvas.style.height = canvasSize;

  // add event listener
  canvas.addEventListener("contextmenu", createPing);
  canvas.addEventListener("mousemove", draw, false);
  canvas.addEventListener("mousedown", setDrawPosition, false);
  canvas.addEventListener("mouseenter", setDrawPosition, false);
  canvas.addEventListener("mouseup", function() {
    ctx.globalCompositeOperation = "source-over";
    // notify server
    roomGlobal.send("canvaschanged", { canvasURI: canvas.toDataURL() });
  }, false);

  function createPing(e) {
    // draws a circle on the position of the mouse
    e.preventDefault();
    ctx.strokeStyle = document.getElementById("drop-down-color-select").value;
    ctx.lineWidth = Config.DRAW_DEFAULT_LINE_WIDTH;
    ctx.beginPath();
    ctx.arc(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, Config
      .DRAW_CIRCLE_RADIUS, 0, Config.ARC_END_ANGLE);
    ctx.stroke();
    // notify server
    roomGlobal.send("canvaschanged", { canvasURI: canvas.toDataURL() });
  }

  function setDrawPosition(event) {
    // calculates the relative position of the mouse in comparison to the canvas
    drawPos.x = event.clientX - canvas.offsetLeft;
    drawPos.y = event.clientY - canvas.offsetTop;
  }

  function draw(e) {
    // early return, if the left mouse button is not pressed
    if (e.buttons !== 1) { //button 1 = left mouse button
      return;
    }
    // early return, if an utility is selected
    else if (utilityIsSelected === true) {
      return;
    }
    // early return, if an item gets dragged
    else if (itemGetsDragged === true) {
      return;
    }
    ctx.beginPath(); // begin 
    if (eraserCheckbox.checked === true) {
      // erase
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = Config.DRAW_DEFAULT_ERASER_WIDTH;
    }
    else {
      // draw
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = Config.DRAW_DEFAULT_LINE_WIDTH;
      ctx.lineCap = Config.DRAW_DEFAULT_LINE_CAP;
      ctx.strokeStyle = document.getElementById("drop-down-color-select").value;
    }
    ctx.moveTo(drawPos.x, drawPos.y); // start position
    setDrawPosition(e); // new position
    ctx.lineTo(drawPos.x, drawPos.y); // target position
    ctx.stroke(); // execute
  }
}

function initDropDown() {
  // initializes the dropdownmenus and sets default values
  let dropDownMenuMapSelect = document.getElementById("drop-down-map-select"),
    dropDownMenuColorSelect = document.getElementById("drop-down-color-select");
  mapArray.forEach(function(map) {
    let option = document.createElement("option");
    option.innerHTML = map[1].name;

    dropDownMenuMapSelect.appendChild(option);
  });

  // initializes the eventlistener for changed menu-value
  changeMap(dropDownMenuMapSelect.value);
  dropDownMenuMapSelect.addEventListener("change", onMapDropDownChange);
  dropDownMenuColorSelect.addEventListener("change", onColorDropDownChange);

  // handles changed map event
  function onMapDropDownChange(event) {
    let selectedMapName = event.target.value;
    if (selectedMapName === activeMap) {
      return;
    }
    changeMap(selectedMapName);
    // notify server
    roomGlobal.send("mapchange", { activeMap: selectedMapName });
  }

  // handles changed color event
  function onColorDropDownChange(event) {
    let selectedColor = event.target.value;
    if (selectedColor === ctx.strokeStyle) {
      return;
    }
    ctx.strokeStyle = selectedColor;
  }
}

// changes map of the view
function changeMap(mapName) {
  activeMap = mapName;
  let mapPath, mapPathUrl;
  mapArray.forEach(function(map) {
    if (map[1].name === mapName) {
      mapPath = map[1].imagePath;
    }
  });
  mapPathUrl = "url('/app/resources/image/maps/" + mapPath + "')";
  background.style.backgroundImage = mapPathUrl;
}

// src: https://forum.kirupa.com/t/create-a-draggable-element-in-javascript/638149/5
function initDraggables() {
  var containerT = document.getElementById("containerT"),
    containerCT = document.getElementById("containerCT"),
    containerBomb = document.getElementById("containerBomb"),
    activeItem = null,
    active = false;

  // add Eventlistener on Terrorist-Marker 
  containerT.addEventListener("mousedown", dragStart, false);
  containerT.addEventListener("mouseup", dragEnd, false);
  containerT.addEventListener("mousemove", drag, false);

  // add Eventlistener on Counter-Terrorist-Marker 
  containerCT.addEventListener("mousedown", dragStart, false);
  containerCT.addEventListener("mouseup", dragEnd, false);
  containerCT.addEventListener("mousemove", drag, false);

  // add Eventlistener on Bomb-Marker 
  containerBomb.addEventListener("mousedown", dragStart, false);
  containerBomb.addEventListener("mouseup", dragEnd, false);
  containerBomb.addEventListener("mousemove", drag, false);

  function dragStart(e) {

    if (e.target !== e.currentTarget) {
      active = true;
      itemGetsDragged = true;

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

  function dragEnd() {
    let itemId, itemX, itemY, temp;
    if (activeItem !== null) {
      activeItem.initialX = activeItem.currentX;
      activeItem.initialY = activeItem.currentY;
    }
    itemId = activeItem.id;
    temp = activeItem.style.transform.replace(/translate3d|px|\(|\)/gi, "")
      .split(",");
    itemX = parseInt(temp[0].trim());
    itemY = parseInt(temp[1].trim());

    draggablePositions[itemId].x = itemX;
    draggablePositions[itemId].y = itemY;
    roomGlobal.send("draggablemoved", { id: itemId, x: itemX, y: itemY });

    active = false;
    activeItem = null;
    itemGetsDragged = false;
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
  // initializes grenade elements
  let hegrenade = document.getElementById("hegrenade"),
    decoy = document.getElementById("decoy"),
    flashbang = document.getElementById("flashbang"),
    incendiary = document.getElementById("incendiary"),
    smoke = document.getElementById("smoke"),
    canvas = document.getElementsByClassName("canvas")[0],
    chosenGrenade = null;

  // make grenade-icons clickable
  hegrenade.addEventListener("click", changeToHeGrenade);
  decoy.addEventListener("click", changeToDecoy);
  flashbang.addEventListener("click", changeToFlashbang);
  incendiary.addEventListener("click", changeToIncendiary);
  smoke.addEventListener("click", changeToSmoke);
  canvas.addEventListener("click", placeGrenade);

  // reset opacity of all grenades
  function resetPickedGrenades() {
    let grenades = document.getElementsByClassName("grenades"),
      i;
    for (i = 0; i < grenades.length; i++) {
      grenades[i].style.opacity = 1;
    }
  }
  
  // pick He-Grenade
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
  
  // pick Decoy
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
  
  // pick Flashbang
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
  
  // pick Incendiary
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
  
  // pick Smoke
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

  // places (picked) grenade on the user's mouse-position
  function placeGrenade(event) {
    let xPos = event.clientX - canvas.offsetLeft,
      yPos = event.clientY - canvas.offsetTop;

    // check which grenade is chosen
    if (chosenGrenade === "hegrenade") {
      drawGrenade();
    } else if (chosenGrenade === "decoy") {
      drawGrenade();
    } else if (chosenGrenade === "flashbang") {
      drawGrenade();
    } else if (chosenGrenade === "incendiary") {
      drawGrenade();
    } else if (chosenGrenade === "smoke") {
      drawGrenade();
    }
    // notify server
    roomGlobal.send("canvaschanged", { canvasURI: canvas.toDataURL() });

    // place chosen grenade
    function drawGrenade() {
      let c = document.getElementsByClassName("canvas")[0],
        ctx = c.getContext("2d"),
        newGrenade = document.getElementById(chosenGrenade);
      ctx.drawImage(newGrenade, xPos, yPos);
    }

  }
}

function initExportButton() {
  // initializes the export button with an event listeners
  let exportButton = document.getElementById("export-button");
  exportButton.addEventListener("click", exportToPNG, false);

  // exports the canvas to png
  function exportToPNG() {
    // creates two images based on the background and the canvas state; merges them into a hidden canvas and exports the context as png
    let canvasSize = document.documentElement.clientHeight,
      hiddenCanvas = document.getElementById("hiddenCanvas"),
      backgroundImg = new Image(),
      exportctx, mapPath, exportImg, mapPathUrl;

    hiddenCanvas.width = canvasSize;
    hiddenCanvas.height = canvasSize;
    hiddenCanvas.style.width = canvasSize;
    hiddenCanvas.style.height = canvasSize;
    exportctx = hiddenCanvas.getContext("2d");

    exportctx.drawImage(canvas, 0, 0);

    mapArray.forEach(function(map) {
      if (map[1].name === document.getElementById("drop-down-map-select")
        .value) {
        mapPath = map[1].imagePath;
      }
    });
    mapPathUrl = "resources/image/maps/" + mapPath;
    backgroundImg.src = mapPathUrl;
    backgroundImg.onload = function() {
      exportctx.globalCompositeOperation = "destination-over";
      exportctx.drawImage(backgroundImg, 0, 0);
      exportImg = hiddenCanvas.toDataURL("image/png");
      download(exportImg);
    };

    // downloads the png
    function download(url) {
      fetch(url).then(function(t) {
        return t.blob().then((b) => {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.setAttribute("download", "tacticsgo-export.png");
          a.click();
        });
      });
    }
  }
}

function initClearCanvasAndResetDraggablesButton() {
  // initializes the clear canvas and reset draggables buttons with their eventlisteners
  let clearCanvasButton = document.getElementById("clear-canvas-button"),
    resetDraggablesButton = document.getElementById("reset-draggables-button");

  clearCanvasButton.addEventListener("click", clearCanvas, false);
  resetDraggablesButton.addEventListener("click", resetDraggables);

  // clears the canvas and sends event to server
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    roomGlobal.send("canvaschanged", { canvasURI: canvas.toDataURL() });
  }

  // resets draggables and sends event to server
  function resetDraggables() {
    roomGlobal.send("draggablesreset");
  }
}

function init() {
  // calls all init functions
  initColyseusClient();
  initCanvas();
  initDropDown();
  initDraggables();
  initGrenades();
  initExportButton();
  initClearCanvasAndResetDraggablesButton();
}

init();