const socket = io();

let playerKeys = {};
let movementClient = {
  up: false,
  down: false
};

socket.emit('newClient');
socket.on('orientationAssignment', (orientationAssignment) => {
  console.log(orientationAssignment);

  playerKeys.up = orientationAssignment.upKey;
  playerKeys.down = orientationAssignment.downKey;
  
  console.log(playerKeys);

  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
    case playerKeys.up:
        movementClient.up = true;
        break;  
    case playerKeys.down:
        movementClient.down = true;
        break;
    }
  });

  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case playerKeys.up:
        movementClient.up = false;
        break;
      case playerKeys.down:
        movementClient.down = false;
        break;
    }
  });
});


setInterval(function() {
  //adauga orientare
  socket.emit('movementClient', movementClient);
}, 1000 / 60);



var canvas = document.getElementById('canvas');
canvas.width = 900;
canvas.height = 700;

var context = canvas.getContext('2d');
socket.on('state', function(state) {
  context.clearRect(0, 0, 900, 700);
  context.fillStyle = 'black';
  for (var id in state.players) {
    var player = state.players[id];
    context.beginPath();
    context.rect(player.x, player.y, state.playerSize.width, state.playerSize.height);
    context.fill();
  }

  context.beginPath();
  context.rect(state.ball.position.x, state.ball.position.y,
    state.ball.size.width, state.ball.size.height);
  context.fill();
});