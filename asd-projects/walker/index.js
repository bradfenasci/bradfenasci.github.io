/* global $, sessionStorage */

$(document).ready(runProgram);

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68
  };

  // Player Objects
  var player1 = {
    id: '#walker',
    positionX: 0,
    positionY: 0,
    speedX: 0,
    speedY: 0,
    isTagged: false
  };
  var player2 = {
    id: '#player2',
    positionX: 390,
    positionY: 390,
    speedX: 0,
    speedY: 0,
    isTagged: false
  };

  // Board Dimensions
  var boardWidth = 390;
  var boardHeight = 390;

  // Timer and Event Handlers
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionGameItem(player1);
    repositionGameItem(player2);
    redrawGameItem(player1);
    redrawGameItem(player2);

    checkCollision();
  }

  /* 
  Called in response to keydown events.
  Adjusts the speed of the players based on the pressed keys.
  */
  function handleKeyDown(event) {
    if (event.which === KEY.LEFT) {
      player1.speedX = -5;
    } else if (event.which === KEY.RIGHT) {
      player1.speedX = 5;
    } else if (event.which === KEY.UP) {
      player1.speedY = -5;
    } else if (event.which === KEY.DOWN) {
      player1.speedY = 5;
    } else if (event.which === KEY.A) {
      player2.speedX = -5;
    } else if (event.which === KEY.D) {
      player2.speedX = 5;
    } else if (event.which === KEY.W) {
      player2.speedY = -5;
    } else if (event.which === KEY.S) {
      player2.speedY = 5;
    }
  }

  /* 
  Called in response to keyup events.
  Resets the speed of the players when the corresponding keys are released.
  */
  function handleKeyUp(event) {
    if (event.which === KEY.LEFT) {
      player1.speedX = 0;
    } else if (event.which === KEY.RIGHT) {
      player1.speedX = 0;
    } else if (event.which === KEY.UP) {
      player1.speedY = 0;
    } else if (event.which === KEY.DOWN) {
      player1.speedY = 0;
    } else if (event.which === KEY.A) {
      player2.speedX = 0;
    } else if (event.which === KEY.D) {
      player2.speedX = 0;
    } else if (event.which === KEY.W) {
      player2.speedY = 0;
    } else if (event.which === KEY.S) {
      player2.speedY = 0;
    }
  }

  /* 
  Ends the game by stopping the timer and removing event handlers.
  */
  function endGame() {
    clearInterval(interval);
    $(document).off();
  }

  /* 
  Repositions a player's position based on its current speed.
  Also, prevents the player from going off the game board.
  */
  function repositionGameItem(player) {
    player.positionX += player.speedX;
    player.positionY += player.speedY;

    if (player.positionX < 0) {
      player.positionX = 0;
    } else if (player.positionX > boardWidth) {
      player.positionX = boardWidth;
    }

    if (player.positionY < 0) {
      player.positionY = 0;
    } else if (player.positionY > boardHeight) {
      player.positionY = boardHeight;
    }
  }

  /* 
  Redraws a player's position on the screen.
  Also changes the background color based on whether the player is tagged or not.
  */
  function redrawGameItem(player) {
    $(player.id).css({
      left: player.positionX + 'px',
      top: player.positionY + 'px'
    });

    if (player.isTagged) {
      $(player.id).css('background-color', 'red');
    } else {
      $(player.id).css('background-color', 'blue');
    }
  }

  /* 
  Checks if the players collide using their bounding rectangles.
  If a collision occurs, the players are reset to their starting positions.
  */
  function checkCollision() {
    var rect1 = $(player1.id)[0].getBoundingClientRect();
    var rect2 = $(player2.id)[0].getBoundingClientRect();

    if (
      rect1.left <= rect2.right &&
      rect1.right >= rect2.left &&
      rect1.top <= rect2.bottom &&
      rect1.bottom >= rect2.top
    ) {
      // Trigger the tag game logic
      if (!player1.isTagged && !player2.isTagged) {
        player2.isTagged = true;
        resetPlayers();
        displayTaggedPlayer(player2);
      } else if (player1.isTagged && !player2.isTagged) {
        player1.isTagged = false;
        player2.isTagged = true;
        resetPlayers();
        displayTaggedPlayer(player2);
      } else if (!player1.isTagged && player2.isTagged) {
        player2.isTagged = false;
        player1.isTagged = true;
        resetPlayers();
        displayTaggedPlayer(player1);
      }
    }
  }

  /* 
  Resets the positions and speeds of both players to their starting values.
  */
  function resetPlayers() {
    player1.positionX = 0;
    player1.positionY = 0;
    player1.speedX = 0;
    player1.speedY = 0;

    player2.positionX = 390;
    player2.positionY = 390;
    player2.speedX = 0;
    player2.speedY = 0;
  }

  /* 
  Displays a message indicating which player is tagged.
  */
  function displayTaggedPlayer(player) {
    var message = player.id === '#walker' ? 'Player 1 is tagged!' : 'Player 2 is tagged!';
    alert(message);
  }
}
