const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');

// Customization Variables
const rows = 30; // Number of rows in the game board
const cols = 30; // Number of columns in the game board
const size = 20; // The size of each cell (20x20)
const gameSpeed = 150; // The speed of the game in milliseconds
const playerColors = ['#3a71e8', '#9de83a', '#e8c83a', '#d64f83']; // Colors for each player
const appleColor = '#e8463a'; // Color of the apple
const initialPlayerPositions = [
    { x: 1, y: 1, direction: 'right' }, // Initial position and direction of player 1
    { x: cols - 2, y: rows - 2, direction: 'left' }, // Initial position and direction of player 2
    { x: 1, y: rows - 2, direction: 'right' }, // Initial position and direction of player 3
    { x: cols - 2, y: 1, direction: 'left' } // Initial position and direction of player 4
];
const winScore = 25; // Score needed to win the game

let apple;
let players = [];
let gameInterval;
let isPaused = true; // Start the game as paused

function initializeGame(playerCount) {
    console.log("Initializing game...");
    players = initialPlayerPositions.slice(0, playerCount).map((pos, index) => 
        new Snake(pos.x, pos.y, index + 1)
    );

    apple = new Apple();
    updateScores();
    console.log("Game initialized:", players);
}

function startGame(playerCount) {
    if (players.length === 0) {
        initializeGame(playerCount); // Ensure the game is initialized
    }
    isPaused = false;
    document.getElementById('pause-btn').innerText = "Pause Game";
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function restartGame() {
    clearInterval(gameInterval);
    initializeGame(players.length);
    startGame(players.length);
}

function togglePause() {
    if (isPaused) {
        isPaused = false;
        document.getElementById('pause-btn').innerText = "Pause Game";
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        isPaused = true;
        document.getElementById('pause-btn').innerText = "Resume Game";
        clearInterval(gameInterval);
    }
}

function updateScores() {
    let scoresHTML = '';
    players.forEach((player, index) => {
      scoresHTML += `
        <div class="player-score">
          <div class="score-circle" style="background-color: ${player.color};">
            <span class="score-text">${player.score}</span>
          </div>
          <span class="score-label">Player ${index + 1}</span>
        </div>
      `;
    });
    document.getElementById('scores').innerHTML = scoresHTML;
}


function gameLoop() {
    if (isPaused) return;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    players.forEach(player => {
        player.move();
        player.draw();
    });

    apple.draw();

    players.forEach(player => {
        if (player.checkCollision()) {
            player.reset();
        } else if (player.eat(apple)) {
            apple = new Apple();
            updateScores();
        }
    });

    let winner = players.find(player => player.score >= winScore); // Updated win condition
    if (winner) {
        alert(`Player ${winner.id} wins!`);
        clearInterval(gameInterval);
    }
}

class Snake {
    constructor(x, y, id) {
        this.body = [{ x, y }];
        this.id = id;
        this.color = playerColors[id - 1];
        this.direction = initialPlayerPositions[id - 1].direction;
        this.score = 0;
        this.setControls();
    }

    setControls() {
        const keyMap = {
            '1': { 37: 'left', 38: 'up', 39: 'right', 40: 'down' },
            '2': { 65: 'left', 87: 'up', 68: 'right', 83: 'down' },
            '3': { 72: 'left', 85: 'up', 75: 'right', 74: 'down' },
            '4': { 100: 'left', 104: 'up', 102: 'right', 101: 'down' },
        };
        document.addEventListener('keydown', e => {
            const newDirection = keyMap[this.id][e.keyCode];
            if (newDirection && !this.isOppositeDirection(newDirection)) {
                this.direction = newDirection;
            }
        });
    }

    isOppositeDirection(newDirection) {
        const oppositeDirections = {
            left: 'right',
            right: 'left',
            up: 'down',
            down: 'up',
        };
        return this.direction === oppositeDirections[newDirection];
    }

    move() {
        let dx = 0;
        let dy = 0;

        switch (this.direction) {
            case 'left':
                dx = -1;
                break;
            case 'right':
                dx = 1;
                break;
            case 'up':
                dy = -1;
                break;
            case 'down':
                dy = 1;
                break;
        }

        this.body.unshift({ x: this.body[0].x + dx, y: this.body[0].y + dy });
        this.body.pop();
    }

    draw() {
        ctx.fillStyle = this.color;
        this.body.forEach(segment => {
            ctx.fillRect(segment.x * size, segment.y * size, size, size);
        });
    }

    checkCollision() {
        const head = this.body[0];

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            const segment = this.body[i];
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }

        for (const player of players) {
            if (player.id !== this.id) {
                for (const segment of player.body) {
                    if (head.x === segment.x && head.y === segment.y) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    reset() {
        const { x, y, direction } = initialPlayerPositions[this.id - 1];
        this.body = [{ x, y }];
        this.direction = direction;
        this.score = 0;
    }

    eat(apple) {
        const head = this.body[0];
        if (head.x === apple.x && head.y === apple.y) {
            this.score++;
            this.body.push({ x: head.x, y: head.y });
            return true;
        }
        return false;
    }
}

class Apple {
    constructor() {
        this.x = Math.floor(Math.random() * cols);
        this.y = Math.floor(Math.random() * rows);
        this.color = appleColor;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * size, this.y * size, size, size);
    }
}

function toggleInstructionsPopup() {
    const popup = document.getElementById("instructions-popup");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}
