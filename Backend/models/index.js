import sequelize from '../config/database.js';
import User from './User.js';
import Message from './Message.js';

// Initialize all models
const models = {
  User,
  Message
};

// Create associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });

export { sequelize, User, Message };