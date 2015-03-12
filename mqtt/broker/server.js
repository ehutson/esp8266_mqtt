var mosca = require('mosca');

var asc = {
  type: 'redis',
  redis: require('redis'),
  db: 12,
  port: 6379,
  return_buffers: true,
  host: 'localhost'
};

var moscaSettings = {
  port: 1883,
  backend: asc,
  persistence: {
    factory: mosca.persistence.Redis
  }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

function setup() {
  console.log('Mosca server is up and running');
}



