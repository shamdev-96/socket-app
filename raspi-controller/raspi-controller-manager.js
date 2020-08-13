//connect dengan BackOffice

const config = require("config");
const ip = require("ip");
const socketIo = require("socket.io");
const clientIo = require("socket.io-client");
const productService = require("./modules/product_service");
const transactionService = require("./modules/transaction_service");
const server = require("./modules/server-socket");
const client = require("./modules/client-socket");
const SOCKET_ENUMS = require("./modules/socket-message-enum");

//handle con
const PORT = config.port;
const TOKEN = config.token;
const SITEID = config.siteID;

let socketServer;
let socketClient;

function startPiServer() {
  socketServer = socketIo.listen(PORT);

  console.log(
    "------ PI Server is ready on Host [" +
      ip.address() +
      ":" +
      PORT +
      "] ------ "
  );
  console.log("Server is listening....");

  server.initializeConnection(socketServer);
}

function startPiClient() {
  socketClient = clientIo(config.socketServerURL, {
    path: config.socketServerPath,
    query: "token=" + TOKEN,
  });
  client.listenToServer(socketClient);
}

//data from BackOffice
async function onServerMessageReceived(payload) {
  console.log("data from backoffice : ", payload);
  if (!socketClient) {
    console.log(
      "Server is unexpectedly shut down. Client unable to send message to Server"
    );
  } else {
    //potential message from server { product.all (list all of product) | product.updated }
    if (payload.type == "product.all") {//received a list of all products
      console.log("save product to mongoDb...");
      let products = await productService.updateMany(payload.data);
      console.log
      sendMessagetToAllGui({
        type: "product.all",
        data: products,
      });
    }
    else if(payload.type == "product.updated"){
      let products = await productService.updateMany(payload.data);
      console.log("products from mongo :" , products)
      sendMessagetToAllGui({
        type: "product.updated",
        data: products,
      });
    }
  }
}

//data from GUI
async function onClientMessageReceived(payload, clientObj) {
  //do the switch statement based on payload type
  //handle message
  console.log("Received message from client ", payload, clientObj);
  if (payload.type == "product.get_all") {

    //TODO: to have try catch handling error for mongo
    let products = await productService.list();
    sendMessageToSocketId(clientObj.socketId, {
      type: "product.all",
      data: products,
    });

    // if (products.length == 0) {
    //   payload.guiGuid = clientObj.guid;
    //   console.log(
    //     "NO DATA IN MONGODB. Forward request to BackOffice fro guGuid...",
    //     payload.guiGuid
    //   );
    //   //sendMessageToBackOffice(payload);
    // } else {
    //   sendMessageToSocketId(clientObj.socketId, {
    //     type: "product.all",
    //     data: products,
    //   });
    // }

  } else if (payload.type == SOCKET_ENUMS.SAVE_NEW_TRANSACTION) {
    console.log(" SOCKET_ENUMS.SAVE_NEW_TRANSACTION");

    //TODO: add guid to order payload / receipt information /

    let order = await transactionService.createTransaction(payload.data);
    //TODO: how to inform additional display on messages
    sendMessageToBackOffice({
      type: SOCKET_ENUMS.SAVE_NEW_TRANSACTION,
      data: order,
    });
    sendMessageToSocketId(clientObj.socketId, {
      type: "transaction.created",
      data: order,
    });
  }
}

//data from BackOffice , then send to GUI (need to know guiGuid)
function sendMessagetToAllGui(payload) {
  socketServer.emit("message", payload);
  // var connectedClients = server.getConnectedClients();
  // if (connectedClients.size == 0) {
  //   console.log(
  //     "[raspi-controller-manager]:  No GUI Client is connected to PI Server"
  //   );
  //   return;
  // } else {
  //     socketServer.emit("message", payload);
  //     //guiSocket.emit("message " , payload);
  //   }
}

function sendMessageToSocketId(socketId, payload) {
  console.log("Send to socketId:", socketId);
  console.log(
    "[raspi-controller-manager]:   Send message to Socket --> Payload ",
    payload
  );
  socketServer.to(socketId).emit("message", payload);
}

//data from GUI, then send to BackOffice
function sendMessageToBackOffice(payload) {
  //client
  if (!socketClient) {
    console.log(
      "Server is unexpectedly shut down. Client unable to send message to Server"
    );
  } else {
    console.log("sending message to BackOffice", payload);
    socketClient.emit("message", payload);
  }
}

module.exports.startPiServer = startPiServer;
module.exports.startPiClient = startPiClient;
module.exports.onClientMessageReceived = onClientMessageReceived;
module.exports.onServerMessageReceived = onServerMessageReceived;
