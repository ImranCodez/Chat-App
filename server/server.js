require("dotenv").config();

const express = require("express");
const route = require("./routes");
const cors = require("cors");
const dbcongfig = require("./dbconfig");
const cookieParser = require("cookie-parser");

const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);

const io = require("socket.io")(httpServer);

global.io = io;

dbcongfig();

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

// Socket
io.on("connection", (socket) => {
  socket.on("join_room", (convoId) => {
    socket.join(convoId);
  });
});

// Routes
app.use(route);

// DNS
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Server
httpServer.listen(8000, () => {
  console.log("Server is running on port 8000");
});
