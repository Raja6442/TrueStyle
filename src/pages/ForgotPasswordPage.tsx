import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Key recovery failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <GlassCard className="p-8 border-cyber-blue-900/50 shadow-neon-blue">
        <div className="text-center mb-8">
          <div className="inline-flex bg-cyber-blue-700/20 p-2.5 rounded-xl border border-cyber-blue-700/30 text-cyber-blue-400 mb-2">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white font-mono tracking-wide uppercase">Recover Access</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">TrueStyle Key Decryption Request</p>
        </div>

        {successMsg && (
          <div className="p-4 mb-6 bg-cyber-blue-900/30 border border-cyber-blue-500/30 rounded-lg text-xs text-cyber-blue-400 leading-relaxed font-mono">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-6 bg-red-950/30 border border-red-900/30 rounded-lg flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Registered Secure Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-white"
                placeholder="user@truestyle.security"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
            >
              {loading ? 'Transmitting Key Request...' : 'Decrypt Access Key'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-cyber-dark-border text-center">
          <Link to="/login" className="inline-flex items-center text-xs text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Authentication
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
