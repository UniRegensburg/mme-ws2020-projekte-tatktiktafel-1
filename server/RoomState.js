/* eslint-env node */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema;

// define Draggable with features x and y
class Draggable extends Schema {

}
schema.defineTypes(Draggable, {
  x: "number",
  y: "number",
});

// define Draggables as Object of one Draggable each representing position of a marker
class Draggables extends Schema {
  constructor() {
    super();
    this.t1 = new Draggable();
    this.t2 = new Draggable();
    this.t3 = new Draggable();
    this.t4 = new Draggable();
    this.t5 = new Draggable();
    this.ct1 = new Draggable();
    this.ct2 = new Draggable();
    this.ct3 = new Draggable();
    this.ct4 = new Draggable();
    this.ct5 = new Draggable();
    this.bomb = new Draggable();
  }
}

schema.defineTypes(Draggables, {
  t1: Draggable,
  t2: Draggable,
  t3: Draggable,
  t4: Draggable,
  t5: Draggable,
  ct1: Draggable,
  ct2: Draggable,
  ct3: Draggable,
  ct4: Draggable,
  ct5: Draggable,
  bomb: Draggable,
});

// define RoomState with object of Draggables and information regarding active map and canvas state
class RoomState extends Schema {
  constructor() {
    super();
    this.draggables = new Draggables();
  }
}
schema.defineTypes(RoomState, {
  testEventSinceServerStart: "number",
  lastChanged: "number", // expected: return of Date.now()
  activeMap: "string",
  canvasURI: "string",
  draggables: Draggables,
});

module.exports = RoomState;