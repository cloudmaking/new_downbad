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
  res.sendFile(path.join(__dirname, 'pages/cloudcore.html'));
});

// add a page for the gameception
app.get('/gameception', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/gameception.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// Current directory structure
// node_modules
// pages
// - cloudcore.html
// - game.html
// - gameception.html
// - index.html
// public
// - css
// - - cc_style.css
// - - game.css
// - - index.css
// - images
// - - wer.jpg
// - js
// - - game.js
// - .htaccess
// - navbar.html
// .gcloudignore
// .gitattributes
// app.yaml
// package-lock.json
// package.json
// server.js

