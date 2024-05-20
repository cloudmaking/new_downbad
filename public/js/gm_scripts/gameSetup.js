// gameSetup.js

let players = [];

function initGame() {
  // Code to initialize the game
}

function resetGame() {
  // Code to reset the game state
}

function addPlayer(playerId) {
  players.push(playerId);
  updatePlayerList();
  updateStatusBar();
}

function removePlayer(playerId) {
  players = players.filter(player => player !== playerId);
  updatePlayerList();
  updateStatusBar();
}

function updatePlayerList() {
  const playerListElement = document.getElementById('player-list');
  playerListElement.innerHTML = '';
  players.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `Player ${index + 1}: ${player}`;
    playerListElement.appendChild(li);
  });
}

function updateStatusBar() {
  const statusElement = document.getElementById('status');
  if (players.length < 2) {
    statusElement.textContent = 'Waiting for more players to join...';
  } else {
    statusElement.textContent = 'Game ready to start!';
  }
}
