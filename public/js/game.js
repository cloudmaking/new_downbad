import Apple from './apple.js';
import Snake from './snake.js';

const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)
let apple;
let players = [];

function startGame(playersArray) {
    players = playersArray;
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

function gameLoop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    players.forEach(player => {
        player.move();
        player.draw(ctx);
    });

    apple.draw(ctx);

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

function toggleInstructionsPopup() {
    const popup = document.getElementById("instructions-popup");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}

export { startGame, toggleInstructionsPopup };
