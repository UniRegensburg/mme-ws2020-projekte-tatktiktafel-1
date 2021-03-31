/* eslint-env node */
/* eslint-disable no-unused-vars */

const colyseus = require("colyseus");
const RoomState = require("./RoomState.js");

module.exports = class TacticsRoom extends colyseus.Room {

  onCreate(options) {
    // set room ID
    this.roomId = options.roomID;
    // set state
    this.setState(new RoomState());

    // set defaults
    this.state.activeMap = "Inferno";
    this.state.testEventSinceServerStart = 0;

    // initialise message listeners
    // map changed
    this.onMessage("mapchange", (client,message) => {
      this.state.activeMap = message.activeMap;
    });
    // canvas modified
    this.onMessage("canvaschanged", (client,message) => {
      this.state.canvasURI = message.canvasURI;
    });
    // draggble moved
    this.onMessage("draggablemoved", (client,message) => {
      this.state.draggables[message.id].x = message.x;
      this.state.draggables[message.id].y = message.y;
    });
    // reset draggables button clicked
    this.onMessage("draggablesreset", (client, message) => {
      for (const key of Object.keys(this.state.draggables)) {
        this.state.draggables[key].x = 0;
        this.state.draggables[key].y = 0;
      }
    });
    // chat message received
    this.onMessage("chat", (client,message) => {
      this.broadcast("chat", {client: client, message: message});
    });
  }

  // auto accept all clients trying to connect to room
  onAuth(client, options, request) {
    return true;
  }
};
