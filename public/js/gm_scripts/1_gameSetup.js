// gameSetup.js
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

// Game state variables
let players = [];



function sendMessage(message) {
  console.log('Sending message:', message); // Debug log
  socket.send(JSON.stringify(message));
}

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substr(2, 9);
}

function getRoomId() {
  const url = window.location.href;
  const roomId = url.substring(url.lastIndexOf('/') + 1);
  return roomId;
}


function updateStatusBar() {
  const statusElement = document.getElementById('status');
  if (players.length < 2) {
    statusElement.textContent = 'Waiting for more players to join...';
  } else {
    statusElement.textContent = 'Game ready to start!';
  }
}

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const socket = new WebSocket(isLocalhost ? 'ws://localhost:8080' : `wss://${window.location.hostname}`);

let currentPlayerId = generatePlayerId(); // Generate a unique ID for the client
let currentPlayerNumber = null;
let roomId = getRoomId();

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'new_player', roomId: roomId, playerId: currentPlayerId }));
});

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  //console.log('Message from server:', data);

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
      updateStatusBar("Game started! Press arrow keys to Move.");
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
      //socket.close();
      alert('Room is full, redirecting to the game creation page!');
      window.location.href = '/online_snake';
      break;

    case 'reset':
      resetSnakeLocations();
      break;

    case 'update_direction_position':
      //console.log('Received update_direction_position', data);

      const playerIndex = gameState.players.findIndex(player => player.id === data.playerId);
      if (playerIndex !== -1) {
        const player = gameState.players[playerIndex];
        player.direction = data.direction;

        // Ensure snake is an array and update it
        if (!player.snake) {
          player.snake = [];
        }

        const newHead = data.position;
        player.snake.unshift(newHead); // Add new head
        player.snake.pop(); // Remove the tail (assuming no food eaten)

        renderGameState();
        //console.log('Updated player:', player);
        //console.log('Updated game state:', gameState);
      }
      break;

    // Handle other message types as needed
  }
});

socket.addEventListener('close', () => {
  console.log('Disconnected from server');
});

// Game state
let gameState = {
  player1Score: 0,
  player2Score: 0,
  gameRunning: false,
  players: [],
  player1: null,
  player2: null
};

function resetSnakeLocations() {
  gameState.players.forEach((player, index) => {
    player.snake = [initialPlayerPositions[index]];
  });
  initGame('Game reset! Press Start to begin.');
}

// Game initialization
function initGame(msg) {
  gameState.player1Score = 0;
  gameState.player2Score = 0;
  gameState.gameRunning = false;
  gameState.player1 = { snake: [initialPlayerPositions[0]], direction: 'right' };
  gameState.player2 = { snake: [initialPlayerPositions[1]], direction: 'left' };
  updateScores();
  updateStatusBar(msg);
  updateButton("start");
  renderGameState();
}

// Game loop
function gameLoop() {
  // Update game state...

  // Render game state
  renderGameState();

  // Call gameLoop again on the next animation frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Game controls
function startGame() {
  if (gameState.players.length < 2) {
    updateStatusBar("Need at least 2 players to start the game");
    return;
  }
  gameState.gameRunning = true;
  updateStatusBar("Game started! Press arrow keys to Move.");
  sendMessage({ type: 'start_game', roomId: getRoomId() });
  updateButton("pause");
  gameLoop();
}

function pauseGame() {
  gameState.gameRunning = false;
  updateStatusBar("Game paused!");
  updateButton("start");
  sendMessage({ type: 'pause_game', roomId: getRoomId() });
}

function restartGame() {
  //initGame();
  sendMessage({ type: 'reset', roomId: getRoomId() });
}

// Score and status updates
function incrementScore() {
  if (!gameState.gameRunning) return;

  updateScores();
}

function updateScores() {
  console.log('Updating scores:', gameState.player1Score, gameState.player2Score);
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
  gameState.players = players.map(player => ({
    ...player,
    snake: [initialPlayerPositions[player.number - 1]]
  }));
  const playerListElement = document.getElementById('player-list');
  playerListElement.innerHTML = '';
  players.forEach((player) => {
    const li = document.createElement('li');
    li.textContent = `Player ${player.number}: ${player.id}`;
    if (player.id === currentPlayerId) {
      li.style.color = 'red';
    }
    playerListElement.appendChild(li);
  });
  updateStatusBar(`You are Player ${players.find(player => player.id === currentPlayerId).number}. ${gameState.players.length < 2 ? "Need at least 2 players to start the game" : "Game ready to start!"}`);
}

document.addEventListener('keydown', event => {
  //console.log('Keydown event:', event.key);
  if (!gameState.gameRunning) return;

  let player = null;
  if (currentPlayerNumber === 1) {
    player = gameState.player1;
  } else if (currentPlayerNumber === 2) {
    player = gameState.player2;
  }

  if (player) {
    let newDirection = null;
    switch (event.key) {
      case 'ArrowUp':
        newDirection = 'up';
        break;
      case 'ArrowDown':
        newDirection = 'down';
        break;
      case 'ArrowLeft':
        newDirection = 'left';
        break;
      case 'ArrowRight':
        newDirection = 'right';
        break;
    }

    if (newDirection) {
      player.direction = newDirection;
      // Move the player immediately
      let head = { ...player.snake[0] };
      let newHead = { ...head };

      switch (newDirection) {
        case 'up':
          newHead.y -= 1;
          break;
        case 'down':
          newHead.y += 1;
          break;
        case 'left':
          newHead.x -= 1;
          break;
        case 'right':
          newHead.x += 1;
          break;
      }

      player.snake.unshift(newHead); // Add the new head to the snake
      player.snake.pop(); // Remove the tail

      // Send the new direction and position to the server
      sendMessage({
        type: 'update_direction_position',
        playerId: currentPlayerId,
        direction: newDirection,
        position: newHead
      });
      renderGameState();
      //console.log('updated local Player:', player);
    }

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

// Rendering game state
function renderGameState() {
  //console.log('Rendering game state');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameState.players.forEach((player, index) => {
    renderSnake(player.snake, playerColors[index]);
  });
}

function renderSnake(snake, color) {
  ctx.fillStyle = color;
  snake.forEach(segment => {
    ctx.fillRect(segment.x * size, segment.y * size, size, size);
  });
}

function renderFood(food) {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

// Initialize the game
initGame('Waiting for players to join...');

