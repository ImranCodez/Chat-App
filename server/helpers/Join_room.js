const joinRoom = (socket) => {
  socket.on("join_room", (convoId) => {socket.join(convoId);});
};

module.exports = joinRoom;