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
    { x: cols - 2, y: rows - 2, direction: 'left' } // Initial position and direction of player 2
];
const winScore = 25; // Score needed to win the game

let apple;
let players = [];
let gameInterval;
let isPaused = true; // Start the game as paused

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

cvs.addEventListener('touchstart', handleTouchStart, false);
cvs.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchmove', preventDefault, { passive: false });

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = evt.touches[0].clientX;
    let touchEndY = evt.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            players[0].direction = 'right';
        } else {
            players[0].direction = 'left';
        }
    } else {
        if (dy > 0) {
            players[0].direction = 'down';
        } else {
            players[0].direction = 'up';
        }
    }

    touchStartX = null;
    touchStartY = null;
}

function preventDefault(e) {
    if (e.touches.length > 1) {
        return;
    }
    if (e.target === cvs) {
        e.preventDefault();
    }
}

function initializeGame() {
    console.log("Initializing game...");
    players = initialPlayerPositions.map((pos, index) => 
        new Snake(pos.x, pos.y, index + 1, index === 1) // Second player is AI-controlled
    );

    apple = new Apple();
    updateScores();
    console.log("Game initialized:", players);
}

function startGame() {
    //console.log("Starting game...");
    if (players.length === 0) {
        initializeGame(); // Ensure the game is initialized
    }
    isPaused = false;
    startBtn.innerText = "Pause Game";
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function restartGame() {
    clearInterval(gameInterval);
    initializeGame();
    startGame();
}

function toggleGame() {
    if (isPaused) {
        startGame();
    } else {
        isPaused = true;
        startBtn.innerText = "Resume Game";
        clearInterval(gameInterval);
    }
}

function updateScores() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let scoreElem = document.getElementById(`player${i + 1}-score`);
        if (scoreElem) {
            let scoreCircle = scoreElem.querySelector('.score-circle');
            let scoreText = scoreElem.querySelector('.score-text');
            if (scoreCircle && scoreText) {
                scoreCircle.style.backgroundColor = player.color;
                scoreText.textContent = player.score;
            }
        }
    }
}

function gameLoop() {
    if (isPaused) return;

    //console.log("Game loop running...", players);

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    players.forEach((player, index) => {
        if (index === 1) { // AI-controlled snake (player 2)
            player.aiMove(apple, players[0]); // Pass the player's snake
        }
        player.move();
        player.draw(); // Ensure 'player' is defined and has a 'draw' method
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
    constructor(x, y, id, ai = false) {
        this.body = [{ x, y }];
        this.id = id;
        this.color = playerColors[id - 1];
        this.direction = initialPlayerPositions[id - 1].direction;
        this.score = 0;
        this.ai = ai;
        if (!this.ai) {
            this.setControls();
        }
    }

    setControls() {
        document.addEventListener('keydown', e => {
            const keyMap = {
                '1': { 37: 'left', 38: 'up', 39: 'right', 40: 'down' },
                '2': { 65: 'left', 87: 'up', 68: 'right', 83: 'down' },
                '3': { 100: 'left', 104: 'up', 102: 'right', 101: 'down' },
                '4': { 72: 'left', 85: 'up', 75: 'right', 74: 'down' },
            };
            const newDirection = keyMap[this.id][e.keyCode];
            if (newDirection && !this.isOppositeDirection(newDirection)) {
                this.direction = newDirection;
            }
        });
    }

    turn(turnDirection) {
        const turns = {
            left: { up: 'left', down: 'right', left: 'down', right: 'up' },
            right: { up: 'right', down: 'left', left: 'up', right: 'down' },
        };
        this.direction = turns[turnDirection][this.direction];
    }

    aiMove(apple, player) {
        const head = this.body[0];
        const dx = apple.x - head.x;
        const dy = apple.y - head.y;

        const directions = ['left', 'right', 'up', 'down'];

        // Calculate next positions based on the current direction
        const nextPositions = {
            left: { x: head.x - 1, y: head.y },
            right: { x: head.x + 1, y: head.y },
            up: { x: head.x, y: head.y - 1 },
            down: { x: head.x, y: head.y + 1 },
        };

        // Remove directions that would cause the AI snake to collide with itself
        directions.forEach(dir => {
            if (this.isOppositeDirection(dir) || this.willCollideWithItself(nextPositions[dir])) {
                directions.splice(directions.indexOf(dir), 1);
            }
        });

        // Remove directions that would cause the AI snake to collide with the player's snake
        directions.forEach(dir => {
            if (this.willCollideWithPlayer(nextPositions[dir], player)) {
                directions.splice(directions.indexOf(dir), 1);
            }
        });

        // Calculate distance to the apple for each remaining direction
        const distances = directions.map(dir => {
            const newPos = nextPositions[dir];
            return { dir, distance: Math.abs(newPos.x - apple.x) + Math.abs(newPos.y - apple.y) };
        });

        // Sort the distances in ascending order
        distances.sort((a, b) => a.distance - b.distance);

        // Choose the safest direction with the shortest distance to the apple
        this.direction = distances.length > 0 ? distances[0].dir : this.direction;
    }

    willCollideWithItself(nextPosition) {
        for (const segment of this.body) {
            if (nextPosition.x === segment.x && nextPosition.y === segment.y) {
                return true;
            }
        }
        return false;
    }

    willCollideWithPlayer(nextPosition, player) {
        for (const segment of player.body) {
            if (nextPosition.x === segment.x && nextPosition.y === segment.y) {
                return true;
            }
        }
        return false;
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
