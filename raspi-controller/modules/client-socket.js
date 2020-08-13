//const common = require("../common/common");

const piController = require("../raspi-controller-manager")

function listenToServer(client)
{
  // 2. //list of products
  let payload = {
    type: 'product.get_all',
    data: []
}  
  client.emit("message" , payload)

  console.log("Client is connecting")
  client.on("message", (payload) => {
    //get message for eg: (product.all) and send back to GUI thru server
    console.info(payload.data);
    console.log(
      "-----> [Pi Client] Get message from Back Office with MessageType: ",
      payload
    );

    piController.onServerMessageReceived(payload)
    

  });
}


module.exports.listenToServer = listenToServer