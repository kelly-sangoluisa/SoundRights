const express = require('express');
const ChatService = require('../Business/ChatService.js');
const router = express.Router();

const chatService = new ChatService();

router.get('/history/:userA/:userB', async (req, res) => {
  const { userA, userB } = req.params;
  try {
    const messages = await chatService.getMessagesBetweenUsers(Number(userA), Number(userB));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;