// gameLogic.js

let gameState = {
    player1Score: 0,
    player2Score: 0,
    gameRunning: false,
    players: []
};

function initGame() {
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    gameState.gameRunning = false;
    updateScores();
    updateStatusBar("Waiting for players...");
    updateButton("start");
}

function startGame() {
    if (gameState.players.length < 2) {
        updateStatusBar("Need at least 2 players to start the game");
        return;
    }
    gameState.gameRunning = true;
    updateStatusBar("Game started! Press arrow keys to count.");
    sendMessage({ type: 'start_game', roomId: getRoomId() });
    updateButton("pause");
}

function pauseGame() {
    gameState.gameRunning = false;
    updateStatusBar("Game paused!");
    updateButton("start");
    sendMessage({ type: 'pause_game', roomId: getRoomId() });
}

function restartGame() {
    initGame();
    startGame();
}

function incrementScore(player) {
    if (!gameState.gameRunning) return;

    console.log('Increment score for', player); // Debug log

    if (player === 'player1') {
        gameState.player1Score++;
        sendMessage({ type: 'increment_score', roomId: getRoomId(), player: 'player1', score: gameState.player1Score });
    } else if (player === 'player2') {
        gameState.player2Score++;
        sendMessage({ type: 'increment_score', roomId: getRoomId(), player: 'player2', score: gameState.player2Score });
    }
    updateScores();
}

function updateScores() {
    console.log('Updating scores:', gameState.player1Score, gameState.player2Score); // Debug log
    document.getElementById('player1-score').querySelector('.score-text').textContent = gameState.player1Score;
    document.getElementById('player2-score').querySelector('.score-text').textContent = gameState.player2Score;
}

function updateStatusBar(message = "") {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
}

function updateButton(state) {
    const startButton = document.getElementById('start-btn');
    if (state === "start") {
        startButton.textContent = "Start Game";
    } else if (state === "pause") {
        startButton.textContent = "Pause Game";
    }
}

function updatePlayersList(players) {
    gameState.players = players;
    const playerListElement = document.getElementById('player-list');
    playerListElement.innerHTML = '';
    players.forEach((player) => {
        const li = document.createElement('li');
        li.textContent = `Player ${player.number}: ${player.id}`;
        if (player.id === currentPlayerId) {
            li.style.color = 'red'; // Highlight the current player
        }
        playerListElement.appendChild(li);
    });
    updateStatusBar(`You are Player ${players.find(player => player.id === currentPlayerId).number}. ${gameState.players.length < 2 ? "Need at least 2 players to start the game" : "Game ready to start!"}`);
}

initGame();
