import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // Load previous messages from API
  const loadPreviousMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Pehle previous messages load karo
      loadPreviousMessages();

      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      setSocket(newSocket);

      // User online mark karo
      newSocket.emit('user_online', user.id);

      // Online users update
      newSocket.on('online_users_update', (users) => {
        setOnlineUsers(users);
      });

      // New messages
      newSocket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  const sendMessage = (message, room = 'general') => {
    if (socket && user) {
      socket.emit('send_message', {
        message,
        senderId: user.id,
        username: user.username, // ✅ Username bhejo
        room
      });
    }
  };

  const value = {
    socket,
    onlineUsers,
    messages,
    sendMessage,
    setMessages,
    loadPreviousMessages
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};