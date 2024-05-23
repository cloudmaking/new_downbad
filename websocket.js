// Import the WebSocket module
const WebSocket = require('ws');

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
      const data = JSON.parse(message);
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
          broadcastGameStart(currentRoom);
          break;

        case 'pause_game':
          broadcastGamePause(currentRoom);
          break;

        case 'increment_score':
          broadcastScoreUpdate(currentRoom, data.player, data.score);
          break;

        case 'disconnect':
          handlePlayerDisconnect(ws, currentRoom, rooms);
          break;

        // Add more cases as needed
      }
    });

    // Event listener for connection close
    ws.on('close', () => {
      handlePlayerDisconnect(ws, currentRoom, rooms);
    });
  });

  function handlePlayerDisconnect(ws, currentRoom, rooms) {
    if (currentRoom && ws.id) {
      rooms[currentRoom] = rooms[currentRoom].filter(player => player.id !== ws.id);
      // Reassign player numbers
      rooms[currentRoom].forEach((player, index) => {
        player.playerNumber = index + 1;
      });
      broadcastPlayerList(currentRoom);
      broadcastGameReset(currentRoom);
    }
  }

  function broadcastGameReset(roomId) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'reset' }));
      });
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
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'start_game' }));
      });
    }
  }

  // Function to broadcast the game pause message to all players in a room
  function broadcastGamePause(roomId) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'pause_game' }));
      });
    }
  }

  // Function to broadcast the score update message to all players in a room
  function broadcastScoreUpdate(roomId, player, score) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'score_update', player, score }));
      });
    }
  }
}

// Export the createWebSocketServer function
module.exports = createWebSocketServer;
