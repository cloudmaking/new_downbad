const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  //res.send('Hello from App Engine!');
  // point to the index.html file
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

// add a page for the game and link it to game.html
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/game.html'));
});

// add a page called cloudcore and link it to cloudcore.html which is in the cloudcore folder
app.get('/cloudcore', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/cloudcore/cloudcore.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});