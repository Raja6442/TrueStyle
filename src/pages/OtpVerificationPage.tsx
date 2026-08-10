import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export const OtpVerificationPage: React.FC = () => {
  const { verifyOtp, otpCodeNeeded } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mockOtpHint, setMockOtpHint] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // If mock OTP code exists in localStorage, pull it for display
    const pendingOtp = localStorage.getItem('truestyle_pending_otp');
    if (pendingOtp) {
      setMockOtpHint(pendingOtp);
    }
  }, [otpCodeNeeded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtp(email, code);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'OTP validation failed.');
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
          <h2 className="text-2xl font-bold text-white font-mono tracking-wide uppercase">Email Verification</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">TrueStyle Two-Factor OTP Gateway</p>
          {email && <p className="text-[10px] text-gray-400 mt-2 font-mono break-all">Node: {email}</p>}
        </div>

        {/* Mock verification code helper */}
        {mockOtpHint && (
          <div className="p-3 mb-6 bg-cyber-blue-950/40 border border-cyber-blue-700/40 rounded-lg text-[10px] text-cyber-blue-400 font-mono text-center select-all">
            🛡 LOCAL SIMULATION ENVELOPE: <br />
            Your generated verification code is:{' '}
            <strong className="text-sm text-white px-2 py-0.5 rounded bg-cyber-blue-700/50 block mt-1.5 w-max mx-auto tracking-widest">{mockOtpHint}</strong>
          </div>
        )}

        {success && (
          <div className="p-3 mb-6 bg-green-950/30 border border-green-900/30 rounded-lg flex items-center space-x-2 text-xs text-green-400 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success} Initializing dashboard context...</span>
          </div>
        )}

        {error && (
          <div className="p-3 mb-6 bg-red-950/30 border border-red-900/30 rounded-lg flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2.5 text-center">
                Enter 6-Digit Security Token
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[1em] text-lg font-mono font-bold glass-input px-3 py-3 rounded-lg text-white"
                placeholder="000000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyber-blue-700 hover:bg-cyber-blue-600 text-white font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
            >
              {loading ? 'Validating Token...' : 'Verify Cryptographic OTP'}
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
