const socket = require("socket.io");

const redisClient = require("./redis");

const redisData = [];

module.exports = (http) => {
  const io = socket(http);

  // socket.emit('connection', null);
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Send welcome message to user
    socket.on("join-channel", async ({ username, channel }) => {
      redisData.push({ socketId: socket.id, username, channel });

      socket.join(channel);

      // Welcome current user
      socket.emit("server-message", { message: `Welcome to the RedisChat!` });

      // Broadcast when a user connects
      socket.broadcast.to(channel).emit("server-message", {
        message: `${username} has joined the RedisChat`,
      });
    });

    socket.on("add-channel", async ({ newChannel }) => {
      await redisClient.sadd("channels", newChannel);

      const channels = await redisClient.smembers("channels");

      const response = channels.map((item, index) => ({
        name: item,
        participants: 0,
        id: index + 1,
        sockets: [],
      }));

      io.emit("get-channels", response);
    });

    // Chat message send
    socket.on("send-message", async (data) => {
      const { channel, username, message } = data;
      const messageId = await redisClient.xadd(
        `channel:${channel}`,
        "*",
        "type",
        "message"
      );
      const newMessage = {
        channel,
        username,
        message,
      };
      await redisClient.hset(`message:${messageId}`, newMessage);
      io.emit(`message:${channel}`, {
        ...newMessage,
        timestamp: new Date(parseInt(messageId)),
        id: messageId,
      });
    });

    // Cleanup when client disconnects
    socket.on("disconnect", () => {
      const user = redisData.find(({ socketId }) => socketId === socket.id);

      // Remove user from local redis state
      const userIndex = redisData.findIndex(
        ({ socketId }) => socketId === socket.id
      );
      redisData.splice(userIndex, 1);

      if (user) {
        io.to(user.channel).emit("server-message", {
          message: `${user.username} has left the chat`,
        });
      }
    });
  });
};
