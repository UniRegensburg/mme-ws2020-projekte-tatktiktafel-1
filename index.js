/* eslint-env node */

var server;

const AppServer = require("./server/AppServer.js");

const colyseus = require("colyseus");
const http = require("http");
const port = process.env.port || 2567;

const TestRoom = require("./server/TestRoom.js");
// let testRoomClass = TestRoom.TestRoom;

/**
 * Starts webserver to serve files from "/app" folder
 */
function init() {
    // Access command line parameters from start command (see package.json)
    let appDirectory = process.argv[2], // folder with client files
        appPort = process.argv[3]; // port to use for serving static files
    server = new AppServer(appDirectory);
    server.start(appPort);

    const colyseusServer = new colyseus.Server({
        server: http.createServer(server.app),
    });
    colyseusServer.listen(port);
    console.log(`Colyseus Server Port: ${port}`);

    colyseusServer.define("test",TestRoom);
}

init();