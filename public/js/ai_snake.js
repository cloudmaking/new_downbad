import { startGame, toggleInstructionsPopup } from './game.js';
import AI_Snake from './snake.js';

const cvs = document.getElementById('board');
const ctx = cvs.getContext('2d');
const rows = 30;
const cols = 30;
const size = 20; // The size of each cell (20x20)

function startAI_Game() {
    const humanPlayer = new Snake(1, 1, 1);
    const aiPlayer = new AI_Snake(cols - 2, 1, 2);
    startGame([humanPlayer, aiPlayer]);
}

// Attach the startAI_Game function to the Start Game button
document.querySelector('#btns button').onclick = startAI_Game;

// Override the toggleInstructionsPopup function from game.js
document.getElementById('instructions-btn').onclick = toggleAI_InstructionsPopup;

function toggleAI_InstructionsPopup() {
    const popup = document.getElementById("instructions-popup");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}

// AI Snake-specific logic
class AI_Snake extends Snake {
    constructor(x, y, id) {
        super(x, y, id);
    }

    // Override the setControls method to prevent user input for the AI snake
    setControls() {}
}
