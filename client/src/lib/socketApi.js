import io from "socket.io-client";
import { store } from "../store";
import { apiSlice } from "./api";

let socket;

const initsocket = () => {
  if (socket) return socket;

  socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("new_message", (message) => {
    console.log("📩 New message:", message);

    const conversationId = String(message?.conversation);

    if (!conversationId) return;

    store.dispatch(
      apiSlice.util.updateQueryData("getMessages",conversationId,
        (cache) => {
          if (!cache?.data) return;
       console.log(cache?.data)
          const alreadyExists = cache.data.some(
            (item) => String(item._id) === String(message._id)
          );

          if (!alreadyExists) {
            cache.data.push(message);
          }
        }
      )
    );
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