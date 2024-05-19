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

// Game loop variables
const movementSpeed = 300; // Speed in milliseconds

let players = [];
let isPaused = true; // Start the game as paused
let playersJoined = 0; // Track the number of players who have joined
let playerId = null; // To track whether the client is Player 1 or Player 2
let apple; // Track the apple's position

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

let wsConnected = false; // Flag to check WebSocket connection state

ws.onopen = () => {
    console.log('WebSocket connection opened');
    wsConnected = true; // Set the flag to true when WebSocket is connected
};


ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
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
            if (data.body) {
                updatePlayerPosition(data.playerId, data.position, data.body);
            } else {
                console.error('Received move data without body:', data);
            }
            break;
        case 'appleUpdate':
            apple = data.apple;
            drawGame();
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
        default:
            console.error('Unknown message type:', data.type);
            break;
    }
};


function gameLoop() {
    if (isPaused) return;

    players.forEach(player => {
        // Move snake's body
        const head = { ...player.body[0] };
        switch (player.direction) {
            case 'right':
                head.x += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            default:
                console.error(`Unknown direction: ${player.direction}`);
                break;
        }

        // Add new head to the body
        player.body.unshift(head);

        // Check for apple collision
        if (head.x === apple.x && head.y === apple.y) {
            apple = placeApple(); // Place a new apple if the snake eats it
            if (wsConnected) {
                ws.send(JSON.stringify({ type: 'appleUpdate', roomId, apple }));
            } else {
                console.error("WebSocket is not connected. Cannot send apple update.");
            }
        } else {
            player.body.pop(); // Remove the last part of the snake's body if it didn't eat the apple
        }

        // Ensure body is included in the WebSocket message
        if (wsConnected) {
            ws.send(JSON.stringify({ type: 'move', roomId, playerId: player.id, position: { x: player.x, y: player.y }, body: player.body }));
        } else {
            console.error("WebSocket is not connected. Cannot send move data.");
        }
    });

    drawGame();

    setTimeout(gameLoop, movementSpeed);
}



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
    console.log("Game restarted from handleRestartGame");
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
    players = initialPlayerPositions.map((pos, index) => ({
        x: pos.x,
        y: pos.y,
        id: index + 1,
        color: playerColors[index],
        direction: pos.direction,
        body: [{ x: pos.x, y: pos.y }] // Initialize snake body
    }));
    apple = placeApple(); // Place the initial apple
    if (wsConnected) {
        ws.send(JSON.stringify({ type: 'gameState', roomId, state: { players, apple } }));
    } else {
        console.error("WebSocket is not connected. Cannot send game state.");
    }
    console.log("Game initialized:", players);
}



function initializeGameWhenConnected() {
    if (wsConnected) {
        initializeGame();
    } else {
        // Retry after a short delay if the WebSocket is not connected
        setTimeout(initializeGameWhenConnected, 100);
    }
}



// Inside startGame
function startGame() {
    if (playersJoined < 2) {
        alert("Both players need to join before starting the game.");
        return;
    }
    if (players.length === 0) {
        initializeGameWhenConnected(); // Ensure the game is initialized
    }
    isPaused = false;
    startBtn.innerText = "Pause Game";
    if (wsConnected) {
        ws.send(JSON.stringify({ type: 'startGame', roomId }));
        ws.send(JSON.stringify({ type: 'appleUpdate', roomId, apple })); // Send initial apple position
    } else {
        console.error("WebSocket is not connected. Cannot start the game.");
    }
    console.log("Game started");
    gameLoop();
}

// Inside handleRestartGame
function handleRestartGame() {
    initializeGameWhenConnected();
    startGame();
    console.log("Game restarted handleRestartGame");
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

function updatePlayerPosition(playerId, position, body, newApple) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.x = position.x;
        player.y = position.y;
        player.body = body || player.body; // Use the provided body or fallback to the existing body
        if (newApple) {
            apple = newApple;
        }
        drawGame();
    } else {
        console.error(`Player with ID ${playerId} not found`);
    }
}

function updateGameState(state) {
    state.players.forEach(p => {
        const player = players.find(pl => pl.id === p.id);
        if (player) {
            player.x = p.x;
            player.y = p.y;
            player.body = p.body; // Ensure body is updated
        }
    });
    apple = state.apple; // Update the apple state
    console.log("Game state updated:", state);
    drawGame();
}



function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw apple
    if (apple) {
        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x * size, apple.y * size, size, size);
    } else {
        console.error("Apple is not defined.");
    }

    // Draw players (snakes)
    players.forEach(player => {
        ctx.fillStyle = player.color;
        player.body.forEach(segment => {
            ctx.fillRect(segment.x * size, segment.y * size, size, size);
        });
    });
}



function placeApple() {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    return { x, y };
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
initializeGameWhenConnected();


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
            // Make the snake move in the direction of the key press
            if (move.dx === -1) player.direction = 'left';
            if (move.dx === 1) player.direction = 'right';
            if (move.dy === -1) player.direction = 'up';
            if (move.dy === 1) player.direction = 'down';
            ws.send(JSON.stringify({ type: 'move', roomId, playerId: player.id, position: { x: player.x, y: player.y }, body: player.body }));
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const homeButton = document.getElementById("homeButton");


    // Navigate to home page when home button is clicked
    homeButton.addEventListener("click", () => {
        window.location.href = '/';
    });
});