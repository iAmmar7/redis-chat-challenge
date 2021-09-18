const express = require('express');
const router = express.Router();

/**
 * @description This route retirves the static channels
 */
router.get('/getChannels', (req, res) => {
  res.json({
    channels: [
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
    ],
  });
});

module.exports = router;
