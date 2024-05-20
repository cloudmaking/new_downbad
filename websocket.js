const WebSocket = require('ws');

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  let rooms = {};

  wss.on('connection', (ws) => {
    let currentRoom = null;

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      console.log('Message from client:', data);

      switch (data.type) {
        case 'new_player':
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
          if (currentRoom && ws.id) {
            rooms[currentRoom] = rooms[currentRoom].filter(player => player.id !== ws.id);
            // Reassign player numbers
            rooms[currentRoom].forEach((player, index) => {
              player.playerNumber = index + 1;
            });
            broadcastPlayerList(currentRoom);
          }
          break;

        // Add more cases as needed
      }
    });

    ws.on('close', () => {
      if (currentRoom && ws.id) {
        rooms[currentRoom] = rooms[currentRoom].filter(player => player.id !== ws.id);
        // Reassign player numbers
        rooms[currentRoom].forEach((player, index) => {
          player.playerNumber = index + 1;
        });
        broadcastPlayerList(currentRoom);
      }
    });
  });

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

  function broadcastGameStart(roomId) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'start_game' }));
      });
    }
  }

  function broadcastGamePause(roomId) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'pause_game' }));
      });
    }
  }

  function broadcastScoreUpdate(roomId, player, score) {
    const room = rooms[roomId];
    if (room) {
      room.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'score_update', player, score }));
      });
    }
  }
}

module.exports = createWebSocketServer;
