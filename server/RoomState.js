/* eslint-env node */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema;

class RoomState extends Schema {

}

schema.defineTypes(RoomState, {
  testEventSinceServerStart: "number",
  lastChanged: "number", // erwartet: Rückgabewert von Date.now()
  activeMap: "string",
  canvasURI: "string",
});

module.exports = RoomState;