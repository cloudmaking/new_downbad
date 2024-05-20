// rendering.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function renderGameState() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderSnake(gameState.player1.snake, 'blue');
    renderSnake(gameState.player2.snake, 'green');
    renderFood(gameState.food);
}

function renderSnake(snake, color) {
    ctx.fillStyle = color;
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
}

function renderFood(food) {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}
