import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Eye, EyeOff, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirection handled by useEffect, but double-check redirect path
        const origin = (location.state as any)?.from?.pathname || 
          (email.toLowerCase().includes('admin') ? '/admin' : '/');
        navigate(origin, { replace: true });
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message || 'Login encountered a security block.');
    } finally {
      setLoading(false);
    }
  };

  const prefillTest = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@truestyle.security');
      setPassword('AdminPassword123!');
    } else {
      setEmail('user@truestyle.security');
      setPassword('UserPassword123!');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <GlassCard className="p-8 border-accent/50 shadow-neon-blue">
        <div className="text-center mb-8">
          <div className="inline-flex bg-accent/20 p-2.5 rounded-xl border border-accent/30 text-accent mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-mono tracking-wide uppercase">Authenticate</h2>
          <p className="text-xs text-muted mt-1 font-mono">TrueStyle Secure Login Terminal</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/30 border border-red-900/30 rounded-lg flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Secure Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
              placeholder="e.g. user@truestyle.security"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Access Token (Password)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-3.5 pr-10 py-2.5 rounded-lg text-xs text-foreground"
                placeholder="Enter password credentials"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono">
            <label className="flex items-center text-muted select-none cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-cyber-dark-bg border-border text-accent focus:ring-cyber-blue-500 mr-1.5" />
              Keep Node Persistent
            </label>
            <Link to="/forgot-password" className="text-accent hover:text-foreground transition">
              Decrypt Token?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
          >
            {loading ? 'Decrypting Session...' : 'Authenticate Token'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted">
            Unauthorized node?{' '}
            <Link to="/register" className="text-accent hover:text-foreground font-semibold transition">
              Register Credentials
            </Link>
          </p>
        </div>


      </GlassCard>
    </div>
  );
};
