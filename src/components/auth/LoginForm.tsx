import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [taigaUrl, setTaigaUrl] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ username, password, taigaUrl });
      navigate('/');
    } catch {
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card border-surface-700 shadow-custom-lg">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl mb-4">
              <div className="bg-surface-900 p-2 rounded-lg">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">T</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Taiga Dashboard
            </h1>
            <p className="text-surface-400">Sign in to access your Taiga projects</p>
          </div>

          {error && (
            <Alert 
              variant="error" 
              message={error} 
              className="mb-6" 
              onClose={clearError}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="taigaUrl" className="block text-sm font-medium text-surface-300 mb-1">
                  Taiga URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-surface-400" />
                  </div>
                  <input
                    id="taigaUrl"
                    type="url"
                    placeholder="https://taiga.yourdomain.com"
                    value={taigaUrl}
                    onChange={(e) => setTaigaUrl(e.target.value)}
                    required
                    className="input pl-10 w-full"
                  />
                </div>
                <p className="text-xs text-surface-400 mt-1">
                  Enter the URL of your Taiga instance
                </p>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-surface-300 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <LogIn size={18} className="mr-2" />
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;