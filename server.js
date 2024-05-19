const express = require('express');
const http = require('http');
const path = require('path');
const createWebSocketServer = require('./websocket');

const app = express();
const server = http.createServer(app);
createWebSocketServer(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/mp_snake', (req, res) => {
  res.render('mp_snake');
});

app.get('/ai_snake', (req, res) => {
  res.render('ai_snake'); 
});

app.get('/online_snake', (req, res) => {
  res.render('online_snake');
});

app.get('/online_snake/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const protocol = req.protocol;
  const host = req.get('host');
  res.render('game_room', { roomId, protocol, host });
});

app.get('/firefly', (req, res) => {
  res.render('firefly'); 
});

app.get('/pixel_art', (req, res) => {
  res.render('pixel_art'); 
});

app.get('/soundbox', function(req, res) {
  res.render('soundbox');
});

app.get('/soundboard', function(req, res) {
  res.render('soundboard');
});

app.get('/asmaulhusna', function(req, res) {
  res.render('asmaulhusna');
});

app.get('/lost-planets', function(req, res) {
  res.render('planet_gen');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
