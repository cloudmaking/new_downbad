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

app.get('/cloudcore', (req, res) => {
  res.render('cloudcore');
});

app.get('/gameception', (req, res) => {
  res.render('gameception');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
