const socket = require('socket.io');

const redisClient = require('./redis');

const redisData = [];

module.exports = (http) => {
  const io = socket(http);

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Send welcome message to user
    socket.on('join-channel', async ({ username, channel }) => {
      redisData.push({ socketId: socket.id, username, channel });

      socket.join(channel);

      // Welcome current user
      socket.emit('server-message', { message: `Welcome to the RedisChat!` });

      // Broadcast when a user connects
      socket.broadcast.to(channel).emit('server-message', { message: `${username} has joined the RedisChat` });
    });

    socket.on('send-message', async (data) => {
      const { channel, username, message } = data;
      const messageId = await redisClient.xadd(`channel:${channel}`, '*', 'type', 'message');
      const newMessage = {
        channel,
        username,
        message,
      };
      await redisClient.hset(`message:${messageId}`, newMessage);
      io.emit(`message:${channel}`, { ...newMessage, timestamp: new Date(parseInt(messageId)) });
    });

    // Cleanup when client disconnects
    socket.on('disconnect', () => {
      const user = redisData.find(({ socketId }) => socketId === socket.id);

      if (user) {
        io.to(user.channel).emit('server-message', { message: `${user.username} has left the chat` });
      }
    });
  });
};
