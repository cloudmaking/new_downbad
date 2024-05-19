const WebSocket = require('ws');
const rows = 30;
const cols = 30;
const initialPlayerPositions = [
    { x: 1, y: 1, direction: 'right' },
    { x: cols - 2, y: rows - 2, direction: 'left' }
];

const rooms = {};

function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            switch (data.type) {
                case 'join':
                    handleJoin(ws, data);
                    break;
                case 'gameState':
                    handleGameState(ws, data);
                    break;
                case 'startGame':
                    handleStartGame(ws, data);
                    break;
                case 'pauseGame':
                    handlePauseGame(ws, data);
                    break;
                case 'restartGame':
                    handleRestartGame(ws, data);
                    break;
                case 'move':
                    handleMove(ws, data);
                    break;
                // Add more message types as needed
            }
        });

        ws.on('close', () => {
            handleLeave(ws);
        });
    });
}

function handleJoin(ws, data) {
    const roomId = data.roomId;
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    if (rooms[roomId].length >= 2) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
        console.log(`Player attempted to join full room ${roomId}`);
        return;
    }

    rooms[roomId].push(ws);
    ws.roomId = roomId;
    const playerId = rooms[roomId].length; // Player ID is based on the order of joining
    ws.playerId = playerId;

    console.log(`Player ${playerId} joined room ${roomId}`);
    broadcast(roomId, { type: 'playerJoined', players: rooms[roomId].length, playerId });

    // Send the initial game state to all players
    if (rooms[roomId].length === 2) {
        const initialState = getGameState(roomId);
        broadcast(roomId, { type: 'gameState', state: initialState });
    }
}


function handleLeave(ws) {
    const roomId = ws.roomId;
    if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(client => client !== ws);
        broadcast(roomId, { type: 'playerLeft', players: rooms[roomId].length });
        console.log(`Player ${ws.playerId} left room ${roomId}`);
    }
}

function handleGameState(ws, data) {
    const roomId = data.roomId;
    if (rooms[roomId]) {
        broadcast(roomId, data);
        console.log(`Game state updated in room ${roomId}`);
    }
}

function handleStartGame(ws, data) {
    const roomId = data.roomId;
    if (rooms[roomId]) {
        broadcast(roomId, { type: 'startGame' });
        console.log(`Game started in room ${roomId}`);
    }
}

function handlePauseGame(ws, data) {
    const roomId = data.roomId;
    if (rooms[roomId]) {
        broadcast(roomId, { type: 'pauseGame' });
        console.log(`Game paused in room ${roomId}`);
    }
}

function handleRestartGame(ws, data) {
    const roomId = data.roomId;
    if (rooms[roomId]) {
        const initialState = getGameState(roomId);
        broadcast(roomId, { type: 'restartGame', state: initialState });
        console.log(`Game restarted in room ${roomId}`);
    }
}

function handleMove(ws, data) {
    const roomId = data.roomId;
    if (rooms[roomId]) {
        broadcast(roomId, data);
        //console.log(`Player ${data.playerId} moved to (${data.position.x}, ${data.position.y}) in room ${roomId}`);
    }
}

function broadcast(roomId, message) {
    rooms[roomId].forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function getGameState(roomId) {
    return {
        players: rooms[roomId].map((ws, index) => ({
            id: index + 1,
            x: initialPlayerPositions[index].x,
            y: initialPlayerPositions[index].y,
            direction: initialPlayerPositions[index].direction,
            ai: false
        }))
    };
}

module.exports = createWebSocketServer;
