const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('images'));

app.get('/', (req, res) => {
  //res.send('Hello from App Engine!');
  // point to the index.html file
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});