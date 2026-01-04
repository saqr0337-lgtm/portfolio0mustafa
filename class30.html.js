const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake, food, direction, score, speed, game, paused;
let highScore = localStorage.getItem("highScore") || 0;

function init() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  speed = 150;
  paused = false;
  food = randomFood();
  clearInterval(game);
  game = setInterval(draw, speed);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

  if (e.key === " ") paused = !paused;        // Pause
  if (e.key === "Enter") init();               // Restart
});

function collision(head, body) {
  return body.some(part => part.x === head.x && part.y === head.y);
}

function drawGrid() {
  ctx.strokeStyle = "#222";
  for (let i = 0; i < canvas.width; i += box) {
    ctx.strokeRect(i, 0, box, canvas.height);
    ctx.strokeRect(0, i, canvas.width, box);
  }
}

function drawText() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High: " + highScore, 300, 20);
  ctx.fillText("Space: Pause | Enter: Restart", 60, 390);
}

function draw() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawText();

  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(part.x, part.y, box, box);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    alert("Game Over\nScore: " + score);
    return;
  }

  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFood();

    if (speed > 60) {
      speed -= 5;
      clearInterval(game);
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

init();