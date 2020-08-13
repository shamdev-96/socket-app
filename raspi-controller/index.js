const config = require("config");
const piController = require("./raspi-controller-manager");

process.env.PORT = config.port;
if (!config.port) {
  console.error(
    "ERROR> Cant start the system without config.port variable set"
  );
  return;
}
console.log(
  "process.env.PORT and LOCATION of CONFI",
  process.env.PORT,
  process.env["NODE_CONFIG_DIR"]
);

//do startupp processes

//open server
//open client

piController.startPiServer();
piController.startPiClient();
