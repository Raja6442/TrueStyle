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
  ChevronDown,
  Search
} from 'lucide-react';
import { SearchOverlay } from '../components/SearchOverlay';

export const Navbar: React.FC = () => {
  const { user, logout, preferences, updateUserPreferences } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const [themeState, setThemeState] = useState<'dark' | 'light'>(() => {
    return document.documentElement.classList.contains('light') ? 'light' : 'dark';
  });

  React.useEffect(() => {
    if (preferences?.theme) {
      setThemeState(preferences.theme);
    }
  }, [preferences?.theme]);

  const toggleTheme = () => {
    const nextTheme = themeState === 'dark' ? 'light' : 'dark';
    
    if (user) {
      updateUserPreferences({ theme: nextTheme });
    }
    
    setThemeState(nextTheme);
    localStorage.setItem('truestyle_theme', nextTheme);
    
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
    return location.pathname === path ? 'text-accent font-semibold' : 'text-muted hover:text-foreground transition';
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-accent p-2 rounded-lg group-hover:bg-accent transition shadow-neon-blue">
              <ShieldCheck className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground font-mono">
              TRUE<span className="text-accent">STYLE</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/about" className={isActive('/about')}>About</Link>
                <Link to="/features" className={isActive('/features')}>Features</Link>
                <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
                <Link to="/blog" className={isActive('/blog')}>Flash Bulletin</Link>
                <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              </>
            )}
          </div>

          {/* Right Area Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Toggle */}
            {user && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted hover:text-foreground rounded-full bg-card hover:bg-border transition"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-muted hover:text-foreground rounded-full bg-card hover:bg-border transition"
              title="Toggle theme"
            >
              {themeState === 'light' ? (
                <Moon className="w-4 h-4 text-accent" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg bg-card hover:bg-border border border-border transition text-left text-sm"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover border border-accent/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent text-foreground flex items-center justify-center font-bold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block leading-tight">
                    <div className="font-semibold text-foreground truncate max-w-[120px]">{user.full_name}</div>
                    <div className="text-[10px] text-muted capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg glass-card ring-1 ring-black ring-opacity-5 divide-y divide-border z-20">
                      <div className="px-4 py-3">
                        <p className="text-xs text-muted">Signed in as</p>
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/60 text-accent border border-accent/30 capitalize">
                          {user.role} Account
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-muted hover:bg-accent/20 hover:text-foreground"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-accent" />
                          User Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-muted hover:bg-accent/20 hover:text-foreground font-mono"
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
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-semibold text-foreground bg-accent hover:bg-accent rounded-lg shadow-neon-blue transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-muted hover:text-foreground rounded-full bg-card hover:bg-border"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={toggleTheme} 
              className="p-1.5 text-muted hover:text-foreground rounded-full bg-card hover:bg-border"
            >
              {themeState === 'light' ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted hover:text-foreground rounded-md bg-card hover:bg-border border border-border transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pt-2 pb-4 space-y-2">
          {user && (
            <>
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                About
              </Link>
              <Link 
                to="/features" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                Pricing
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                Flash Bulletin
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
              >
                Contact
              </Link>
            </>
          )}

          {user ? (
            <div className="pt-4 border-t border-border space-y-2">
              <div className="px-3 py-2 flex items-center space-x-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border border-accent/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent text-foreground flex items-center justify-center font-bold text-lg">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{user.full_name}</div>
                  <div className="text-xs text-muted truncate">{user.email}</div>
                </div>
              </div>
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-card"
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
            <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 border border-border text-sm font-semibold text-muted hover:text-foreground rounded-lg"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2 text-sm font-semibold text-foreground bg-accent hover:bg-accent rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};
