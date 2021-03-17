/* eslint-env node */
/* eslint-disable no-unused-vars */

const colyseus = require("colyseus");

module.exports = class TestRoom extends colyseus.Room {

  onCreate(options) {
    console.log("TestRoom.onCreate():");
    // console.log(this);
    this.onMessage("test", (client, message) => {
      console.log(client.sessionId + " did something.");
      this.broadcast("test", {clientSessionId: client.sessionId});
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