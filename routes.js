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
      response[index].participants += 1;
    }
  }

  res.json({
    channels: response,
  });
});

/**
 * @description This route retirves the channel messages
 */
router.get('/getMessages/:user/:channel', async (req, res) => {
  const { channel, user } = req.params;

  const messageIds = await redisClient.xrange(`channel:${channel}`, '-', '+');

  // Create promise chain to retreive all messages by messageId
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

  // Extract last message of the current channel
  const lastChannelMessage = allMessages[allMessages.length - 1];

  // Retrieve user last seen message from redis
  const userData = await redisClient.hgetall(`user:${user}`);

  // Match last seen message with allMessages array
  const lastMessageIndex = allMessages.findIndex((msg) => msg.id === userData[`lastMessageId:${channel}`]);

  // If the last seen message is not the last message of channel then push 'new messages' message
  if (lastMessageIndex > -1 && lastMessageIndex !== allMessages.length - 1) {
    allMessages.splice(lastMessageIndex + 1, 0, { message: '--- New Messages ---' });
  }

  // Store last message Id in user redis object
  await redisClient.hset(`user:${user}`, { [`lastMessageId:${channel}`]: lastChannelMessage.id, channel });

  res.json({ messages: allMessages });
});

/**
 * @description This route is used for search functionality
 */
router.get('/search', async (req, res) => {
  const { query } = req.query;

  const response = await redisClient.call('FT.SEARCH', 'idx:messages', `@message:${query}`, 'LIMIT', '0', '999999');

  console.log('/search', response);

  //

  res.json({ user: 'asdf' });
});

/**
 * @description This route add username to redis
 */
router.post('/add-user', async (req, res) => {
  const { username } = req.body;

  // Add a new user
  const user = {
    username,
  };
  await redisClient.sadd('usernames', username);
  await redisClient.hset(`user:${username}`, user);

  res.json({ user });
});

module.exports = router;
