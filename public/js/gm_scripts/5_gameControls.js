// gameControls.js

document.addEventListener('keydown', event => {
    console.log('Key pressed:', event.key); // Debug log
    if (!gameState.gameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            console.log('ArrowUp pressed by player', currentPlayerNumber); // Debug log
            if (currentPlayerNumber === 1) {
                incrementScore('player1');
            } else if (currentPlayerNumber === 2) {
                incrementScore('player2');
            }
            break;
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!gameState.gameRunning) {
        startGame();
    } else {
        pauseGame();
    }
});

document.getElementById('restart-btn').addEventListener('click', () => {
    restartGame();
});
