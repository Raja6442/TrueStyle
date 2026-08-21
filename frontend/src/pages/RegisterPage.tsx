import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp, user } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Math Captcha state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Generate new math puzzle
  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 2);
    setNum2(Math.floor(Math.random() * 9) + 2);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Live password checklists
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Initial validations
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!acceptTerms) {
      setError('You must accept the terms of service and privacy policies.');
      return;
    }

    // CAPTCHA check
    const correctAnswer = num1 + num2;
    if (parseInt(captchaAnswer) !== correctAnswer) {
      setError('CAPTCHA verification failed. Please enter the correct mathematical sum.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(fullName, email, password);
      if (res.success) {
        if (res.otpSent) {
          // Redirect to OTP Verification
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { state: { message: res.message } });
        } else {
          setSuccessMsg(res.message);
        }
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message || 'Registration blocked by cyber firewall.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <GlassCard className="p-8 border-accent/50 shadow-neon-blue">
        <div className="text-center mb-6">
          <div className="inline-flex bg-accent/20 p-2.5 rounded-xl border border-accent/30 text-accent mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-mono tracking-wide uppercase">Register Node</h2>
          <p className="text-xs text-muted mt-1 font-mono">TrueStyle Cyber Registry Access</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/30 border border-red-900/30 rounded-lg flex items-start space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-6 bg-green-950/30 border border-green-900/30 rounded-lg flex items-start space-x-2 text-xs text-green-400">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
              placeholder="e.g. Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Secure Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
              placeholder="user@truestyle.security"
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
                className="w-full glass-input pl-3.5 pr-10 py-2.5 rounded-lg text-xs text-foreground font-mono"
                placeholder="Choose strong password"
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

          {/* Password Validation List */}
          {password.length > 0 && (
            <div className="p-3 bg-cyber-dark-bg border border-border rounded-lg grid grid-cols-2 gap-2 text-[10px]">
              <div className={`flex items-center space-x-1.5 ${rules.length ? 'text-green-400' : 'text-muted'}`}>
                {rules.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                <span>8+ Characters</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${rules.upper ? 'text-green-400' : 'text-muted'}`}>
                {rules.upper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                <span>1 Uppercase</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${rules.lower ? 'text-green-400' : 'text-muted'}`}>
                {rules.lower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                <span>1 Lowercase</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${rules.number ? 'text-green-400' : 'text-muted'}`}>
                {rules.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                <span>1 Number</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${rules.special ? 'text-green-400' : 'text-muted'}`}>
                {rules.special ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
                <span>1 Special Symbol</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Confirm Access Token</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground font-mono"
              placeholder="Re-enter password"
              required
            />
          </div>

          {/* Math CAPTCHA Form */}
          <div className="bg-cyber-dark-bg p-3 border border-border rounded-lg space-y-2 select-none">
            <span className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
              Firewall Captcha Check
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground font-mono">
                Solve puzzle: <span className="font-bold text-accent">{num1} + {num2}</span> = ?
              </span>
              <input
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-20 text-center glass-input px-2 py-1.5 rounded-md text-xs text-foreground"
                placeholder="Result"
                required
              />
            </div>
          </div>

          <label className="flex items-start text-[10px] text-muted select-none cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded bg-cyber-dark-bg border-border text-accent focus:ring-cyber-blue-500 mr-2 mt-0.5"
            />
            <span>
              I accept the{' '}
              <Link to="/terms" target="_blank" className="text-accent hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue disabled:opacity-50"
          >
            {loading ? 'Registering Node...' : 'Register Secure Credentials'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted">
            Registered terminal?{' '}
            <Link to="/login" className="text-accent hover:text-foreground font-semibold transition">
              Log In
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
