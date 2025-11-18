import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import AuthSuccess from './pages/AuthSuccess';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={
                  <motion.div
                    key="login"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Login />
                  </motion.div>
                } />
                <Route path="/register" element={
                  <motion.div
                    key="register"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Register />
                  </motion.div>
                } />
                <Route path="/chat" element={
                  <motion.div
                    key="chat"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Chat />
                  </motion.div>
                } />
                <Route path="/auth/success" element={
                  <motion.div
                    key="auth-success"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AuthSuccess />
                  </motion.div>
                } />
                <Route path="/" element={<Navigate to="/chat" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 