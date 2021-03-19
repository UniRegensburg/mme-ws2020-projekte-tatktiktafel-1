/* eslint-env node */
/* eslint-disable no-unused-vars */

const colyseus = require("colyseus");
const RoomState = require("./RoomState.js");

module.exports = class TestRoom extends colyseus.Room {

  onCreate(options) {
    console.log("TestRoom.onCreate():");
    this.setState(new RoomState());
    this.onMessage("test", (client,message) => {
      if (this.state.testEventSinceServerStart) {
        this.state.testEventSinceServerStart++;
      } else {
        this.state.testEventSinceServerStart = 1;
      }
      this.state.lastChanged = message.timestamp;

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