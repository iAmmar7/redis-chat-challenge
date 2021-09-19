const express = require('express');
const redisClient = require('./redis');

const router = express.Router();

/**
 * @description This route retirves the static channels
 */
router.get('/getChannels', async (req, res) => {
  const channels = await redisClient.smembers('channels');

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
router.get('/getMessages/:channel', async (req, res) => {
  const { channel } = req.params;

  const messageIds = await redisClient.xrange(`channel:${channel}`, '-', '+');

  const messageRequests = [];
  for (let msg of messageIds) {
    messageRequests.push(await redisClient.hgetall(`message:${msg[0]}`));
  }
  const messages = await Promise.all(messageRequests);

  const allMessages = messages.map((item, index) => ({ ...item, timestamp: new Date(parseInt(messageIds[index][0])) }));

  res.json({ messages: allMessages });
});

/**
 * @description This route add username to redis
 */
router.post('/add-user', async (req, res) => {
  const { username } = req.body;

  const user = await redisClient.sadd('usernames', username);

  res.json({ user });
});

module.exports = router;
