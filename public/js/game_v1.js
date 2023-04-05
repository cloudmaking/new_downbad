//1
//This code selects the canvas element using its ID, gets its 2D context, 
//and initializes the rows, columns, and size of each cell in the grid. 
//Additionally, it initializes the apple and players variables, 
//which will be used later in the script.

const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)
let apple;
let players = [];

//2
//The startGame function takes the number of players as an argument and 
//initializes the players array with new Snake instances for each player. 
//It also creates a new Apple instance and calls the updateScores function 
//to display the initial scores. Finally, it starts the game loop by calling 
//the gameLoop function.

//The updateScores function generates the HTML for the scores of all players 
//and updates the innerHTML of the scores element.
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
        scoresHTML += `<p>Player ${index + 1}: ${player.score}</p>`;
    });
    document.getElementById('scores').innerHTML = scoresHTML;
}

//3
//The gameLoop function handles the game logic. 
//It clears the canvas, moves and draws each player's snake, 
//and draws the apple. Then it checks if any snake has collided with itself, 
//another snake, or the wall. If so, the snake resets. If a snake eats the 
//apple, a new apple is created, and the scores are updated. The loop checks 
//for a winner and, if there's no winner yet, it schedules the next iteration 
//of the game loop with a timeout.
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

//4
//The Snake class represents a snake in the game. 
//It has methods for setting controls, checking for 
//opposite directions, moving, drawing, checking collisions, 
//resetting, and eating apples. 
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

    isOppositeDirection(newDirection) {
        const oppositeDirections = {
            left: 'right',
            right: 'left',
            up: 'down',
            down: 'up',
        };
        return this.direction === oppositeDirections[newDirection];
    }

    //5
    //These methods handle the movement, drawing, collision detection, 
    //resetting, and apple eating for each snake. Now the Snake class is complete.
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
    //These methods handle the movement, drawing, collision detection, 
    //resetting, and apple eating for each snake. Now the Snake class is complete.
}

//6
//The Apple class represents an apple in the game. 
//The constructor generates random x and y coordinates within the grid, 
//and sets the color to red. The draw method is responsible for drawing 
//the apple on the canvas.
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