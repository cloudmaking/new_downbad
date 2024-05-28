const WebSocket = require('ws');

// Initial game state
let gamestate = {
  player1: {
    id: null,
    location: { x: 1, y: 1 },
    direction: { x: 1, y: 0 },
    score: 0
  },
  player2: {
    id: null,
    location: { x: 28, y: 28 },
    direction: { x: -1, y: 0 },
    score: 0
  },
  apple: { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) },
  gameRunning: false,
  statusBarText: "Waiting for players...",
  startButtonText: "Start Game"
};

function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        // Assign player ID on connection, make id 1 if player 1 is not connected, 
        // update the status bar txt to waiting for player 2
        // else make id 2, update the status bar txt to press start to begin
        // if both players are connected, do not assign id
        
        if (gamestate.player1.id === null) {
            ws.playerId = generatePlayerId();
            gamestate.player1.id = ws.playerId;
            gamestate.statusBarText = "Waiting for player 2...";
        } else if (gamestate.player2.id === null) {
            ws.playerId = generatePlayerId();
            gamestate.player2.id = ws.playerId;
            gamestate.statusBarText = "Press start to begin";
        } else {
            ws.playerId = null;
            // tell client that game is full
            ws.send(JSON.stringify({ type: 'game_full' }));

            // disconnect client
            ws.close();
        }
        // send gamestate to all clients
        broadcastGameState();

        

        // Send initial game state to the newly connected client
        ws.send(JSON.stringify({ type: 'update_game_state', gameState: gamestate }));
        broadcastGameState();

        ws.on('message', (message) => {
            let data = JSON.parse(message);
            console.log('Received message:', data);

            switch (data.type) {
                case 'update_game_state':
                    gamestate = data.gameState;
                    broadcastGameState();
                    break;

                // Handle other message types as needed
            }
        });

        ws.on('close', () => {
            console.log('Connection closed');
            if (ws.playerId === gamestate.player1.id) {
                gamestate.player1.id = null;
                gamestate.statusBarText = "Player 1 has left.";
            } else if (ws.playerId === gamestate.player2.id) {
                gamestate.player2.id = null;
                gamestate.statusBarText = "Player 2 has left.";
            }
            broadcastGameState();
        });
    });

    function broadcastGameState() {
        const message = JSON.stringify({
            type: 'update_game_state',
            gameState: gamestate
        });

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    function generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
      }
}

module.exports = createWebSocketServer;
