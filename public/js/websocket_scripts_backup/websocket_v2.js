const WebSocket = require("ws");

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  let rooms = {};

  wss.on("connection", (ws) => {
    let currentRoom = null;

    ws.on("message", (message) => {
      let data = JSON.parse(message);
      //console.log("Received message:", data);
      if (!data.type) {
        console.error("Received message without type:", data);
        return;
      }
      switch (data.type) {
        // SNAKE GAME CASES START HERE //
        case "new_player":
          currentRoom = data.roomId;
          //console.log("New client connected to room:", currentRoom);
          if (!rooms[currentRoom]) {
            rooms[currentRoom] = {
              clients: [],
              gamestate: data.gameState,
            };
          }
          if (rooms[currentRoom].gamestate.player1.id === null) {
            ws.playerId = generatePlayerId();
            rooms[currentRoom].gamestate.player1.id = ws.playerId;
            rooms[currentRoom].gamestate.statusBarText =
              "Waiting for player 2...";
            console.log("Player 1 connected to room:", currentRoom);
            // send current player id to client
            ws.send(
              JSON.stringify({ type: "player_id", playerId: ws.playerId })
            );
          } else if (rooms[currentRoom].gamestate.player2.id === null) {
            ws.playerId = generatePlayerId();
            rooms[currentRoom].gamestate.player2.id = ws.playerId;
            rooms[currentRoom].gamestate.statusBarText = "Press start to begin";
            console.log("Player 2 connected to room:", currentRoom);
            // send current player id to client
            ws.send(
              JSON.stringify({ type: "player_id", playerId: ws.playerId })
            );
          } else {
            ws.playerId = null;
            // tell client that game is full
            ws.send(JSON.stringify({ type: "game_full" }));

            // disconnect client
            ws.close();
          }
          // add new client to clients array
          rooms[currentRoom].clients.push(ws);
          // send gamestate to all clients in the current room
          broadcastGameState(currentRoom);
          break;

        case "cast_game_state":
          rooms[currentRoom].gamestate = data.gameState;
          broadcastGameState(currentRoom);
          break;

        // SNAKE GAME CASES END HERE //

        // Handle other message types as needed
      }
    });

    ws.on("close", () => {
      // SNAKE GAME CODE START HERE //
      //console.log("Connection closed in room:", currentRoom);
      if (currentRoom && rooms[currentRoom]) {
        rooms[currentRoom].clients = rooms[currentRoom].clients.filter(
          (client) => client !== ws
        );
        rooms[currentRoom].clients = rooms[currentRoom].clients.filter(
          (client) => client !== ws
        );
        if (ws.playerId === rooms[currentRoom].gamestate.player1.id) {
          rooms[currentRoom].gamestate.player1.id =
            rooms[currentRoom].gamestate.player2.id;
          rooms[currentRoom].gamestate.player2.id = null;
          console.log("Player 1 left in room:", currentRoom);
          castPlayerLeft(currentRoom);
        } else if (ws.playerId === rooms[currentRoom].gamestate.player2.id) {
          rooms[currentRoom].gamestate.player2.id = null;
          console.log("Player 2 left in room:", currentRoom);
          castPlayerLeft(currentRoom);
        }
      }
      // SNAKE GAME CODE END HERE //
    });
  });

  // SNAKE GAME FUNCTIONS START HERE //
  function castPlayerLeft(room) {
    const message = JSON.stringify({
      type: "player_left",
      gameState: rooms[room].gamestate,
    });

    rooms[room].clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  function broadcastGameState(room) {
    const message = JSON.stringify({
      type: "update_game_state",
      gameState: rooms[room].gamestate,
    });

    rooms[room].clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  function generatePlayerId() {
    let playerId;
    do {
      playerId = "player_" + Math.random().toString(36).substr(2, 9);
    } while (
      Object.values(rooms).some(
        (room) =>
          room.gamestate.player1.id === playerId ||
          room.gamestate.player2.id === playerId
      )
    );
    return playerId;
  }
  // SNAKE GAME FUNCTIONS END HERE //
}

module.exports = createWebSocketServer;
