const redisClient = require('./redis');

const redisDemo = async () => {
  // Add a new user...
  const user = {
    username: 'demo',
    firstname: 'Demo',
    lastname: 'User',
    city: 'Demoville',
    country: 'Demoland',
  };

  await redisClient.sadd('usernames', user.username);
  await redisClient.hset('user:demo', user);
  console.log(`Created user:demo.`);
  const userInfo = await redisClient.hgetall('user:demo');
  console.log('Read user:demo from Redis:');
  console.log(userInfo);

  // Create a new chat message in 'tech', creating that channel if necessary and adding its
  // name to the global "channels" set.
  await redisClient.sadd('channels', 'tech');
  const messageId = await redisClient.xadd('channel:tech', '*', 'type', 'message');
  const message = {
    channel: 'tech',
    username: 'demo',
    message: 'Hello, glad to be here!',
  };

  await redisClient.hset(`message:${messageId}`, message);

  console.log(`Added message:${messageId}`);

  redisClient.quit();
};

redisDemo();
