const socket = require('socket.io');

const redisClient = require('./redis');

const STATIC_CHANNELS = [
  {
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: [],
  },
  {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: [],
  },
];

module.exports = (http) => {
  const io = socket(http);

  io.on('connection', (socket) => {
    // socket object may be used to send specific messages to the new connected client
    console.log('New client connected', socket.id);

    socket.on('join-channel', async ({ username }) => {
      // ToDo: only add unique username

      await redisClient.sadd('usernames', username);
    });

    // socket.emit('connection', null);

    // socket.on('channel-join', (id) => {
    //   console.log('channel join', id);
    //   STATIC_CHANNELS.forEach((c) => {
    //     if (c.id === id) {
    //       if (c.sockets.indexOf(socket.id) == -1) {
    //         c.sockets.push(socket.id);
    //         c.participants++;
    //         io.emit('channel', c);
    //       }
    //     } else {
    //       let index = c.sockets.indexOf(socket.id);
    //       if (index != -1) {
    //         c.sockets.splice(index, 1);
    //         c.participants--;
    //         io.emit('channel', c);
    //       }
    //     }
    //   });

    //   return id;
    // });

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

    // socket.on('disconnect', () => {
    //   STATIC_CHANNELS.forEach((c) => {
    //     let index = c.sockets.indexOf(socket.id);
    //     if (index != -1) {
    //       c.sockets.splice(index, 1);
    //       c.participants--;
    //       io.emit('channel', c);
    //     }
    //   });
    // });
  });
};
