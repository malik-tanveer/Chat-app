import express from 'express';
import { Message, User } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all messages
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'email']
      }],
      order: [['createdAt', 'ASC']]
    });

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      username: msg.sender?.username || msg.senderUsername,
      senderUsername: msg.sender?.username || msg.senderUsername,
      timestamp: new Date(msg.createdAt).toLocaleTimeString(),
      room: msg.room,
      createdAt: msg.createdAt
    }));

    res.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load messages'
    });
  }
});

export default router;