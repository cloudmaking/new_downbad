const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Customization Variables
const size = 20; // The size of each cell (20x20)
const playerColors = ['#3a71e8', '#9de83a']; // Colors for each player
const rows = 30;
const cols = 30;
const initialPlayerPositions = [
    { x: 1, y: 1, direction: 'right' },
    { x: cols - 2, y: rows - 2, direction: 'left' }
];

// gameloop variables
const movementSpeed = 300; // Speed in milliseconds


let players = [];
let isPaused = true; // Start the game as paused
let playersJoined = 0; // Track the number of players who have joined
let playerId = null; // To track whether the client is Player 1 or Player 2

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchmove', preventDefault, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

// WebSocket setup
const roomId = '<%= roomId %>';
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
    console.log('WebSocket connection opened');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    //console.log('Received message:', data);
    switch (data.type) {
        case 'playerJoined':
            playersJoined = data.players;
            if (!playerId) {
                playerId = data.playerId; // Assign the playerId to the client only if it hasn't been assigned
            }
            updateJoinButton(playerId);
            if (playersJoined === 2) {
                startBtn.disabled = false;
                restartBtn.disabled = false;
            }
            break;
        case 'playerLeft':
            playersJoined = data.players;
            updateJoinButton();
            break;
        case 'move':
            updatePlayerPosition(data.playerId, data.position);
            break;
        case 'gameState':
            updateGameState(data.state);
            break;
        case 'startGame':
            handleStartGame();
            break;
        case 'pauseGame':
            handlePauseGame();
            break;
        case 'restartGame':
            handleRestartGame();
            break;
        case 'error':
            alert(data.message);
            break;
    }
};

function joinGame() {
    if (playersJoined < 2) {
        ws.send(JSON.stringify({ type: 'join', roomId, playerId: playersJoined + 1 }));
        console.log(`Player ${playersJoined + 1} attempting to join the game`);
    } else {
        alert("Both players have already joined.");
    }
}



function handleStartGame() {
    if (players.length === 0) {
        initializeGame(); // Ensure the game is initialized
    }
    isPaused = false;
    startBtn.innerText = "Pause Game";
    console.log("Game started from handleStartGame");
    gameLoop();
}

function handlePauseGame() {
    isPaused = true;
    startBtn.innerText = "Resume Game";
    console.log("Game paused from handlePauseGame");
}

function handleRestartGame() {
    initializeGame();
    startGame();
    console.log("Game restarted handleRestartGame");
}

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = evt.touches[0].clientX;
    let touchEndY = evt.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            players[0].direction = 'right';
        } else {
            players[0].direction = 'left';
        }
    } else {
        if (dy > 0) {
            players[0].direction = 'down';
        } else {
            players[0].direction = 'up';
        }
    }

    touchStartX = null;
    touchStartY = null;
}

function preventDefault(e) {
    if (e.touches.length > 1) {
        return;
    }
    if (e.target === canvas) {
        e.preventDefault();
    }
}

function initializeGame() {
    console.log("Initializing game...");
    players = initialPlayerPositions.map((pos, index) => ({
        x: pos.x,
        y: pos.y,
        id: index + 1,
        color: playerColors[index],
        direction: pos.direction // Set initial direction
    }));
    console.log("Game initialized:", players);
}


function startGame() {
    if (playersJoined < 2) {
        alert("Both players need to join before starting the game.");
        return;
    }
    if (players.length === 0) {
        initializeGame(); // Ensure the game is initialized
    }
    isPaused = false;
    startBtn.innerText = "Pause Game";
    ws.send(JSON.stringify({ type: 'startGame', roomId }));
    console.log("Game started");
    gameLoop();
}

function restartGame() {
    ws.send(JSON.stringify({ type: 'restartGame', roomId }));
    handleRestartGame();
}

function toggleGame() {
    if (isPaused) {
        ws.send(JSON.stringify({ type: 'startGame', roomId }));
        handleStartGame();
    } else {
        ws.send(JSON.stringify({ type: 'pauseGame', roomId }));
        handlePauseGame();
    }
}

function gameLoop() {
    if (isPaused) return;

    players.forEach(player => {
        switch (player.direction) {
            case 'right':
                player.x += 1;
                break;
            case 'left':
                player.x -= 1;
                break;
            case 'up':
                player.y -= 1;
                break;
            case 'down':
                player.y += 1;
                break;
        }

        ws.send(JSON.stringify({ type: 'move', roomId, playerId: player.id, position: { x: player.x, y: player.y } }));
    });

    drawPlayers();

    setTimeout(gameLoop, movementSpeed);
}


function updatePlayerPosition(playerId, position) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.x = position.x;
        player.y = position.y;
        //console.log(`Player ${playerId} moved to (${player.x}, ${player.y})`);
        drawPlayers();
    }
}

function updateGameState(state) {
    state.players.forEach(p => {
        const player = players.find(pl => pl.id === p.id);
        if (player) {
            player.x = p.x;
            player.y = p.y;
        }
    });
    console.log("Game state updated:", state);
    drawPlayers();
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x * size, player.y * size, size, size);
    });
}

// Handle join game functionality
function joinGame() {
    if (playersJoined < 2) {
        ws.send(JSON.stringify({ type: 'join', roomId, playerId: playersJoined + 1 }));
        console.log(`Player ${playersJoined + 1} attempting to join the game`);
    } else {
        alert("Both players have already joined.");
    }
}


function updateJoinButton(playerId = null) {
    const joinBtn = document.getElementById('join-game-button');
    if (playerId) {
        joinBtn.innerText = `You are Player ${playerId}`;
        joinBtn.disabled = true;
    } else if (playersJoined === 1) {
        joinBtn.innerText = "Waiting for Player 2...";
        joinBtn.disabled = true;
    } else if (playersJoined === 2) {
        joinBtn.innerText = "Both Players Joined";
        joinBtn.disabled = true;
    }
}

// Function to copy link to clipboard
function copyLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Game link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
    });
}

// Event listener for the copy link button
document.getElementById('copy-link-button').addEventListener('click', copyLink);

// Disable start and restart buttons until both players have joined
startBtn.disabled = true;
restartBtn.disabled = true;

// Start the game
initializeGame();

// Event listeners for controlling the player movements
document.addEventListener('keydown', e => {
    if (isPaused) return; // Ignore key presses if the game is paused

    const keyMap = {
        37: { dx: -1, dy: 0 }, // left arrow
        38: { dx: 0, dy: -1 }, // up arrow
        39: { dx: 1, dy: 0 },  // right arrow
        40: { dx: 0, dy: 1 },  // down arrow
        65: { dx: -1, dy: 0 }, // 'A' key
        87: { dx: 0, dy: -1 }, // 'W' key
        68: { dx: 1, dy: 0 },  // 'D' key
        83: { dx: 0, dy: 1 }   // 'S' key
    };

    const move = keyMap[e.keyCode];
    if (move) {
        const player = players.find(p => p.id === playerId);
        if (player) {
            player.x += move.dx;
            player.y += move.dy;
            //console.log(`Player ${player.id} moved to (${player.x}, ${player.y})`);
            ws.send(JSON.stringify({ type: 'move', roomId, playerId: player.id, position: { x: player.x, y: player.y } }));
        }
    }
});
