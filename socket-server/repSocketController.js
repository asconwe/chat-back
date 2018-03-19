const { 
  ADMIN_CONNECTION, 
  END_USER_CONNECTION, 
  ADMIN_DISCONNECT, 
  END_USER_DISCONNECT, 
  CHAT_MESSAGE, 
  NOTIFICATION 
} = require('./event-constants');


function repSocketController(user, socket, nio) {
  console.log(`Rep ${user.firstName} ${user.lastName} connected`);
  socket.join('admin', () => {
    nio.to('admin').emit(ADMIN_CONNECTION, `Rep ${user.firstName} ${user.lastName} connected`);
  });
  socket.on('test message', (socket) => {
    nio.to('admin').emit(CHAT_MESSAGE, socket);
  });
}

module.exports = repSocketController;