function endUserSocketController(nio, socket) {
  nio.to('admin').emit('end user connection', `End user connected in room: ${socket.id}`);
  socket.on('disconnect', (socket) => {
      nio.to('admin').emit('end user disconnect', `End user disconnected due to ${socket}`);
  });
}

module.exports = endUserSocketController;