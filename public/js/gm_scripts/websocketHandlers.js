const socket = new WebSocket(`ws://${window.location.host}`);

let currentPlayerId = generatePlayerId(); // Generate a unique ID for the client
let currentPlayerNumber = null;

socket.addEventListener('open', () => {
    console.log('Connected to server');
    socket.send(JSON.stringify({ type: 'new_player', roomId: '<%= roomId %>', playerId: currentPlayerId }));
});

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);

    switch (data.type) {
        case 'update_player_list':
            console.log('Player list:', data.players);
            updatePlayersList(data.players);
            const currentPlayer = data.players.find(player => player.id === currentPlayerId);
            if (currentPlayer) {
                currentPlayerNumber = currentPlayer.number; // Set the current player number
                console.log('Current player number:', currentPlayerNumber); // Debug log
            }
            break;

        case 'start_game':
            gameState.gameRunning = true;
            updateStatusBar("Game started! Press arrow keys to count.");
            updateButton("pause");
            break;

        case 'pause_game':
            gameState.gameRunning = false;
            updateStatusBar("Game paused!");
            updateButton("start");
            break;

        case 'score_update':
            console.log('Score update:', data); // Debug log
            if (data.player === 'player1') {
                gameState.player1Score = data.score;
            } else if (data.player === 'player2') {
                gameState.player2Score = data.score;
            }
            updateScores();
            break;

        case 'redirect':
            alert('Room is full, redirecting to the game creation page!');
            window.location.href = '/online_snake';
            break;

        // Handle other message types as needed
    }
});

socket.addEventListener('close', () => {
    console.log('Disconnected from server');
});

function sendMessage(message) {
    console.log('Sending message:', message); // Debug log
    socket.send(JSON.stringify(message));
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}
