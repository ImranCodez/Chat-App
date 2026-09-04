import io from "socket.io-client";
import { store } from "../store";
import { apiSlice } from "./api";

let socket;

const initsocket = () => {
  if (socket) return socket;

  socket = io("https://chat-app-bmda.onrender.com");

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("new_message", (message) => {
    console.log("📩New message:", message);

    const conversationId = String(message?.conversation);

    if (!conversationId) return;

    store.dispatch(
      apiSlice.util.updateQueryData("getMessages", conversationId, (cache) => {
        if (!cache?.data) return;

        const alreadyExists = cache.data.some(
          (item) => String(item._id) === String(message._id),
        );

        if (!alreadyExists) {
          cache.data.push(message);
        }
      }),
    );

    store.dispatch(
      apiSlice.util.updateQueryData("getConversation", undefined, (cache) => {
        if (!cache?.data || !Array.isArray(cache.data)) return;

        const targetIndex = cache.data.findIndex(
          (item) => String(item._id) === conversationId,
        );

        if (targetIndex === -1) return;

        cache.data[targetIndex] = {
          ...cache.data[targetIndex],
          lastmessage: message.content,
          updatedAt: message.createdAt || new Date().toISOString(),
        };

        cache.data.sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime(),
        );
      }),
    );
  });

  socket.on(
    "message_deleted",
    ({ messageId, conversationId, lastmessage, message }) => {
      store.dispatch(
        apiSlice.util.updateQueryData(
          "getMessages",
          conversationId,
          (cache) => {
            if (!cache?.data) return;
            const target = cache.data.find(
              (item) => String(item._id) === String(messageId),
            );
            if (target && message) Object.assign(target, message);
          },
        ),
      );

      store.dispatch(
        apiSlice.util.updateQueryData("getConversation", undefined, (cache) => {
          const conversation = cache?.data?.find(
            (item) => String(item._id) === String(conversationId),
          );
          if (conversation) conversation.lastmessage = lastmessage;
        }),
      );
    },
  );
  socket.on("connect_error", (error) => {
    console.log("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return socket;
};

export { initsocket };
