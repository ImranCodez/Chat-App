require("dotenv").config();
const express = require("express");
const route = require("./routes");
const cors = require("cors");
const joinRoom = require("./helpers/Join_room");
const dbcongfig = require("./dbconfig");
const cookieParser = require("cookie-parser");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin:process.env.CLIENT_URL,
    credentials: true,
  },
});

global.io = io;

dbcongfig();

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// Socket

io.on("connection", (socket) => {
  joinRoom(socket);

  socket.on("typing", ({ conversationId }) => {
    if (!conversationId) return;
    socket.to(conversationId).emit("typing", { conversationId });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    if (!conversationId) return;
    socket.to(conversationId).emit("stop_typing", { conversationId });
  });
});

// Routes
app.use(route);

// DNS
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Server
httpServer.listen(8000, () => {
  console.log("Server is running on port ");
});
