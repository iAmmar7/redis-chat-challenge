const express = require("express");
const redisClient = require("./redis");

const router = express.Router();

/**
 * @description This route retirves the static channels
 */
router.get("/getChannels", async (req, res) => {
  const channels = await redisClient.smembers("channels");

  const response = channels.map((item, index) => ({
    name: item,
    participants: 0,
    id: index + 1,
    sockets: [],
  }));

  res.json({
    channels: response,
  });
});

/**
 * @description This route retirves the channel messages
 */
router.get("/getMessages/:channel", async (req, res) => {
  const { channel } = req.params;

  const messageIds = await redisClient.xrange(`channel:${channel}`, "-", "+");

  const messageRequests = [];
  for (let msg of messageIds) {
    messageRequests.push(await redisClient.hgetall(`message:${msg[0]}`));
  }
  const messages = await Promise.all(messageRequests);

  const allMessages = messages.map((item, index) => ({
    ...item,
    timestamp: new Date(parseInt(messageIds[index][0])),
    id: messageIds[index][0],
  }));

  // TODO:
  // Send username from frontend
  // Store message id in allMessage

  // Retreive user's last seen message of this channel
  // Match last seen id with allMessages array
  // Add { message: `new message`, type: 'zxy' }

  // Store last message Id in user table

  res.json({ messages: allMessages });
});

/**
 * @description This route is used for search functionality
 */
router.get("/search", async (req, res) => {
  const { query, channel } = req.query;

  console.log(channel);

  const response = await redisClient.call(
    "FT.SEARCH",
    "idx:messages",
    `@message:${query} @channel:{${channel}}`,
    "LIMIT",
    "0",
    "999999"
  );

  res.json({ response });
});

/**
 * @description This route add username to redis
 */
router.post("/add-user", async (req, res) => {
  const { username } = req.body;

  const user = await redisClient.sadd("usernames", username);

  res.json({ user });
});

module.exports = router;
