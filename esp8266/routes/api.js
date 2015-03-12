var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');

function getClient() {
    return mqtt.connect({
        host: '192.168.1.68',
        port: '1883'
    });
}

router.get('/led/:state', function(req, res) {
    var state = 'off';
    if ((req.params.state).toLowerCase() === 'on') {
        state = 'on';
    }
    
    var client = getClient();
    client.on('connect', function() {
        client.publish('led', state, function() {
            client.end();
            console.log("published led:" + state + " message");
            res.end();
        });
    });
});      


router.get('/stream/led', function(req, res) {
    console.log("got stream request...");
    // set timeout as high as possible
    req.socket.setTimeout(Infinity);
    
    // send headers for event-stream connection
    // see spec for more information
    console.log("writing header");
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function() {
        console.log("sending comment line to stream");
        res.write(':' + '\n');
    }, 20000);

    
    var client = getClient();
    client.on('connect', function() {
        client.subscribe('led', function() {
            console.log("subscribed for 'led' messages");
            client.on('message', function(topic, msg, pkt) {
                console.log("Received MQTT message:  " + topic + ":" + msg);
                res.write('data:' + msg + '\n\n');
            });
        });
    });
    
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        console.log("closing stream");
        clearTimeout(timer);
        client.end();
    });
    
});

module.exports = router;
