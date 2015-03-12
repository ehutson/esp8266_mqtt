var mqtt = require('mqtt');

//var client = mqtt.connect(10926, 'm11.cloudmqtt.com', {

    //host: 'm11.cloudmqtt.com',
var client = mqtt.connect({
    host: '192.168.1.68',
    port: '1883'
    //host: '107.22.157.224',
    //port: '10926',
    //username: 'esp8266',
    //password: 'letmein'
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


