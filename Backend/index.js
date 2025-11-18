import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport.js';
import messageRoutes from './routes/messages.js';
import { testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';
import { User, Message } from './models/index.js';

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware - Updated CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://accounts.google.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat Server is running!',
    database: 'SQLite3',
    googleOAuth: 'Enabled with real credentials'
  });
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('user_online', async (userId) => {
    onlineUsers.set(socket.id, userId);

    try {
      await User.update({ isOnline: true }, { where: { id: userId } });
      console.log(`🟢 User ${userId} is online`);

      io.emit('online_users_update', Array.from(onlineUsers.values()));
    } catch (error) {
      console.error('Online status update error:', error);
    }
  });

  socket.on('send_message', async (data) => {
    try {
      console.log('📨 New message:', data);
      
      const message = await Message.create({
        content: data.message,
        senderId: data.senderId,
        senderUsername: data.username,
        room: data.room || 'general'
      });

      console.log('✅ Message saved to database:', message.id);

      io.emit('receive_message', {
        id: message.id,
        content: message.content,
        senderId: data.senderId,
        username: data.username,
        senderUsername: data.username,
        timestamp: new Date().toLocaleTimeString(),
        room: data.room,
        createdAt: message.createdAt
      });
    } catch (error) {
      console.error('❌ Message save error:', error);
    }
  });

  socket.on('disconnect', async () => {
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      onlineUsers.delete(socket.id);

      try {
        await User.update({
          isOnline: false,
          lastSeen: new Date()
        }, { where: { id: userId } });

        console.log(`🔴 User ${userId} went offline`);
        io.emit('online_users_update', Array.from(onlineUsers.values()));
      } catch (error) {
        console.error('Offline status update error:', error);
      }
    }
    console.log('❌ User disconnected:', socket.id);
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 SQLite3 Chat Server running on port ${PORT}`);
    console.log(`📊 Database: SQLite3 (./data/database.sqlite)`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Google OAuth: Enabled with REAL credentials`);
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error);
});