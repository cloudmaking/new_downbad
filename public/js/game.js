const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 10;
const numRows = canvas.height / tileSize;
const numCols = canvas.width / tileSize;

const gameSpeed = 100; // milliseconds per game loop
const foodColor = 'red';
const snakeColor = 'green';

let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = { x: 1, y: 0 };
let score = 0;

function drawSnake() {
    ctx.fillStyle = snakeColor;
    for (const segment of snake) {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    }
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function drawScore() {
    const scoreEl = document.getElementById('score');
    scoreEl.innerText = score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
        // Restart the game
        snake = [{ x: 5, y: 5 }];
        direction = { x: 1, y: 0 };
        score = 0;
        return;
    }

    // Check snake collision
    if (checkCollision(head.x, head.y)) {
        // Restart the game
        snake = [{ x: 5, y: 5 }];
        direction = { x: 1, y: 0 };
        score = 0;
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        drawScore();
        if (score === 25) {
            window.location.href = '/gameception';
        }
        spawnFood();
    } else {
        // Remove tail
        snake.pop();
    }
}


// Check if a given position collides with the snake
function checkCollision(x, y) {
    for (const segment of snake) {
        if (segment.x === x && segment.y === y) {
            return true;
        }
    }
    return false;
}

// Spawn new food at a random position, but not on the snake
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * numCols),
        y: Math.floor(Math.random() * numRows),
    };

    for (const segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return spawnFood();
        }
    }
}

// The game loop, which updates and draws the game every `gameSpeed` milliseconds
function gameLoop() {
    updateSnake();
    draw();
    setTimeout(gameLoop, gameSpeed);
}

// Handle keyboard input to change the direction of the snake
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});


spawnFood();
gameLoop();
