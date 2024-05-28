//websocket handler
const socket = new WebSocket(`ws://localhost:8080`);
//const socket = new WebSocket(`wss://${window.location.hostname}`);


//variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const size = 20; // The size of each cell (20x20)
const playerColors = ['#3a71e8', '#9de83a']; // Colors for each player
const rows = 30;
const cols = 30;

let currentPlayerId // Generate a unique ID for the client
let roomId = getRoomId();

let p1score = document.getElementById('player1-score').querySelector('.score-text').textContent;
let p2score = document.getElementById('player2-score').querySelector('.score-text').textContent;

let statusBar = document.getElementById('status').textContent;

let gamestate = {};

// make a gaemstate object, thi shsould have, player 1 and 2 loaction direction and score, apple location, gaem running or paused, 
// status bar msg for players 
//gamestate = {
//  player1: {
//    id: null,
//    location: { x: 0, y: 0 },
//    direction: { x: 1, y: 0 },
//    score: 0
//  },
//  player2: {
//    id: null,
//    location: { x: 0, y: 0 },
//    direction: { x: 1, y: 0 },
//    score: 0
//  },
//  apple: { x: 0, y: 0 },
//  gameRunning: false,
//  statusBarText: "",
//  startButtonText: ""
//}

// make a inittialise function that sets up the gamestate
// player one starts top left
// player two starts bottom right
// apple is randomly placed
function initialiseGame(x) {
  gamestate.player1.location = { x: 1, y: 1 };
  gamestate.player1.direction = { x: 1, y: 0 };
  gamestate.player1.score = 0;
  gamestate.player2.location = { x: cols - 2, y: rows - 2 };
  gamestate.player2.direction = { x: -1, y: 0 };
  gamestate.player2.score = 0;
  gamestate.apple = generateAppleLocation();
  gamestate.gameRunning = false;
  gamestate.statusBarText = x;
  gamestate.startButtonText = "Start Game";
}

socket.addEventListener('open', () => {
  console.log('Connected to server');

});

socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  //console.log('Message from server:', data);

  switch (data.type) {
    case 'update_game_state':
      const oldGamestate = { ...gamestate };
      gamestate = data.gameState;
      renderGame(oldGamestate, gamestate);
      updatePageObjects(oldGamestate, gamestate);
      break;

    case 'game_full':
      // create a modal that tells the player the game is full
      alert('Game is full');
      // redirect the player to the home page
      window.location.href = '/';
      break;

    // Handle other message types as needed
  }
});

socket.addEventListener('close', () => {
  console.log('Disconnected from server');
  // if either player 1 or 2 disconnects reset the game, if anyone else disconnects do nothing
  if (gamestate.player1.id === currentPlayerId || gamestate.player2.id === currentPlayerId) {
    resetGame();
    // If player1 left, make player2 the new player1
    if (gamestate.player1.id === currentPlayerId && gamestate.player2.id) {
      gamestate.player1.id = gamestate.player2.id;
      gamestate.player2.id = null;
    }
  }
});

// helper funtions
function sendMessage(message) {
  console.log('Sending message:', message); // Debug log
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('Cannot send message, WebSocket is not open');
  }
}



function getRoomId() {
  const url = window.location.href;
  return url.substring(url.lastIndexOf('/') + 1);
}

function updateStatusBar() {
  const status = document.getElementById('status');
  status.textContent = gamestate.statusBarText;
  sendMessage({ type: 'update_game_state', gameState: gamestate });
}

function updateScores() {
  const player1Score = document.getElementById('player1-score').querySelector('.score-text');
  const player2Score = document.getElementById('player2-score').querySelector('.score-text');
  player1Score.textContent = gamestate.player1.score;
  player2Score.textContent = gamestate.player2.score;
  sendMessage({ type: 'update_game_state', gameState: gamestate });
}

function UpdateStartButton() {
  const startButton = document.getElementById('start-btn');
  startButton.textContent = gamestate.startButtonText;
  startButton.removeEventListener('click', handleStartButtonClick);
  startButton.addEventListener('click', handleStartButtonClick);
  sendMessage({ type: 'update_game_state', gameState: gamestate });
}

function handleStartButtonClick() {
  if (gamestate.startButtonText === 'Start Game') {
    gamestate.gameRunning = true;
    gamestate.startButtonText = 'Pause Game';
  } else {
    gamestate.gameRunning = false;
    gamestate.startButtonText = 'Resume Game';
  }
  sendMessage({ type: 'update_game_state', gameState: gamestate });
}

function generateAppleLocation() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function resetGame() {
  initialiseGame('Game Reset, Press start to play again');
}

function updatePlayersList() {
  //<ul id="player-list"></ul>
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  if (gamestate.player1.id) {
    const player1 = document.createElement('li');
    player1.textContent = gamestate.player1.id;
    playerList.appendChild(player1);
  }
  if (gamestate.player2.id) {
    const player2 = document.createElement('li');
    player2.textContent = gamestate.player2.id;
    playerList.appendChild(player2);
  }
}

function renderGame(oldGamestate, newGamestate) {
  if (JSON.stringify(oldGamestate) !== JSON.stringify(newGamestate)) {
    renderGameState();
  }
}

function updatePageObjects(oldGamestate, newGamestate) {
  if (JSON.stringify(oldGamestate) !== JSON.stringify(newGamestate)) {
    updateStatusBar();
    updateScores();
    UpdateStartButton();
    updatePlayersList();
  }
}

function renderGameState() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the players
  ctx.fillStyle = playerColors[0];
  ctx.fillRect(gamestate.player1.location.x * size, gamestate.player1.location.y * size, size, size);

  ctx.fillStyle = playerColors[1];
  ctx.fillRect(gamestate.player2.location.x * size, gamestate.player2.location.y * size, size, size);

  // Draw the apple
  ctx.fillStyle = 'red';
  ctx.fillRect(gamestate.apple.x * size, gamestate.apple.y * size, size, size);
}



// make a function that handles arrow key inputs and swipe inputs on the canvas to change the direction of the player 
// for now we are just going to let teh player move one block per key press or swipe adn the snake will not grow once it eats teh apple
// the player cannot go out of bounds or go on to the block the other player is on
document.addEventListener('keydown', event => {
  if (gamestate.gameRunning) {
    // use current player id to determine which player is moving
    if (gamestate.player1.id === currentPlayerId) {
      switch (event.key) {
        case 'ArrowUp':
          gamestate.player1.direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          gamestate.player1.direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          gamestate.player1.direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          gamestate.player1.direction = { x: 1, y: 0 };
          break;
      }
    } else if (gamestate.player2.id === currentPlayerId) {
      switch (event.key) {
        case 'w':
          gamestate.player2.direction = { x: 0, y: -1 };
          break;
        case 's':
          gamestate.player2.direction = { x: 0, y: 1 };
          break;
        case 'a':
          gamestate.player2.direction = { x: -1, y: 0 };
          break;
        case 'd':
          gamestate.player2.direction = { x: 1, y: 0 };
          break;
      }
    }
  }
  
});

// Game loop
let previousGameState = null;
function gameLoop() {
  // Compare the current game state with the previous one
  if (JSON.stringify(gamestate) !== JSON.stringify(previousGameState)) {
    // If the game state has changed, send it to the server
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'update_game_state',
        gameState: gamestate
      }));
      // Update the previous game state
      previousGameState = JSON.parse(JSON.stringify(gamestate));
    } else {
      console.log('Waiting for WebSocket to open...');
    }
  }
  requestAnimationFrame(gameLoop);
}

// Start the game
initialiseGame('Waiting for more players to join...');
renderGameState();
requestAnimationFrame(gameLoop);