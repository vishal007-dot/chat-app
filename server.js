const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: users[socket.id],
      text: msg,
      time: new Date().toLocaleTimeString()
    });
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running...");
});
