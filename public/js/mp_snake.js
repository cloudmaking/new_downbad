import { startGame, toggleInstructionsPopup } from './game.js';
import Snake from './snake.js';

const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)

function startMP_Game(numPlayers) {
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
        const startX = i % 2 === 0 ? 1 : cols - 2;
        const startY = i < 2 ? 1 : rows - 2;
        players.push(new Snake(startX, startY, i + 1));
    }
    startGame(players);
}

// Attach the startMP_Game function to the buttons for selecting the number of players
document.querySelectorAll('#btns button').forEach((button, index) => {
    button.onclick = () => startMP_Game(index + 1);
});

// Override the toggleInstructionsPopup function from game.js
document.getElementById('instructions-btn').onclick = toggleMP_InstructionsPopup;

function toggleMP_InstructionsPopup() {
    const popup = document.getElementById("instructions-popup");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}
