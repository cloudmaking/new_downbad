var gameBox = document.getElementById('game-box');
var scoreDisplay = document.getElementById('score-display');
var queueDisplay = document.getElementById('queue-display');
var joinForm = document.getElementById('join-form');
var nameInput = document.getElementById('name-input');
var joinButton = document.getElementById('join-button');

// Create a WebSocket connection to the server
var ws = new WebSocket('ws://localhost:8081');

// Handle incoming messages
ws.onmessage = function(event) {
  console.log('Received:', event.data);
};

// Handle errors
ws.onerror = function(error) {
  console.log('WebSocket error:', error);
};

// Handle the join button click
joinButton.addEventListener('click', function() {
  var name = nameInput.value;

  // Send a join message to the server
  ws.send(JSON.stringify({
    type: 'join',
    data: { name: name },
  }));
});

// TODO: Implement the game logic
