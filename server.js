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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
