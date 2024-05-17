const express = require('express');
const app = express();
const path = require('path');
const { spawn } = require('child_process');

// Start the WebSocket server file is in public, js, game.js
const gameServer = spawn('node', ['public/js/game.js']); 

gameServer.stdout.on('data', (data) => {
  console.log(`gameServer stdout: ${data}`);
});

gameServer.stderr.on('data', (data) => {
  console.error(`gameServer stderr: ${data}`);
});

gameServer.on('close', (code) => {
  console.log(`gameServer process exited with code ${code}`);
});

// Add this line to set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use('/static', express.static(path.join(__dirname, 'cloudcore', 'static')));
app.use('/cloudcore', express.static(path.join(__dirname, 'cloudcore')));
app.use('/manifest.json', express.static(path.join(__dirname, 'cloudcore', 'manifest.json')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'cloudcore', 'favicon.ico')));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/mp_snake', (req, res) => {
  res.render('mp_snake');
});

app.get('/ai_snake', (req, res) => {
  res.render('ai_snake'); 
});

app.get('/firefly', (req, res) => {
  res.render('firefly'); 
});

app.get('/pixel_art', (req, res) => {
  res.render('pixel_art'); 
});

app.get('/cloudcore/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'cloudcore', 'index.html'));
});

app.get('/soundbox', function(req, res) {
  res.render('soundbox');
});

app.get('/soundboard', function(req, res) {
  res.render('soundboard');
});

app.get('/snake-game', (req, res) => {
  res.render('snake-game');
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
