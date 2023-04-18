const express = require('express');
const app = express();
const path = require('path');

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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


// Current directory structure
// cloudcore
// node_modules
// public
// . css
// . . index.css
// . . snake.css
// . . styles.css
// . images
// . . 7.jpg
// . js
// . . ai_snake.js
// . . mp_snake.js
// views
// . ai_snake.ejs
// . index.ejs
// . mp_snake.ejs
// .gcloudignore
// .gitattributes
// app.yaml
// .package-lock.json
// .package.json
// .server.js