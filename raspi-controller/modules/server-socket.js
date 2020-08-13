//require('./config/mongo_database');

//be a client socket for BackOffice
//be a server to GUI

// const common = require("../common/common");
const config = require("config");
const piController = require("../raspi-controller-manager");
let mockProductData = require("../../mockData/mockProductData.json");

let connectedClients = new Map();
let connectedClientsSocket = new Map();

let handShakeClient = new Map();

function initializeConnection(io) {
  // let guiGuid = "";
  // let guiName = "";

  //registered Client
  config.allowedGuiClients.forEach((element) => {
    handShakeClient.set(element.id, element.name);
  });

  io.use((socket, next) => {
    if (
      socket.handshake.query &&
      socket.handshake.query.guiGuid &&
      socket.handshake.query.guiName
    ) {
      guiGuid = socket.handshake.query["guiGuid"];
      guiName = socket.handshake.query["guiName"];

      console.log("Client GUID: ", guiGuid);

      if (handShakeClient.has(guiGuid)) {
        connectedClients.set(guiGuid, socket.id);
        connectedClientsSocket.set(socket.id, {
          guid: guiGuid,
          name: guiName,
          socketId: socket.id,
        });
        next();
        return;
      } else {
        console.log(
          "Unauthorized client GUI is trying to connect. Connection is rejected.."
        );
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    // initialize this client's sequence number

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
      let clientObj = connectedClientsSocket.get(socket.id);
      if (clientObj) {
        connectedClients.delete(clientObj.guid);
      }
      connectedClientsSocket.delete(socket.id);
      console.info(`Bye bye client [id=${socket.id}]`);
    });

    socket.on("message", (payload) => {
      console.log(socket.id);
      let clientObj = connectedClientsSocket.get(socket.id);
      console.log(
        "[PI Server]: received data from GUI : " + clientObj.guid,
        payload
      );
      piController.onClientMessageReceived(payload, clientObj);
    });
  });
}

function getConnectedClients() {
  return connectedClients;
}

module.exports.initializeConnection = initializeConnection;
module.exports.getConnectedClients = getConnectedClients;
