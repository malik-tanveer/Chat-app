import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, LogOut, Users, MessageCircle, Menu, X } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('general');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const { user, logout } = useAuth();
  const { onlineUsers, messages, sendMessage } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message, room);
      setMessage('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-discord-darker text-white">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-discord-blue rounded-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-80 bg-discord-dark flex flex-col lg:static fixed inset-y-0 left-0 z-40"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-discord-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-discord-blue" />
                  <h1 className="text-xl font-bold text-white">ChatApp</h1>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-discord-hover rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
              <div className="mt-4 text-sm text-discord-text">
                Welcome, <span className="text-white font-medium">{user.username}</span>
              </div>
            </div>

            {/* Online Users */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-4 text-discord-text">
                <Users size={18} />
                <span className="font-medium">Online Users ({onlineUsers.length})</span>
              </div>
              <div className="space-y-2">
                {onlineUsers.map((userId, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-discord-hover transition-colors"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm">User {userId}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="p-6 border-t border-discord-hover">
              <h3 className="text-discord-text font-medium mb-3">Rooms</h3>
              <div className="space-y-1">
                {['general', 'random', 'gaming', 'music'].map((roomName) => (
                  <button
                    key={roomName}
                    onClick={() => setRoom(roomName)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${room === roomName
                        ? 'bg-discord-blue text-white'
                        : 'text-discord-text hover:bg-discord-hover hover:text-white'
                      }`}
                  >
                    # {roomName}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-discord-light">
        {/* Chat Header */}
        <div className="p-6 border-b border-discord-hover bg-discord-light/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">#{room}</h2>
              <p className="text-sm text-discord-text mt-1">
                {onlineUsers.length} users online
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages
              .filter(msg => msg.room === room)
              .map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${msg.senderId === user.id ? 'message-own' : 'message-other'}`}>
                    {msg.senderId !== user.id && (
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {msg.senderUsername || msg.username} {/* ✅ Username show karo */}
                      </div>
                    )}
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSendMessage}
          className="p-6 border-t border-discord-hover bg-discord-light/50 backdrop-blur-sm"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${room}`}
              className="input-field flex-1 bg-discord-dark border-discord-hover text-white placeholder-discord-text focus:ring-discord-blue focus:border-discord-blue"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="p-3 bg-discord-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Chat;