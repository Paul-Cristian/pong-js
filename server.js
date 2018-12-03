const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.use('/static', express.static(__dirname + '/static'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(8080, function() {
    console.log('Listening');
});

io.on('connection ', function(socket) {

});

setInterval(() => {
    io.sockets.emit('message', 'hi!');
}, 1000);

var players = {};
io.on('connection', function(socket) {
  socket.on('new client', function() {
    players[socket.id] = {
      x: 15,
      y: 15
    };
  });

  socket.on('movement_c1ient1', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });

});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);