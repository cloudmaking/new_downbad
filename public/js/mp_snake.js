const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)
let apple;
let players = [];

function startGame(numPlayers) {
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        const startX = i % 2 === 0 ? 1 : cols - 2;
        const startY = i < 2 ? 1 : rows - 2;
        players.push(new Snake(startX, startY, i + 1));
    }

    apple = new Apple();
    updateScores();
    gameLoop();
}

function updateScores() {
    let scoresHTML = '';
    players.forEach((player, index) => {
      scoresHTML += `
        <div class="player-score">
          <div class="score-circle" style="background-color: ${player.color};">
            <span class="score-text">${player.score}</span>
          </div>
          <p class="score-label">Player ${index + 1}</p>
        </div>
      `;
    });
    document.getElementById('scores').innerHTML = scoresHTML;
  }
  

function gameLoop() {
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

    let winner = players.find(player => player.score >= 25);
    if (winner) {
        alert(`Player ${winner.id} wins!`);
    } else {
        setTimeout(gameLoop, 100);
    }
}

class Snake {
    constructor(x, y, id) {
        this.body = [{ x, y }];
        this.id = id;
        this.color = ['#3a71e8', '#9de83a', '#e8c83a', '#d64f83'][id - 1];
        this.direction = id === 1 ? 'right' : id === 2 ? 'left' : id === 3 ? 'down' : 'up';
        this.score = 0;
        this.setControls();
    }

    setControls() {
        document.addEventListener('keydown', e => {
            const keyMap = {
                '1': { 37: 'left', 39: 'right' },
                '2': { 65: 'left', 68: 'right' },
                '3': { 100: 'left', 102: 'right' },
                '4': { 72: 'left', 75: 'right' },
            };
            const turnDirection = keyMap[this.id][e.keyCode];
            if (turnDirection) {
                this.turn(turnDirection);
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