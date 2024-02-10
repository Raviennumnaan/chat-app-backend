import { Server } from 'socket.io';
import app from './app.mjs';
import { createServer } from 'http';

process.on('uncaughtException', err => {
  console.log('UNHANDLED EXCEPTION: ❌ Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://snappy-chat-app-ravi.netlify.app/',
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = socketId => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = userId => {
  return users.find(user => user.userId === userId);
};

io.on('connection', socket => {
  console.log('A user Connected');

  // When Connected
  socket.on('addUser', userId => {
    addUser(userId, socket.id);
  });

  socket.on('sendMessage', ({ userId, receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (!receiver) return;
    io.to(receiver.socketId).emit('getMessage', data);
  });

  // When Disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    removeUser(socket.id);
  });
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: ❌ Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
