const socket = require('socket.io');

const redisClient = require('./redis');

const redisData = [];

module.exports = (http) => {
  const io = socket(http);

  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // User joins a random channel
    socket.on('join-random', async ({ username, channel }) => {
      redisData.push({ socketId: socket.id, username, channel });

      socket.join(channel);

      // Change channel in user redis object
      await redisClient.hset(`user:${username}`, { channel });

      if (channel === 'random') {
        // Welcome current user
        socket.emit('server-message', { message: `Welcome to the RedisChat!` });
        // Broadcast when a user connects
        socket.broadcast.to(channel).emit('server-message', {
          message: `${username} has joined the RedisChat`,
        });
      }
    });

    // Change a channel
    socket.on('change-channel', async ({ username, channel }) => {
      socket.join(channel);

      // Change user channel in local redis state
      const userIndex = redisData.findIndex(({ socketId }) => socketId === socket.id);
      if (userIndex > -1) redisData[userIndex].channel = channel;

      // Change channel in user redis object
      await redisClient.hset(`user:${username}`, { channel });

      // Update channel object for frontend
      const channels = await redisClient.smembers('channels');

      const response = channels.map((item, index) => ({
        name: item,
        participants: 0,
        id: index + 1,
      }));

      const usernames = await redisClient.smembers('usernames');

      let userRequests = [];
      for (let user of usernames) {
        userRequests.push(await redisClient.hgetall(`user:${user}`));
      }
      const users = await Promise.all(userRequests);

      for (let item of users) {
        if (item?.channel) {
          const index = response.findIndex((chan) => chan.name === item.channel);
          if (index > -1) response[index].participants += 1;
          else response[index] = { participants: 1 };
        }
      }

      io.emit('get-channels', response);
    });

    // Add a channel
    socket.on('add-channel', async ({ newChannel }) => {
      await redisClient.sadd('channels', newChannel);

      const channels = await redisClient.smembers('channels');

      const response = channels.map((item, index) => ({
        name: item,
        participants: 0,
        id: index + 1,
      }));

      io.emit('get-channels', response);
    });

    // Chat message send
    socket.on('send-message', async (data) => {
      const { channel, username, message } = data;
      const messageId = await redisClient.xadd(`channel:${channel}`, '*', 'type', 'message');
      const newMessage = {
        channel,
        username,
        message,
      };
      // Save new message
      await redisClient.hset(`message:${messageId}`, newMessage);

      // io.emit(`message:${channel}`, {
      io.to(channel).emit(`message`, {
        ...newMessage,
        timestamp: new Date(parseInt(messageId)),
        id: messageId,
      });

      // Emit for a new message blink
      // io.emit('channel-blink', { channel });
      socket.broadcast.emit('channel-blink', { channel });
    });

    // Cleanup when client disconnects
    socket.on('disconnect', async () => {
      console.log('Client disconnected', socket.id);

      const user = redisData.find(({ socketId }) => socketId === socket.id);

      // Remove user from local redis state
      const userIndex = redisData.findIndex(({ socketId }) => socketId === socket.id);
      redisData.splice(userIndex, 1);

      if (user) {
        // Remove user from the channel
        await redisClient.hset(`user:${user.username}`, { channel: null });

        // Emit the leave message
        io.to(user.channel).emit('server-message', {
          message: `${user.username} has left the chat`,
        });
      }
    });
  });
};
