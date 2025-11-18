import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to chat after a delay
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Authentication Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Redirecting you to the chat...
        </p>
        
        <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto" />
      </motion.div>
    </div>
  );
};

export default AuthSuccess;