//1
const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)
let apple;
let players = [];

//2
function startGame() {
    players = [];
    players.push(new Snake(1, 1, 1)); // Human player
    players.push(new Snake(cols - 2, rows - 2, 2, true)); // AI player

    apple = new Apple();
    updateScores();
    gameLoop();
}

function updateScores() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let scoreElem = document.getElementById(`player${i + 1}-score`);
        if (scoreElem !== null) { // add a null check
            scoreElem.innerHTML = `
          <div class="score-circle" style="background-color: ${player.color}">
            <span class="score-text">${player.score}</span>
          </div>
          <span class="score-label">Player ${i + 1}</span>
        `;
        }
    }
}


//3
function gameLoop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    players.forEach((player, index) => {
        if (index === 1) { // AI-controlled snake (player 2)
            player.aiMove(apple, players[0]); // Pass the player's snake
        }
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

    let winner = players.find(player => player.score >= 25);
    if (winner) {
        alert(`Player ${winner.id} wins!`);
    } else {
        setTimeout(gameLoop, 100);
    }
}


class Snake {
    constructor(x, y, id, ai = false) {
        this.body = [{ x, y }];
        this.id = id;
        this.color = ['#3a71e8', '#9de83a', '#e8c83a', '#d64f83'][id - 1];
        this.direction = id === 1 ? 'right' : id === 2 ? 'left' : id === 3 ? 'down' : 'up';
        this.score = 0;
        this.setControls();
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
        const startX = this.id % 2 === 0 ? 1 : cols - 2;
        const startY = this.id < 3 ? 1 : rows - 2;
        this.body = [{ x: startX, y: startY }];
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
        this.color = '#e8463a';
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