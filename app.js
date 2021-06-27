const socketio = require('socket.io');
console.log('server-start');
const io = socketio(5000, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

io.on('connection', (socket) => {
  console.log(`Connected to ${socket.id}`);

  socket.on('send-message', (message, room) => {
    if (!room) {
      socket.broadcast.emit('receive-message', {
        id: socket.id,
        message: message,
      });
    } else {
      socket
        .to(room)
        .emit('receive-message', { id: socket.id, message: message });
    }
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
});
