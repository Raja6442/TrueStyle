import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, FileText } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchData = [
  { title: 'Home', path: '/', description: 'TrueStyle homepage' },
  { title: 'About Us', path: '/about', description: 'Learn about TrueStyle mission' },
  { title: 'Features', path: '/features', description: 'Explore our platform features' },
  { title: 'Pricing', path: '/pricing', description: 'View our subscription plans' },
  { title: 'Security Blog', path: '/blog', description: 'Read latest cybersecurity articles' },
  { title: 'Contact', path: '/contact', description: 'Get in touch with our team' },
  { title: 'Help Centre', path: '/help', description: 'Find support and FAQs' },
  { title: 'Verify Product', path: '/verify', description: 'Verify an authentic product' },
  { title: 'Dashboard', path: '/dashboard', description: 'Your personal dashboard' },
  { title: 'Login', path: '/login', description: 'Sign in to your account' },
  { title: 'Register', path: '/register', description: 'Create a new account' },
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchData);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle Mount/Unmount Animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      // Small timeout to allow render before adding visible class for transition
      setTimeout(() => {
        setIsVisible(true);
        inputRef.current?.focus();
      }, 10);
      setQuery('');
      setResults([]);
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
      // Wait for transition before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (results.length > 0) {
       navigate(results[0].path);
       onClose();
    }
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-[15vh] sm:pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Search Container */}
      <div 
        className={`relative w-full max-w-3xl z-10 transition-all duration-300 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-14 right-0 p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-white/10"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Input area */}
        <form 
          onSubmit={handleSearch}
          className="relative w-full flex items-center bg-card border border-border rounded-2xl shadow-2xl overflow-hidden glass-card focus-within:border-accent/50 focus-within:shadow-neon-blue transition-all"
        >
          <button type="submit" className="absolute left-6 text-accent hover:text-accent transition">
             <Search className="w-8 h-8" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full py-6 pl-20 pr-6 text-2xl bg-transparent text-foreground placeholder-gray-500 focus:outline-none focus:ring-0"
          />
        </form>

        {/* Results Area */}
        {query.trim() && (
          <div className="mt-4 bg-card border border-border rounded-xl shadow-xl overflow-hidden glass-card max-h-[50vh] overflow-y-auto">
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleResultClick(result.path)}
                      className="w-full flex items-center px-6 py-4 hover:bg-accent/20 transition-colors text-left group border-b border-border/50 last:border-0"
                    >
                      <div className="bg-accent/30 p-3 rounded-lg mr-4 group-hover:bg-accent/40 transition">
                        <FileText className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-medium text-foreground group-hover:text-accent transition">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted">
                          {result.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted font-medium">No results found for "{query}"</p>
                <p className="text-muted mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
