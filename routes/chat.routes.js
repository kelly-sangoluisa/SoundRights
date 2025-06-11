const express = require('express');
const ChatService = require('../Business/ChatService.js');
const router = express.Router();
const chatService = new ChatService();
const LicenseService = require('../Business/LicenseService');

// Obtener o crear chat
router.post('/find-or-create', async (req, res) => {
  const { songId, userA, userB } = req.body;
  const chat = await chatService.getOrCreateChat(songId, userA, userB);
  res.json({ success: true, chat });
});

// Obtener bandeja de chats
router.get('/inbox/:userId', async (req, res) => {
  const chats = await chatService.getChatsForUser(Number(req.params.userId));
  res.json({ success: true, chats });
});

// Obtener mensajes de un chat
router.get('/:idChat/messages', async (req, res) => {
  const messages = await chatService.getMessagesByChatId(Number(req.params.idChat));
  res.json({ success: true, messages });
});

// Enviar mensaje en un chat
router.post('/:idChat/message', async (req, res) => {
  const { sender, receiver, content } = req.body;
  const message = await chatService.sendMessage(sender, receiver, Number(req.params.idChat), content);
  res.json({ success: true, message });
});

// En chat.routes.js
router.get('/info/:idChat', async (req, res) => {
  try {
    const chat = await chatService.getChatById(Number(req.params.idChat));
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat no encontrado' });
    }
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error interno', error: err.message });
  }
});

module.exports = router;