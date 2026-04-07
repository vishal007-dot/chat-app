const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};
let lastSeen = {};

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("status", username + " is online");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: users[socket.id],
      text: msg,
      time: new Date().toLocaleTimeString(),
      seen: false
    });
  });

  socket.on("seen", (user) => {
    io.emit("seen update", user);
  });

  socket.on("disconnect", () => {
    lastSeen[users[socket.id]] = new Date().toLocaleTimeString();

    io.emit("last seen", {
      user: users[socket.id],
      time: lastSeen[users[socket.id]]
    });

    delete users[socket.id];
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running...");
});
