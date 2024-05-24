const WebSocket = require('ws');

// websocket.js
// Import the WebSocket module

// Function to create a WebSocket server
function createWebSocketServer(server) {
  // Create a new WebSocket server instance using the provided server
  const wss = new WebSocket.Server({ server });

  // Object to store the rooms and their players
  let rooms = {};

  // Event listener for new connections
  wss.on('connection', (ws) => {
    let currentRoom = null;

    // Event listener for incoming messages
    ws.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch (error) {
        console.error('Error parsing message:', error);
        return;
      }

      console.log('Message from client:', data);

      // Handle different types of messages
      switch (data.type) {
        case 'new_player':
          // Add a new player to the room
          ws.id = data.playerId;
          currentRoom = data.roomId;
          if (!rooms[currentRoom]) {
            rooms[currentRoom] = [];
          }
          if (rooms[currentRoom].length >= 2) {
            // Redirect the player if the room already has 2 players
            ws.send(JSON.stringify({ type: 'redirect' }));
            ws.close();
          } else {
            rooms[currentRoom].push({ id: ws.id, ws, playerNumber: rooms[currentRoom].length + 1 });
            broadcastPlayerList(currentRoom);
          }
          break;

        case 'start_game':
          // Store the grid size
          rooms[currentRoom].gridSize = data.gridSize;
          // Generate a new apple's position
          rooms[currentRoom].apple = generateRandomPosition(rooms[currentRoom].gridSize);
          broadcastGameStart(currentRoom);
          broadcastApplePosition(currentRoom);
          break;

        case 'pause_game':
          broadcastGamePause(currentRoom);
          break;

        case 'reset':
          //use broadcastToRoom
          broadcastGameReset(currentRoom);
          break;

        case 'increment_score':
          broadcastScoreUpdate(currentRoom, data.player, data.score);
          break;

        case 'disconnect':
          handlePlayerDisconnect(ws, currentRoom, rooms);
          break;

        case 'update_direction_position':
          updatePlayerDirectionAndPosition(data.playerId, data.direction, data.position, currentRoom);
          break;

        case 'apple_position':
          rooms[currentRoom].apple = data.position;
          broadcastApplePosition(currentRoom);
          break;

        case 'apple_eaten':
          console.log('Received apple_eaten message from client', data);
          // Find the player who ate the apple
          
          // Broadcast the updated score
          broadcastScoreUpdate(currentRoom, data.player, data.score);
          // Generate a new apple's position
          rooms[currentRoom].apple = generateRandomPosition(rooms[currentRoom].gridSize);
          broadcastApplePosition(currentRoom);
          break;

        // Add more cases as needed
      }
    });

    // Event listener for connection close
    ws.on('close', () => {
      console.log('Connection closed');
      handlePlayerDisconnect(ws, currentRoom, rooms);
    });
  });

  function generateRandomPosition(gridSize) {
    return {
      x: Math.floor(Math.random() * gridSize.cols),
      y: Math.floor(Math.random() * gridSize.rows)
    };
  }

  function broadcastApplePosition(roomId) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'apple_position', position: room.apple }));
      });
    }
  }

  // Function to update a player's direction and position
  function updatePlayerDirectionAndPosition(playerId, direction, position, currentRoom) {
    //console.log('Updating player direction and position');
    const room = rooms[currentRoom];
    const player = room.find(player => player.id === playerId);
    if (player) {
      player.direction = direction;
      if (!player.snake) {
        player.snake = [];
      }
      player.snake[0] = position;
      if (room) {
        room.forEach(player => {
          //console.log('Sending update to player', player.id);
          player.ws.send(JSON.stringify({ type: 'update_direction_position', playerId, direction, position }));
        });
      }
    }
  }


  // Function to broadcast a message to all players in a room
  function broadcastToRoom(roomId, type, data) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        console.log('from server', JSON.stringify({ type, data }));
        player.ws.send(JSON.stringify({ type, ...data }));
      });
    }
  }

  function handlePlayerDisconnect(ws, currentRoom, rooms) {
    if (currentRoom && ws.id) {
      rooms[currentRoom] = rooms[currentRoom].filter(player => player.id !== ws.id);
      // Reassign player numbers
      rooms[currentRoom].forEach((player, index) => {
        player.playerNumber = index + 1;
      });

      if (rooms[currentRoom].length <= 1) {
        console.log('Resetting game becasue number of players is less than 2');
        broadcastPlayerList(currentRoom);
        broadcastGameReset(currentRoom);
      }
    }
  }

  // Function to broadcast the player list to all players in a room
  function broadcastPlayerList(roomId) {
    const room = rooms[roomId];
    if (room) {
      const playerList = room.map(player => ({ id: player.id, number: player.playerNumber }));
      console.log('Broadcasting player list:', playerList);
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'update_player_list', players: playerList }));
      });
    }
  }

  // Function to broadcast the game start message to all players in a room
  function broadcastGameStart(roomId) {
    broadcastToRoom(roomId, 'start_game');
  }

  // Function to broadcast the game pause message to all players in a room
  function broadcastGamePause(roomId) {
    broadcastToRoom(roomId, 'pause_game');
  }

  function broadcastGameReset(roomId) {
    broadcastToRoom(roomId, 'reset');
  }

  // Function to broadcast the score update message to all players in a room
  function broadcastScoreUpdate(roomId, player, score) {
    broadcastToRoom(roomId, 'score_update', { player, score });
  }
}

// Export the createWebSocketServer function
module.exports = createWebSocketServer;
