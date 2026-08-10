import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { dbRouter } from '../services/databaseRouter';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Simulate adding to newsletter registry
    const subscribers = JSON.parse(localStorage.getItem('truestyle_db_subscribers') || '[]');
    subscribers.push({ email, subscribed_at: new Date().toISOString() });
    localStorage.setItem('truestyle_db_subscribers', JSON.stringify(subscribers));

    await dbRouter.addLog({
      actor_id: 'guest',
      actor_name: 'Guest User',
      action: 'newsletter_subscribe',
      details: `Subscribed ${email} to weekly cybersecurity intelligence digest.`,
      ip_address: '127.0.0.1'
    });

    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#050608] border-t border-cyber-dark-border text-gray-400 py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-cyber-blue-700 p-1.5 rounded">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                TRUE<span className="text-cyber-blue-500">STYLE</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Cybersecurity-driven threat modeling and AI verification protocols designed to eradicate counterfeit commerce in high-value luxury products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Github className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-mono text-sm font-semibold mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-white transition">Verify Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Security Blog</Link></li>
            </ul>
          </div>

          {/* Legal / Resources */}
          <div>
            <h4 className="text-white font-mono text-sm font-semibold mb-4 tracking-wider uppercase">Resources & Privacy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Help Centre</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Report Vulnerability</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h4 className="text-white font-mono text-sm font-semibold tracking-wider uppercase">Cyber Intel Digest</h4>
            <p className="text-sm text-gray-500">
              Subscribe to receive updates on brand counterfeiting threats, scam domains, and digital commerce security warnings.
            </p>
            
            {subscribed ? (
              <div className="p-3 bg-cyber-blue-900/20 border border-cyber-blue-700/30 rounded text-xs text-cyber-blue-400">
                Email successfully registered for threat updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-cyber-dark-card border border-cyber-dark-border rounded-l-md text-white focus:outline-none focus:border-cyber-blue-500 focus:ring-1 focus:ring-cyber-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white rounded-r-md transition"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-cyber-dark-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
          <p>© 2026 TrueStyle Security Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>SHA-256 Verified Node</span>
            <span>TLS 1.3 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
