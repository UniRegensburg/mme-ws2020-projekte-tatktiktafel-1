/* eslint-env node */

/**
 * Bildet den Status eines Raumes ab. Folgende Eigenschaften:
 * playbooks (nicht implementiert): Array von "playbook"s.
 * activePlaybook (nicht implementiert): "number". Index des aktiven Playbooks. Sollte zu 0 defaulten
 *    playbook (nicht implementiert): Array von "play"s. Repräsentiert einen Playbook-Tab
 *        activeMap: Eigenschaft von playbook. Repräsentiert aktuell ausgewählte Map.
 *    activePlay (nicht implementiert): "number". Index des aktiven Plays. Sollte zu 0 defaulten.
 *        play: Enthält die folgenden Eigenschaften:
 *            canvasURI: "string". URI des zu synchronisierenden Canvas des plays.
 *            t1-5, ct1-5, bomb: Draggable. Repräsentiert Position der Draggables. Möglicherweise in einem Objekt zusammenfassen
 *            Draggable: Nutzerdefinieres Schema, enthält x und y Koordinaten der Draggables.
 */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema;
  // ArraySchema = schema.ArraySchema;

class Draggable extends Schema {

}
schema.defineTypes(Draggable, {
  x: "number",
  y: "number",
});

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

class RoomState extends Schema {
  constructor() {
    super();
    this.draggables = new Draggables();
  }
}

schema.defineTypes(RoomState, {
  testEventSinceServerStart: "number",
  lastChanged: "number", // erwartet: Rückgabewert von Date.now()
  activeMap: "string",
  canvasURI: "string",
  draggables: Draggables,
});

module.exports = RoomState;