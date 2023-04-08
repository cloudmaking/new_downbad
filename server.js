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

app.get('/mp_snake', (req, res) => {
  res.render('mp_snake');
});

app.get('/ai_snake', (req, res) => {
  res.render('ai_snake'); 
});

app.get('/gpt_guide', (req, res) => {
  res.render('gpt_guide'); 
});

app.get('/daw_checklist', (req, res) => {
  res.render('daw_checklist');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


// Current directory structure
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