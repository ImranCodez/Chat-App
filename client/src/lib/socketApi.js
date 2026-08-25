import io from "socket.io-client";

let socket;

const initsocket = () => {
  if (socket) return socket;

  socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("new_message", (res) => {
    console.log("📩 New message:", res);
  });

  socket.on("connect_error", (error) => {
    console.log("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return socket;
};

export { initsocket };
