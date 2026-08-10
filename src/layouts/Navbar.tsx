import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Fingerprint, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, preferences, updateUserPreferences } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    if (!preferences) return;
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    updateUserPreferences({ theme: nextTheme });
    
    // Toggle class on document elements
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-cyber-blue-500 font-semibold' : 'text-gray-300 hover:text-white transition';
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0b0d]/80 backdrop-blur-md border-b border-cyber-dark-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-cyber-blue-700 p-2 rounded-lg group-hover:bg-cyber-blue-600 transition shadow-neon-blue">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white font-mono">
              TRUE<span className="text-cyber-blue-500">STYLE</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/features" className={isActive('/features')}>Features</Link>
            <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
            <Link to="/blog" className={isActive('/blog')}>Security Blog</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            
            {user && (
              <>
                <Link to="/verify" className="flex items-center space-x-1 px-3 py-1.5 rounded bg-cyber-blue-900/30 text-cyber-blue-400 hover:bg-cyber-blue-800/40 border border-cyber-blue-700/30 transition">
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-sm font-medium">Verify Product</span>
                </Link>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              </>
            )}
          </div>

          {/* Right Area Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-400 hover:text-white rounded-full bg-cyber-dark-card hover:bg-cyber-dark-border transition"
              title="Toggle theme"
            >
              {preferences?.theme === 'light' ? (
                <Moon className="w-4 h-4 text-cyber-blue-500" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg bg-cyber-dark-card hover:bg-cyber-dark-border border border-cyber-dark-border transition text-left text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-cyber-blue-800 text-white flex items-center justify-center font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <div className="font-semibold text-white truncate max-w-[120px]">{user.full_name}</div>
                    <div className="text-[10px] text-gray-400 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg glass-card ring-1 ring-black ring-opacity-5 divide-y divide-cyber-dark-border z-20">
                      <div className="px-4 py-3">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyber-blue-900/60 text-cyber-blue-400 border border-cyber-blue-700/30 capitalize">
                          {user.role} Account
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-cyber-blue-900/20 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-cyber-blue-500" />
                          User Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-cyber-blue-900/20 hover:text-white font-mono"
                          >
                            <ShieldAlert className="w-4 h-4 mr-2 text-red-500 animate-pulse" />
                            Admin Terminal
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-cyber-blue-700 hover:bg-cyber-blue-600 rounded-lg shadow-neon-blue transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 text-gray-400 hover:text-white rounded-full bg-cyber-dark-card hover:bg-cyber-dark-border"
            >
              {preferences?.theme === 'light' ? <Moon className="w-4 h-4 text-cyber-blue-500" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-md bg-cyber-dark-card hover:bg-cyber-dark-border border border-cyber-dark-border transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-cyber-dark-border bg-[#0a0b0d] px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            About
          </Link>
          <Link 
            to="/features" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            Pricing
          </Link>
          <Link 
            to="/blog" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            Security Blog
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-4 border-t border-cyber-dark-border space-y-2">
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-white">{user.full_name}</div>
                <div className="text-xs text-gray-400 truncate">{user.email}</div>
              </div>
              <Link 
                to="/verify" 
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-cyber-blue-900/40 text-cyber-blue-400 border border-cyber-blue-800/30"
              >
                <Fingerprint className="w-5 h-5" />
                <span>Verify Product</span>
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-cyber-dark-card"
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/20 font-mono"
                >
                  Admin Terminal
                </Link>
              )}
              <button 
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-cyber-dark-border grid grid-cols-2 gap-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 border border-cyber-dark-border text-sm font-semibold text-gray-300 hover:text-white rounded-lg"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 text-sm font-semibold text-white bg-cyber-blue-700 hover:bg-cyber-blue-600 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
