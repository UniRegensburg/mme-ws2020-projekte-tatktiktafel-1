/* eslint-env node */
/* eslint no-console: 0 */

/** 
 * Build File 
 *
 * Implementieren Sie hier alle (automatisierten) Schritte, die notwendig sind, um Ihre Anwendung
 * vor der Veröffentlichung zu testen und zu "bauen". Das könnte z.B. das Zusammenfügen von Javascript-Dateien 
 * oder die Optimierung von Ressourcen-Dateien sein.
 *
 * Diese Datei wird beim Aufrufen des `build`-Tasks (npm) automatisch ausgeführt.
 */

const fs = require("fs");

function build() {
  // Implementiere Sie hier die einzelnen Bauschritte
  console.log("Building \"tactiCS:GO\"");
  publishClientLibraries();
}

// Copies NPM Client-libraries in /libs folder for Express to roll out
function publishClientLibraries() {
  console.log("Copying colyseus.js");
  fs.mkdirSync("libs/colyseus.js", {recursive: true});
  fs.copyFileSync("node_modules/colyseus.js/dist/colyseus.js","libs/colyseus.js/colyseus.js");
  fs.copyFileSync("node_modules/colyseus.js/dist/colyseus.js.map","libs/colyseus.js/colyseus.js.map");
}

build();
