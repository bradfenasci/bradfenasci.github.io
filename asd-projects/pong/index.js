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

  const paddleA = {}; // Paddle A
  paddleA.id = $('#paddleA');
  paddleA.speed = 0;
  paddleA.position = 170;
  const paddleB = {}; // Paddle B
  paddleB.id = $('#paddleB');
  paddleB.speed = 0;
  paddleB.position = 170;
  const ball = {}; // Ball
  ball.id = $('#ball');
  ball.xSpeed = 0;
  ball.ySpeed = 0;
  ball.xPosition = 295;
  ball.yPosition = 195;

  // Game State Variables
  let scoreA = 0; // Player A's score
  let scoreB = 0; // Player B's score

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
      const targetPosition = ball.yPosition - 30;

      // Move the AI paddle towards the target position
      if (paddleB.position + 30 < targetPosition) {
        paddleB.speed = 5; // Set paddle B speed to move downwards
      } else if (paddleB.position + 30 > targetPosition) {
        paddleB.speed = -5; // Set paddle B speed to move upwards
      } else {
        paddleB.speed = 0; // Stop paddle B movement
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
    // Set random initial speeds for the ball
    ball.xSpeed = Math.random() < 0.5 ? -2 : 2; // Set the horizontal speed randomly to -2 or 2
    ball.ySpeed = Math.random() < 0.5 ? -2 : 2; // Set the vertical speed randomly to -2 or 2
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
    paddleA.position += paddleA.speed;
    paddleB.position += paddleB.speed;

    // Limit the vertical position of the paddles within the board
    paddleA.position = Math.max(0, Math.min(paddleA.position, 340)); // Adjust the values based on your desired paddle height
    paddleB.position = Math.max(0, Math.min(paddleB.position, 340)); // Adjust the values based on your desired paddle height

    paddleA.id.css('top', paddleA.position + 'px');
    paddleA.id.css('top', paddleB.position + 'px');

    // Call the moveAIPaddle function to update the AI paddle movement
    moveAIPaddle();
  }

  /*
  Move the ball based on the ball's speed.
  */
  function moveBall() {
    ball.xPosition += ball.xSpeed;
    ball.yPosition += ball.ySpeed;

    ball.id.css('left', ball.xPosition + 'px');
    ball.id.css('top', ball.yPosition + 'px');
  }

  /*
  Check for collisions between the ball and paddles/walls.
  */
  /*
Check for collisions between the ball and paddles/walls.
*/
  function checkCollision() {
    // Ball and paddle collision detection
    if (
      ball.xPosition <= 20 && // Check if the ball is touching or beyond paddleA's position
      ball.yPosition >= paddleA.position &&
      ball.yPosition <= paddleA.position + 60
    ) {
      ball.xSpeed = -ball.xSpeed; // Reverse the horizontal speed of the ball
      ball.xSpeed += Math.sign(ball.xSpeed) * 0.5; // Increase the horizontal speed by 0.5 while maintaining the direction
    } else if (
      ball.xPosition >= 570 && // Check if the ball is touching or beyond paddleB's position
      ball.yPosition >= paddleB.position &&
      ball.yPosition <= paddleB.position + 60
    ) {
      ball.xSpeed = -ball.xSpeed; // Reverse the horizontal speed of the ball
      ball.xSpeed += Math.sign(ball.xSpeed) * 0.5; // Increase the horizontal speed by 0.5 while maintaining the direction
    }

    // Ball and wall collision detection
    if (ball.yPosition <= 0 || ball.yPosition >= 390) {
      ball.ySpeed = -ball.ySpeed; // Reverse the vertical speed of the ball
    }

    // Ball and score detection
    if (ball.xPosition <= 0) {
      scoreB++; // Increment player B's score
      $('#scoreB').text(scoreB); // Update the score display for player B
      if (scoreB >= 10) {
        endGame('Player B wins!'); // Check if player B has won the game
      } else {
        resetBall(); // Reset the ball position and speeds
      }
    } else if (ball.xPosition >= 590) {
      scoreA++; // Increment player A's score
      $('#scoreA').text(scoreA); // Update the score display for player A
      if (scoreA >= 10) {
        endGame('Player A wins!'); // Check if player A has won the game
      } else {
        resetBall(); // Reset the ball position and speeds
      }
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
    ball.xPosition = 295;
    ball.yPosition = 195;
    ball.xSpeed = 0;
    ball.ySpeed = 0;
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
      paddleA.speed = -5; // Set paddle A speed to move upwards
    } else if (event.key === 's') {
      paddleA.speed = 5; // Set paddle A speed to move downwards
    } else if (isAIEnabled) {
      // AI movement (adjust the speed based on the ball's position)
      if (paddleB.position + 30 < ball.yPosition) {
        paddleB.speed = 5; // Set paddle B speed to move downwards
      } else if (paddleB.position + 30 > ball.yPosition) {
        paddleB.speed = -5; // Set paddle B speed to move upwards
      } else {
        paddleB.speed = 0; // Stop paddle B movement
      }
    } else if (event.key === 'ArrowUp') {
      paddleB.speed = -5; // Set paddle B speed to move upwards
    } else if (event.key === 'ArrowDown') {
      paddleB.speed = 5; // Set paddle B speed to move downwards
    }
  }

  /*
  Handle the keyup event to stop the paddle movement.
  */
  function handleKeyUp(event) {
    if (event.key === 'w' || event.key === 's') {
      paddleA.speed = 0; // Reset paddle A speed to stop movement
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      paddleB.speed = 0; // Reset paddle B speed to stop movement
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
