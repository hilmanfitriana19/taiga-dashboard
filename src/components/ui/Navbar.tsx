import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-md border-b border-surface-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Taiga Dashboard
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-surface-300 hover:text-surface-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-surface-200">{user.fullName}</p>
                  <p className="text-surface-400 text-xs">{user.username}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-sm inline-flex items-center gap-1"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface-900 border-t border-surface-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {user && (
                <div className="flex items-center gap-2 p-2">
                  <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-surface-200">{user.fullName}</p>
                    <p className="text-surface-400 text-xs">{user.username}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 hover:bg-surface-800 rounded-md"
              >
                <LogOut size={18} className="text-surface-300" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;