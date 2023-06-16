// Define the canvas and context
const canvas = document.getElementById("snakeCanvas");
const context = canvas.getContext("2d");

// Set the size of each snake part and the canvas
const boxSize = 20;
canvas.width = 20 * boxSize;
canvas.height = 20 * boxSize;

// Define the initial snake position
let snake = [
  { x: 10 * boxSize, y: 10 * boxSize }
];

// Define the initial direction of the snake
let direction = null;

// Define the initial food position
let food = {
  x: Math.floor(Math.random() * 20) * boxSize,
  y: Math.floor(Math.random() * 20) * boxSize
};

// Define the game state
let isGameOver = false;

// Function to draw the snake and food on the canvas
function draw() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i === 0 ? "green" : "white";
    context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    context.strokeStyle = "black";
    context.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }

  // Draw the food
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, boxSize, boxSize);
  context.strokeStyle = "black";
  context.strokeRect(food.x, food.y, boxSize, boxSize);
}

// Function to update the game state
function update() {
  // Update the snake position based on the current direction
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "up":
      head.y -= boxSize;
      break;
    case "down":
      head.y += boxSize;
      break;
    case "left":
      head.x -= boxSize;
      break;
    case "right":
      head.x += boxSize;
      break;
  }

  // Check if the snake has collided with the food
  if (head.x === food.x && head.y === food.y) {
    // Generate new food
    food = {
      x: Math.floor(Math.random() * 20) * boxSize,
      y: Math.floor(Math.random() * 20) * boxSize
    };
  } else {
    // Remove the tail of the snake
    snake.pop();
  }

  // Add the new head to the snake
  snake.unshift(head);

  // Check if the snake has collided with the wall or itself
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    checkCollision(head)
  ) {
    isGameOver = true;
    clearInterval(gameInterval);
    document.removeEventListener("keydown", handleKeydown); // Remove the event listener
    alert("Game Over! Press Enter to replay.");
    return;
  }

  // Draw the updated game state
  draw();
}

// Function to check if the snake has collided with itself
function checkCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Function to handle keyboard events
function handleKeydown(event) {
  if (isGameOver && event.key === "Enter") {
    // Reset the game state
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    direction = null;
    isGameOver = false;

    // Start the game loop
    gameInterval = setInterval(update, 100);
  } else {
    switch (event.keyCode) {
      case 37:
        if (direction !== "right") {
          direction = "left";
        }
        break;
      case 38:
        if (direction !== "down") {
          direction = "up";
        }
        break;
      case 39:
        if (direction !== "left") {
          direction = "right";
        }
        break;
      case 40:
        if (direction !== "up") {
          direction = "down";
        }
        break;
    }
  }
}

// Attach the keyboard event listener
document.addEventListener("keydown", handleKeydown);

// Draw the initial game state
draw();

// Start the game loop
let gameInterval = setInterval(update, 100);
