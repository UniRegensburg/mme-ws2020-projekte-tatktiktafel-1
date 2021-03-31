/* eslint-env node */

var server;

const AppServer = require("./server/AppServer.js");

const colyseus = require("colyseus"),
  http = require("http"),
  port = process.env.port || 2567; //eslint-disable-line no-magic-numbers

const TacticsRoom = require("./server/TacticsRoom.js");

/**
 * Starts webserver to serve files from "/app" folder
 */
function init() {
  // access command line parameters from start command (see package.json)
  let appDirectory = process.argv[2], // folder with client files
    appPort = process.argv[3]; // port to use for serving static files
  server = new AppServer(appDirectory);
  server.app.get("/app/:roomId", function(req, res) {
    res.sendFile("index.html", { root: server.appDir });
  });
  server.start(appPort);

  // initialise Colyseus server
  const colyseusServer = new colyseus.Server({
    server: http.createServer(server.app),
  });
  colyseusServer.listen(port);
  colyseusServer.define("tacticsRoom", TacticsRoom);
}

init();