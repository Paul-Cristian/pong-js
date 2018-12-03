const socket = io();
socket.on('message', function(data) {
    console.log(data);
});

var movement_c1ient1 = {
    up: false,
    down: false,
    left: false,
    right: false,
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    /* Cred ca ne trebuie doar up-down
	case 65: // A
      movement_c1ient1.left = true;
      break;
    case 68: // D
      movement_c1ient1.right = true;
      break;
	*/
	case 87: // W
      movement_c1ient1.up = true;
      break;  
    case 83: // S
      movement_c1ient1.down = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
	/* Cred ca ne trebuie doar up-down  
    case 65: // A
      movement_c1ient1.left = false;
      break;
    case 68: // D
      movement_c1ient1.right = false;
      break;
	*/
	case 87: // W
      movement_c1ient1.up = false;
      break;
    case 83: // S
      movement_c1ient1.down = false;
      break;
  }
})

/* Key events for Arrows - client 2
document.addEventListener('keyup', function(event) {
  switch (event.keycode) {
	case 37: //arrow left
	  movement_c1ient2.left = true;
	  break;
    case 38: //arrow up
      movement_c1ient2.up = true;
      break;
    case 39: //arrow right
      movement_c1ient2.right = true;
      break;
    case 40: //arrow down
      movement_c1ient2.down = true;
      break;
  }
})

document.addEventListener('keydown', function(event) {
  switch (event.keycode) {
	case 37: //arrow left
	  movement_c1ient2.left = false;
	  break;
    case 38: //arrow up
      movement_c1ient2.up = false;
      break;
    case 39: //arrow right
      movement.right = false;
      break;
    case 40: //arrow down
      movement_c1ient2.down = false;
      break;
  }
})
*/
socket.emit('new client');
setInterval(function() {
  socket.emit('movement_c1ient1', movement_c1ient1);
}, 1000 / 60);



var canvas = document.getElementById('canvas');
canvas.width = 900;
canvas.height = 700;

var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 900, 700);
  context.fillStyle = 'black';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.rect(player.x, player.y,10,100);
    context.fill();
  }
});