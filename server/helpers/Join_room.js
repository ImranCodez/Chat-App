const joinRoom = (socket) => {
  socket.on("join_room", (convoId) => {socket.join(convoId);});
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