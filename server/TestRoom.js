/* eslint-env node */
/* eslint-disable no-unused-vars */

const colyseus = require("colyseus");
const RoomState = require("./RoomState.js");

module.exports = class TestRoom extends colyseus.Room {

  onCreate(options) {
    console.log("TestRoom.onCreate():");
    this.roomId = options.roomID;
    console.log("roomId:", this.roomId);
    this.setState(new RoomState());

    this.state.activeMap = "Inferno"; // Hack, bitte noch eleganter lösen
    this.state.testEventSinceServerStart = 0; // Hack, bitte noch eleganter lösen
    this.state.lastChanged = Date.now();

    this.onMessage("test", (client,message) => {
      if (this.state.testEventSinceServerStart) {
        this.state.testEventSinceServerStart++;
      } else {
        this.state.testEventSinceServerStart = 1;
      }
      this.state.lastChanged = message.timestamp;

    });
    this.onMessage("mapchange", (client,message) => {
      this.state.activeMap = message.activeMap;
    });
    this.onMessage("canvaschanged", (client,message) => {
      this.state.canvasURI = message.canvasURI;
    });
    this.onMessage("draggablemoved", (client,message) => {
      this.state.draggables[message.id].x = message.x;
      this.state.draggables[message.id].y = message.y;
      console.log(message);
    });

    this.onMessage("chat", (client,message) => {
      this.broadcast("chat", {client: client, message: message});
    });
  }

  onAuth(client, options, request) {
    console.log("TestRoom.onAuth():");
    return true;
  }

  onJoin(client, options, auth) {
    console.log("TestRoom.onJoin():");
    console.log("SessionId: " + client.sessionId);
  }

  onLeave(client, consented) {
    console.log("TestRoom.onLeave()");
    console.log("SessionId: " + client.sessionId);
    console.log("Consented: " + consented);
  }

  onDispose() {
    console.log("TestRoom.onDispose():");
  }
};