import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800">
      <motion.div 
        className="absolute inset-0 -z-10 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-600 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-600 rounded-full filter blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-600 rounded-full filter blur-[100px]" />
      </motion.div>
      
      <LoginForm />
    </div>
  );
};

export default LoginPage;