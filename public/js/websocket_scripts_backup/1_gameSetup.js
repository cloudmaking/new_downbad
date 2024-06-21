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

// socket = new WebSocket(`ws://localhost:8080`);
const socket = new WebSocket(`wss://${window.location.hostname}`);

let currentPlayerId = generatePlayerId(); // Generate a unique ID for the client
let currentPlayerNumber = null;
let roomId = getRoomId();

let p1score = document.getElementById('player1-score').querySelector('.score-text').textContent;
let p2score = document.getElementById('player2-score').querySelector('.score-text').textContent;

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
      console.log('player:', data.player, 'previous score: ', p1score); // Debug log
      if (data.player === 1) {
        // Increment player 1's score
        p1score = parseInt(p1score) + 1;
        console.log('new p1 score: ', p1score); // Debug log
        document.getElementById('player1-score').querySelector('.score-text').textContent = p1score;
      } else if (data.player === 2) {
        // Increment player 2's score
        p2score = parseInt(p2score) + 1;
        console.log('new p2 score: ', p2score); // Debug log
        document.getElementById('player2-score').querySelector('.score-text').textContent = p2score;
      } else {
        console.error('Invalid player number:', data.player);
      }
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

    case 'apple_position':
      gameState.apple = data.position;
      renderGameState();
      break;

    // Handle other message types as needed
  }
});

socket.addEventListener('close', () => {
  console.log('Disconnected from server');
});

// Game state
let gameState = {
  p1score: 0,
  p2score: 0,
  gameRunning: false,
  players: [],
  player1: null,
  player2: null,
  apple: null
};

function eatApple(player) {
  // Check if the apple exists
  if (gameState.apple) {
    const head = player.snake[0];
    if (head.x === gameState.apple.x && head.y === gameState.apple.y) {
      // Increase player's score
      console.log('player.number:', player.number);
      // use teh player.number property as it returns the number of the player who ate the apple adn then send a message to the server 
      sendMessage({ type: 'apple_eaten', roomId: getRoomId(), player: player.number });
    }
  }
}

function resetSnakeLocations() {
  gameState.players.forEach((player, index) => {
    player.snake = [initialPlayerPositions[index]];
  });
  initGame('Game reset! Press Start to begin.');
}

// Game initialization
function initGame(msg) {
  p1score = 0;
  p2score = 0;
  gameState.gameRunning = false;
  gameState.player1 = { snake: [initialPlayerPositions[0]], direction: 'right' };
  gameState.player2 = { snake: [initialPlayerPositions[1]], direction: 'left' };
  updateScores();
  updateStatusBar(msg);
  updateButton("start");
  renderGameState();
}

function updateScores() {
  console.log('Updating scores:', gameState.player1Score, gameState.player2Score);
  document.getElementById('player1-score').querySelector('.score-text').textContent = gameState.player1Score;
  document.getElementById('player2-score').querySelector('.score-text').textContent = gameState.player2Score;
}


// Game loop
function gameLoop() {
  // Update game state...
  gameState.players.forEach(player => {
    eatApple(player);
  });

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
  sendMessage({ type: 'start_game', roomId: getRoomId(), gridSize: { cols: cols, rows: rows } });
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
  renderApple();
}

function renderSnake(snake, color) {
  ctx.fillStyle = color;
  snake.forEach(segment => {
    ctx.fillRect(segment.x * size, segment.y * size, size, size);
  });
}

function renderApple() {
  if (gameState.apple !== null) {
    ctx.fillStyle = 'red';
    ctx.fillRect(gameState.apple.x * size, gameState.apple.y * size, size, size);
  }
}

// Initialize the game
initGame('Waiting for players to join...');

