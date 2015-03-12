var mqtt = require('mqtt');

//var client = mqtt.connect(10926, 'm11.cloudmqtt.com', {

    //host: 'm11.cloudmqtt.com',
var client = mqtt.connect({
    host: 'localhost',
    port: '1883'
});

client.on('connect', function() {

  client.subscribe('led', function() {
    client.on('message', function(topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  client.publish('led', 'on', function() {
    console.log("message published");
    client.end();
  });

});


