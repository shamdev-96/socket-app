var config = require('config')
var mongoose = require('mongoose');
var mongodbOptions = {
  socketTimeoutMS: 60000,
  keepAlive: true,
  reconnectTries: 10000,
  
   server: {
      socketOptions: {
         socketTimeoutMS: 60000,
         connectionTimeout: 10000
      },
      auto_reconnect: true,
      reconnectTries: 60,
      reconnectInterval: 3000,
   },   
};

mongoose.Promise = Promise
mongoose.connect(config.database, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + config.database);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + config.database);
    }
});
