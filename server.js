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
    console.log('Listening on port 8080');
});

const windowSize = {
  width: 900,
  height: 700
};

const ballStartingPosition = {
  x: 450,
  y: 350
};

var noPlayers = 0;
var state = {
  ball: {
    position: {
      x: ballStartingPosition.x,
      y: ballStartingPosition.y
    },
    size: {
      width: 10,
      height: 10
    },
    speed: {
      x: -0.5,
      y: 0.5
    }
  },
  playerSize: {
    width: 10,
    height: 100
  }
};
state.players = {};
io.on('connection', function(socket) {
  socket.on('newClient', function() {
    ++noPlayers;
 
    const orientation = (noPlayers % 2) ? 'left' : 'right';
    const upKey = (noPlayers % 2) ? 87 : 38;
    const downKey = (noPlayers % 2) ? 83 : 40;
    const startPosition = (noPlayers % 2) ? {x: 15, y: 15} : {x: 885, y: 15};

    const orientationAssignment = {
      orientation: orientation,
      upKey: upKey,
      downKey: downKey,
      startPosition: startPosition
    };

    state.players[socket.id] = startPosition;

    socket.emit('orientationAssignment', orientationAssignment);
  });

  socket.on('movementClient', function(data) {
    var player = state.players[socket.id] || {};

    // Dacă player-ul dă să iasă din ecran
    if (data.up && player.y >= 0) {
      player.y -= 5;
    }
    if (data.down && player.y <= windowSize.height) {
      player.y += 5;
    }

    // Daca bila dă să iasă din ecran
    if (state.ball.position.y < 0 || state.ball.position.y > windowSize.height)
      state.ball.speed.y *= -1;
    if (state.ball.position.x < 0 || state.ball.position.x > windowSize.width) {
      state.ball.position = {
        x: ballStartingPosition.x,
        y: ballStartingPosition.y
      };
    }
    
    // Dacă bila se ciocnește de unul dintre playeri
    for (var id in state.players) {
      const playerPosition = state.players[id];
      const ballPosition = state.ball.position;
      const playerSize = state.playerSize;
      const ballSize = state.ball.size;

      if (!(playerPosition.x + playerSize.width < ballPosition.x ||
        playerPosition.y + playerSize.height < ballPosition.y ||
        ballPosition.x + ballSize.width < playerPosition.x ||
        ballPosition.y + ballSize.height < playerPosition.y)) {
          state.ball.speed.x *= -1;
      }

    };

    // Muta bila
    state.ball.position.x += state.ball.speed.x;
    state.ball.position.y += state.ball.speed.y;
  });
});

setInterval(function() {
  io.sockets.emit('state', state);
}, 1000 / 60);