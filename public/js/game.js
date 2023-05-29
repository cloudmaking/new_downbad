const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

let gameState = {
    players: [],
    queue: [],
};

function sendGameState() {
    const gameStateString = JSON.stringify(gameState);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(gameStateString);
        }
    });
}

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        console.log('Received message:', message);
        const { type, data } = JSON.parse(message);

        switch (type) {
            case 'join':
                const player = {
                    ws: ws,
                    score: 0,
                    // Add more properties as needed
                };

                if (gameState.players.length < 2) {
                    gameState.players.push(player);
                } else {
                    gameState.queue.push(player);
                }
                break;
            case 'move':
                const movingPlayer = gameState.players.find(p => p.ws === ws);

                if (movingPlayer) {
                    // Update the player's snake's position based on the data from the message
                    // You'll need to implement this based on how you're representing the snake's position

                    // Check for collisions
                    // You'll need to implement this based on how you're representing the snake's position
                }
                break;
            // Add more cases as needed
        }

        // Send the updated game state to all clients
        sendGameState();
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove the player from the game and the queue
        gameState.players = gameState.players.filter(p => p.ws !== ws);
        gameState.queue = gameState.queue.filter(p => p.ws !== ws);

        // If there are players waiting in the queue, add the next one to the game
        if (gameState.queue.length > 0) {
            const nextPlayer = gameState.queue.shift();
            gameState.players.push(nextPlayer);
        }

        // Send the updated game state to all clients
        sendGameState();
    });

    ws.send('Welcome to the game!');
});
