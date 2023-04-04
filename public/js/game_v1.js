const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const btns = document.getElementById('btns');
const scoresDiv = document.getElementById('scores');

const size = 20;
const rows = cvs.height / size;
const cols = cvs.width / size;
const colors = ['#0F0', '#F00', '#00F', '#FF0'];
const controls = [
  { up: 38, down: 40, left: 37, right: 39 },
  { up: 87, down: 83, left: 65, right: 68 },
  { up: 73, down: 75, left: 74, right: 76 },
  { up: 104, down: 98, left: 100, right: 102 },
];

let players = [];
let apple;
let numPlayers;

function startGame(p) {
  numPlayers = p;
  btns.style.display = 'none';
  init();
}

function init() {
  players = [];
  for (let i = 0; i < numPlayers; i++) {
    const x = i % 2 === 0 ? 1 : cols - 2;
    const y = i < 2 ? 1 : rows - 2;
    players.push(new Snake(x, y, colors[i], controls[i]));
  }
  apple = new Apple();
  updateScores();
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  apple.draw();

  for (const player of players) {
    player.move();
    player.draw();
    player.checkCollision();

    if (player.eat(apple)) {
      apple = new Apple();
      player.grow();
      player.score++;
      updateScores();
      if (player.score === 25) {
        alert(player.color.toUpperCase() + ' player wins!');
        btns.style.display = 'block';
        return;
      }
    }
  }

  setTimeout(gameLoop, 100);
}

function updateScores() {
  scoresDiv.innerHTML = '';
  for (const player of players) {
    const score = document.createElement('div');
    score.style.color = player.color;
    score.innerHTML = player.color.toUpperCase() + ': ' + player.score;
    scoresDiv.appendChild(score);
  }
}

class Snake {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.controls = controls;
    this.dx = 1;
    this.dy = 0;
    this.body = [];
    this.score = 0;

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === controls.up && this.dy === 0) {
        this.dx = 0;
        this.dy = -1;
      } else if (e.keyCode === controls.down && this.dy === 0) {
        this.dx = 0;
        this.dy = 1;
      } else if (e.keyCode === controls.left && this.dx === 0) {
        this.dx = -1;
        this.dy = 0;
      } else if (e.keyCode === controls.right && this.dx === 0) {
        this.dx = 1;
        this.dy = 0;
      }
    });
  }

  move() {
    this.body.unshift({ x: this.x, y: this.y });
    this.body.pop();
    this.x += this.dx;
    this.y += this.dy;
  }

  draw() {
    ctx.fillStyle = this.color;
    this.body.forEach((p) => {
      ctx.fillRect(p.x * size, p.y * size, size, size);
      ctx.strokeRect(p.x * size, p.y * size, size, size);
    });
  }

  grow() {
    this.body.push({});
  }

  eat(apple) {
    return this.x === apple.x && this.y === apple.y;
  }

  checkCollision() {
    if (this.x < 0 || this.y < 0 || this.x >= cols || this.y >= rows) {
      this.reset();
    }

    this.body.forEach((p, i) => {
      if (i > 0 && this.x === p.x && this.y === p.y) {
        this.reset();
      }
      players.forEach((other) => {
        if (other !== this && other.body.some((q) => q.x === this.x && q.y === this.y)) {
          this.reset();
        }
      });
    });
  }

  reset() {
    this.x = this.controls === controls[0] ? 1 : cols - 2;
    this.y = this.controls === controls[0] || this.controls === controls[1] ? 1 : rows - 2;
    this.dx = 1;
    this.dy = 0;
    this.body = [];
    this.score = 0;
  }
}

class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * cols);
    this.y = Math.floor(Math.random() * rows);
    this.color = '#F00';
    this.size = size;

    for (const player of players) {
      player.body.forEach((p) => {
        if (this.x === p.x && this.y === p.y) {
          this.x = Math.floor(Math.random() * cols);
          this.y = Math.floor(Math.random() * rows);
        }
      });
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * size, this.y * size, size, size);
    ctx.strokeRect(this.x * size, this.y * size, size, size);
  }
}

// Resize the canvas to the desired size
cvs.width = size * cols;
cvs.height = size * rows;
