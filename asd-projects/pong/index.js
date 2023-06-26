/* global $, sessionStorage */

$(document).ready(runProgram); // Wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constants
  const FRAME_RATE = 60; // Number of frames per second
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE; // Milliseconds per frame

  // Game Item Objects
  
  const paddleA = $('#paddleA'); // Paddle A
  const paddleB = $('#paddleB'); // Paddle B
  const ball = $('#ball'); // Ball

  // Game State Variables
  let scoreA = 0; // Player A's score
  let scoreB = 0; // Player B's score

  let paddleASpeed = 0; // initial speed of paddleA
  let paddleBSpeed = 0; // initial speed of paddleB
  let ballXSpeed = 0; // Set initial horizontal speed of the ball to 0
  let ballYSpeed = 0; // Set initial vertical speed of the ball to 0
  let paddleAPosition = 170; // initial position of paddleA
  let paddleBPosition = 170; // initial position of paddleB

  //starting ball position
  let ballXPosition = 295;
  let ballYPosition = 195;

  // AI Opponent Code
  let isAIEnabled = false;

  $('#enableAI').on('click', enableAI);

  function enableAI() {
    isAIEnabled = !isAIEnabled; // Toggle the AI state
    const buttonText = isAIEnabled ? 'Disable AI' : 'Enable AI';
    $('#enableAI').text(buttonText);
  }

  // AI Logic
  function moveAIPaddle() {
    if (isAIEnabled) {
      // Calculate the target position for the AI paddle
      const targetPosition = ballYPosition - 30;

      // Move the AI paddle towards the target position
      if (paddleBPosition + 30 < targetPosition) {
        paddleBSpeed = 5; // Set paddle B speed to move downwards
      } else if (paddleBPosition + 30 > targetPosition) {
        paddleBSpeed = -5; // Set paddle B speed to move upwards
      } else {
        paddleBSpeed = 0; // Stop paddle B movement
      }
    }
  }

  // Keyboard Event Handlers
  $(document).on('keydown', handleKeyDown); // Event handler for keydown event
  $(document).on('keyup', handleKeyUp); // Event handler for keyup event

  // Timer
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL); // Execute newFrame every 0.0166 seconds (60 frames per second)
  setTimeout(startBallMovement, 2000); // Wait for 2 seconds, then call startBallMovement

  function startBallMovement() {
    ballXSpeed = 1; // Set the horizontal speed of the ball to start moving
    ballYSpeed = 1; // Set the vertical speed of the ball to start moving
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /*
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    movePaddles();
    moveBall();
    checkCollision();
  }

  /*
  Move the paddles based on the paddle speed.
  */
  function movePaddles() {
    paddleAPosition += paddleASpeed;
    paddleBPosition += paddleBSpeed;

    // Limit the vertical position of the paddles within the board
    paddleAPosition = Math.max(0, Math.min(paddleAPosition, 340)); // Adjust the values based on your desired paddle height
    paddleBPosition = Math.max(0, Math.min(paddleBPosition, 340)); // Adjust the values based on your desired paddle height

    paddleA.css('top', paddleAPosition + 'px');
    paddleB.css('top', paddleBPosition + 'px');

    // Call the moveAIPaddle function to update the AI paddle movement
    moveAIPaddle();
  }

  /*
  Move the ball based on the ball's speed.
  */
  function moveBall() {
    ballXPosition += ballXSpeed;
    ballYPosition += ballYSpeed;

    ball.css('left', ballXPosition + 'px');
    ball.css('top', ballYPosition + 'px');
  }

  /*
  Check for collisions between the ball and paddles/walls.
  */
  function checkCollision() {
    // Ball and paddle collision detection
    if (
      ballXPosition <= 20 && // Check if the ball is touching or beyond paddleA's position
      ballYPosition >= paddleAPosition &&
      ballYPosition <= paddleAPosition + 60
    ) {
      ballXSpeed = -ballXSpeed; // Reverse the horizontal speed of the ball
      ballXSpeed += Math.sign(ballXSpeed) * 0.5; // Increase the horizontal speed by 0.5 while maintaining the direction
    } else if (
      ballXPosition >= 570 && // Check if the ball is touching or beyond paddleB's position
      ballYPosition >= paddleBPosition &&
      ballYPosition <= paddleBPosition + 60
    ) {
      ballXSpeed = -ballXSpeed; // Reverse the horizontal speed of the ball
      ballXSpeed += Math.sign(ballXSpeed) * 0.5; // Increase the horizontal speed by 0.5 while maintaining the direction
    }

    // Ball and wall collision detection
    if (ballYPosition <= 0 || ballYPosition >= 390) {
      ballYSpeed = -ballYSpeed; // Reverse the vertical speed of the ball
    }

    // Ball and score detection
    if (ballXPosition <= 0) {
      scoreB++; // Increment player B's score
      $('#scoreB').text(scoreB); // Update the score display for player B
      resetBall(); // Reset the ball position and speeds
    } else if (ballXPosition >= 590) {
      scoreA++; // Increment player A's score
      $('#scoreA').text(scoreA); // Update the score display for player A
      resetBall(); // Reset the ball position and speeds
    }
  }

  /*
  Function to end the game by stopping the interval timer and turning off event handlers.
  */
  function endGame(message) {
    // Stop the interval timer
    clearInterval(interval);

    // Turn off event handlers
    $(document).off();

    // Display the victory message
    alert(message);
  }

  function resetBall() {
    ballXPosition = 295;
    ballYPosition = 195;
    ballXSpeed = 0;
    ballYSpeed = 0;
    setTimeout(startBallMovement, 2000);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Keyboard Event Handlers

  /*
  Handle the keydown event to control the paddle speed.
  */
  function handleKeyDown(event) {
    if (event.key === 'w') {
      paddleASpeed = -5; // Set paddle A speed to move upwards
    } else if (event.key === 's') {
      paddleASpeed = 5; // Set paddle A speed to move downwards
    } else if (isAIEnabled) {
      // AI movement (adjust the speed based on the ball's position)
      if (paddleBPosition + 30 < ballYPosition) {
        paddleBSpeed = 5; // Set paddle B speed to move downwards
      } else if (paddleBPosition + 30 > ballYPosition) {
        paddleBSpeed = -5; // Set paddle B speed to move upwards
      } else {
        paddleBSpeed = 0; // Stop paddle B movement
      }
    } else if (event.key === 'ArrowUp') {
      paddleBSpeed = -5; // Set paddle B speed to move upwards
    } else if (event.key === 'ArrowDown') {
      paddleBSpeed = 5; // Set paddle B speed to move downwards
    }
  }

  /*
  Handle the keyup event to stop the paddle movement.
  */
  function handleKeyUp(event) {
    if (event.key === 'w' || event.key === 's') {
      paddleASpeed = 0; // Reset paddle A speed to stop movement
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      paddleBSpeed = 0; // Reset paddle B speed to stop movement
    }
  }
}

// AI Opponent Code
$('#enableAI').on('click', enableAI);

function enableAI() {
  isAIEnabled = !isAIEnabled; // Toggle the AI state
  const buttonText = isAIEnabled ? 'Disable AI' : 'Enable AI';
  $('#enableAI').text(buttonText);
}
