require("dotenv").config();
const express = require("express");
const route = require("./routes");
const cors = require("cors");
const joinRoom = require("./helpers/Join_room");
const dbcongfig = require("./dbconfig");
const { verifyToken } = require("./helpers/token");
const cookieParser = require("cookie-parser");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);
const allowedOrigin = "https://chat-app-1-jma3.onrender.com";
const allowedOrigins = [
  ...(process.env.CLIENT_URL || "").split(","),
  "http://localhost:5173",
  allowedOrigin,
]
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .filter((origin, index, origins) => origins.indexOf(origin) === index);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

global.io = io;

io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || "";
  const accessToken = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];
  const decoded = accessToken && verifyToken(accessToken);

  if (!decoded?.id) return next(new Error("Unauthorized socket"));
  socket.data.userId = decoded.id;
  next();
});

// Middleware
app.use(cookieParser());

console.log("🔥 CORS ALLOWED ORIGINS:", allowedOrigins);
app.use(
  cors({
    // Credentials require an explicit origin; support both local development and production.
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

// Socket

io.on("connection", (socket) => {
  joinRoom(socket);

  socket.on("typing", ({ conversationId }) => {
    if (!conversationId || !socket.rooms.has(String(conversationId))) return;
    socket.to(conversationId).emit("typing", { conversationId });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    if (!conversationId || !socket.rooms.has(String(conversationId))) return;
    socket.to(conversationId).emit("stop_typing", { conversationId });
  });

  socket.on("call_started", ({ conversationId, type }) => {
    if (!conversationId || !type || !socket.rooms.has(String(conversationId)))
      return;
    socket.to(conversationId).emit("call_started", { conversationId, type });
  });

  socket.on("call_ended", ({ conversationId }) => {
    if (!conversationId || !socket.rooms.has(String(conversationId))) return;
    socket.to(conversationId).emit("call_ended", { conversationId });
  });
});

// Routes
app.use(route);

// DNS
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Server
const startServer = async () => {
  try {
    await dbcongfig();
    httpServer.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

startServer();
