const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Set up EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define routes for various pages
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/mp_snake", (req, res) => {
  res.render("mp_snake");
});

app.get("/ai_snake", (req, res) => {
  res.render("ai_snake");
});

app.get("/online_snake", (req, res) => {
  res.render("online_snake");
});

app.get("/online_snake/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  res.render("game_room", { roomId });
});

app.get("/firefly", (req, res) => {
  res.render("firefly");
});

app.get("/pixel_art", (req, res) => {
  res.render("pixel_art");
});

app.get("/soundbox", (req, res) => {
  res.render("soundbox");
});

app.get("/soundboard", (req, res) => {
  res.render("soundboard");
});

app.get("/asmaulhusna", (req, res) => {
  res.render("asmaulhusna");
});

app.get("/lost-planets", (req, res) => {
  res.render("planet_gen");
});

app.get("/quickviz", (req, res) => {
  res.render("quickviz");
});

app.get("/pages_per_day", (req, res) => {
  res.render("pages_per_day");
});

app.get("/period_tracker", (req, res) => {
  res.render("period_tracker");
});

app.get("/copy_paster", (req, res) => {
  res.render("copy_paster");
});

app.get("/budget_cal", (req, res) => {
  res.render("budget_cal");
});

app.get("/adv_budget", (req, res) => {
  res.render("adv_budget");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}...`);
});
