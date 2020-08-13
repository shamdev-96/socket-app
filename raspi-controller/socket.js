const common = require("../common/common");
const ip = require("ip");
const PORT = 8040;

var iamClientlient;

let siteNo = 1;

let handShakeClient = new Map();

handShakeClient.set("58c1c740-2dbd-4c95-bce0-2d6ea4e2aa1c" , "pos-001")
handShakeClient.set("318572bb-3dcf-415b-9b1b-4e86c5bea4c2" , "pos-002")

let connectedClient = new Map();

// event fired every time a new client connects:
//get a message from GUI -(GUI NAME)
//send message about server connection status  --> GUI


function startPiServer(io)
{
    let guiGuid = "";
    let guiName = "";

     io.listen(PORT);

    console.log("------ PI Server is ready on Host [" + ip.address() + ":" + PORT + "] ------ ");
    console.log("Server is listening....")

    io.use((socket , next) =>
    {       
        if(socket.handshake.query && socket.handshake.query.guiGuid && socket.handshake.query.guiName )
        {
          guiGuid = socket.handshake.query["guiGuid"]
          guiName = socket.handshake.query["guiName"]
          
          console.log("Client GUID: ", guiGuid);
          console.log("Client Name: ", guiName);

          var gui = handShakeClient.get(guiGuid) //check gui with client
          console.log(gui)

          if(gui == guiName) //to check legit pos that already registered in PI Side
          {
            next()
            return
          }
          else
          {
            console.log("Unauthorized client GUI is trying to connect. Connection is rejected..")
            next(new Error("Authentication error"));
          }
        }
        else
        {
          next(new Error("Authentication error"));
        }
    });
    
    io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    console.info(`Client connected from POS:${guiName}`);
    // initialize this client's sequence number
    connectedClient.set(guiName, socket.id);

    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        connectedClient.delete(socket);
        console.info(`Bye bye client [id=${socket.id}]`);
        });
    });
}

// sends each client its current sequence number
// setInterval(() => {
//     for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
//         var serverDate = `${new Date().toDateString()} : ${new Date().toLocaleTimeString()}`;
//         client.emit("seq-num", serverDate);
//         sequenceNumberByClient.set(client, `${serverDate}`);
//     }
// }, 1000);


module.exports.startPiServer = startPiServer;
