import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { KeyRound, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

type RecoveryStep = 'request_email' | 'verify_otp' | 'reset_password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth(); // Keeping for compatibility, though we mock the rest
  const navigate = useNavigate();
  
  const [step, setStep] = useState<RecoveryStep>('request_email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(''); // Store the real generated OTP
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      // Generate a real 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Call the real backend to send the email
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to_email: email, 
          to_name: 'TrueStyle User', 
          otp_code: generatedOtp 
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP via email server.');
      }

      setSentOtp(generatedOtp);
      setStep('verify_otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to email server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 500)); // Minor delay for UX
      
      if (otp !== sentOtp) {
        throw new Error('Invalid OTP. Please enter the exact code sent to your email.');
      }
      setStep('reset_password');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      // Simulate Password Reset
      await new Promise(r => setTimeout(r, 1500));
      setStep('success');
    } catch (err: any) {
      setErrorMsg('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <GlassCard className="p-8 border-accent/50 shadow-neon-blue">
        <div className="text-center mb-8">
          <div className="inline-flex bg-accent/20 p-2.5 rounded-xl border border-accent/30 text-accent mb-2">
            {step === 'success' ? <ShieldCheck className="w-6 h-6" /> : <KeyRound className="w-6 h-6 animate-pulse" />}
          </div>
          <h2 className="text-2xl font-bold text-foreground font-mono tracking-wide uppercase">
            {step === 'success' ? 'Access Restored' : 'Recover Access'}
          </h2>
          <p className="text-xs text-muted mt-1 font-mono">
            {step === 'request_email' && 'TrueStyle Key Decryption Request'}
            {step === 'verify_otp' && 'Two-Factor Authentication'}
            {step === 'reset_password' && 'Configure New Security Key'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 bg-red-950/30 border border-red-900/30 rounded-lg flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'request_email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Registered Secure Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                placeholder="user@truestyle.security"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
            >
              {loading ? 'Transmitting OTP...' : 'Send OTP to Email'}
            </button>
          </form>
        )}

        {step === 'verify_otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="p-3 mb-4 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent text-center">
              An OTP has been sent to <strong>{email}</strong>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-center text-lg tracking-widest text-foreground font-mono"
                placeholder="••••••"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">New Security Key (Password)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                placeholder="Enter new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
            >
              {loading ? 'Updating Key...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-xs text-emerald-400 leading-relaxed font-mono">
              Your security key has been successfully decrypted and updated. You may now authenticate with your new credentials.
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-[0_0_20px_rgba(5,150,105,0.3)]"
            >
              Proceed to Login
            </button>
          </div>
        )}

        {step !== 'success' && (
          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link to="/login" className="inline-flex items-center text-xs text-muted hover:text-foreground transition">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Authentication
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
