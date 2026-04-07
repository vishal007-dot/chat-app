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
    io.emit("users", Object.values(users));
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      user: users[socket.id],
      text: msg
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", users[socket.id] + " is typing...");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running...");
});
