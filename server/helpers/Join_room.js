const { findUserConversation } = require("./conversationAccess");

const joinRoom = (socket) => {
  socket.on("join_room", async (convoId) => {
    if (!convoId || !socket.data.userId) return;
    const conversation = await findUserConversation(
      convoId,
      socket.data.userId,
    );
    if (conversation) socket.join(String(convoId));
  });
};

module.exports = joinRoom;

// Client
//   ↓
// conversation._id
//   ↓
// socket.emit("join_room", conversation._id)
//   ↓
// Server
//   ↓
// socket.on("join_room", (conversationId) => {})
//   ↓
// conversationId পাওয়া গেল
//   ↓
// socket.join(conversationId)
