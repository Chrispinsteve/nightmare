import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav className="bg-dark-lighter border-b border-neon-pink/20 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold gradient-text tracking-wider"
            >
              NIGHTMARE
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/clubs" className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30">
              Clubs
            </Link>
            <Link to="/events" className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30">
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30">
                  Profile
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="neon-button text-sm font-medium"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30">
                  Login
                </Link>
                <Link to="/signup" className="neon-button text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white p-2 hover:bg-neon-pink/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden py-4 border-t border-neon-pink/20"
            >
              <motion.div variants={itemVariants} className="flex flex-col space-y-4">
                <Link
                  to="/clubs"
                  className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clubs
                </Link>
                <Link
                  to="/events"
                  className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="neon-button w-full text-sm font-medium"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link
                to="/login"
                      className="text-gray-200 hover:text-white font-semibold text-base tracking-wide transition-all duration-300 px-4 py-2 rounded-lg hover:bg-neon-pink/20 hover:border hover:border-neon-pink/30"
                      onClick={() => setIsMenuOpen(false)}
              >
                Login
                    </Link>
                    <Link
                      to="/signup"
                      className="neon-button w-full text-center text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 