const express = require('express');
const app = express();
const path = require('path');

// Add this line to set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/game', (req, res) => {
  res.render('game');
});

app.get('/game_v3', (req, res) => {
  res.render('game_v3'); // Render the game_v3.ejs file
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


// Current directory structure
// node_modules
// public
// . css
// . . game.css
// . . index.css
// . . styles.css
// . images
// . . wer.jpg
// . js
// . . game_v0.js
// . . game_v1.js
// . . game_v3.js
// views
// . game_v3.ejs
// . game.ejs
// . index.ejs
// .gcloudignore
// .gitattributes
// app.yaml
// .package-lock.json
// .package.json
// .server.js