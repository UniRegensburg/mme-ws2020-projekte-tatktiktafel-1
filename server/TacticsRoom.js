/* eslint-env node */
/* eslint-disable no-unused-vars */

const colyseus = require("colyseus");
const RoomState = require("./RoomState.js");

module.exports = class TacticsRoom extends colyseus.Room {

  onCreate(options) {
    this.roomId = options.roomID;
    this.setState(new RoomState());

    this.state.activeMap = "Inferno"; // Hack, bitte noch eleganter lösen
    this.state.testEventSinceServerStart = 0; // Hack, bitte noch eleganter lösen

    this.onMessage("mapchange", (client,message) => {
      this.state.activeMap = message.activeMap;
    });
    this.onMessage("canvaschanged", (client,message) => {
      this.state.canvasURI = message.canvasURI;
    });
    this.onMessage("draggablemoved", (client,message) => {
      this.state.draggables[message.id].x = message.x;
      this.state.draggables[message.id].y = message.y;
    });
    this.onMessage("draggablesreset", (client, message) => {
      for (const key of Object.keys(this.state.draggables)) {
        this.state.draggables[key].x = 0;
        this.state.draggables[key].y = 0;
      }
    });

    this.onMessage("chat", (client,message) => {
      this.broadcast("chat", {client: client, message: message});
    });
  }

  onAuth(client, options, request) {
    return true;
  }

  // onJoin(client, options, auth) {
  //   console.log("TestRoom.onJoin():");
  //   console.log("SessionId: " + client.sessionId);
  // }

  // onLeave(client, consented) {
  //   console.log("TestRoom.onLeave()");
  //   console.log("SessionId: " + client.sessionId);
  //   console.log("Consented: " + consented);
  // }

  // onDispose() {
  //   console.log("TestRoom.onDispose():");
  // }
};