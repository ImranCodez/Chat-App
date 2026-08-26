const joinRoom = (socket) => {
  socket.on("join_room", (convoId) => {
    socket.join(convoId);

    console.log(`Socket ${socket.id} joined room ${convoId}`);
  });
};

module.exports = joinRoom;