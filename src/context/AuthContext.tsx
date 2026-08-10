import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { dbRouter } from '../services/databaseRouter';
import { Profile, UserPreferences } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isSupabase: boolean;
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
  otpCodeNeeded: string | null; // Stores generated OTP code for mock testing
  signUp: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message: string; otpSent?: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; emailUnverified?: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;
  updateUserProfile: (fullName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpCodeNeeded, setOtpCodeNeeded] = useState<string | null>(null);

  // Load initial session
  useEffect(() => {
    const initSession = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              setUser(profile as Profile);
              // Fetch preferences from database
              const prefs = await dbRouter.getPreferences(profile.id);
              setPreferences(prefs);
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Supabase session initialization failed:", error);
          await loadMockSession();
        } finally {
          setLoading(false);
        }
      } else {
        await loadMockSession();
        setLoading(false);
      }
    };

    initSession();
    
    // Subscribe to supabase auth state changes
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setUser(profile as Profile);
            const prefs = await dbRouter.getPreferences(profile.id);
            setPreferences(prefs);
          }
        } else {
          setUser(null);
          setPreferences(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const loadMockSession = async () => {
    const stored = localStorage.getItem('truestyle_current_user');
    if (stored) {
      const u = JSON.parse(stored) as Profile;
      setUser(u);
      const prefs = await dbRouter.getPreferences(u.id);
      setPreferences(prefs);
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character.';
    return null;
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    // Password complexity check
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      return { success: false, message: pwdErr };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        
        // Supabase will trigger a confirmation link by default.
        return { success: true, message: 'Registration successful! Please check your email for a confirmation link.', otpSent: false };
      } catch (error: any) {
        return { success: false, message: error.message || 'Supabase signup failed.' };
      }
    } else {
      // Mock Sign Up
      const existing = await dbRouter.getProfileByEmail(email);
      if (existing) {
        return { success: false, message: 'Email address already registered.' };
      }

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCodeNeeded(code);

      // Save pending registration to local storage
      const tempUser = {
        id: 'user-uuid-' + Math.random().toString(36).substr(2, 9),
        full_name: fullName,
        email,
        password, // stored plain text for mock authentication fallback
        role: 'user' as const,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('truestyle_pending_user', JSON.stringify(tempUser));
      localStorage.setItem('truestyle_pending_otp', code);

      await dbRouter.addLog({
        actor_id: 'system',
        actor_name: 'Auth Heuristic',
        action: 'user_register_pending',
        details: `Created pending profile for ${fullName} (${email}). Generated OTP: ${code}`,
        ip_address: '127.0.0.1'
      });

      return { 
        success: true, 
        message: `Verification code generated successfully. For testing convenience: YOUR OTP CODE IS ${code}.`,
        otpSent: true 
      };
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'signup'
        });
        if (error) throw error;
        
        return { success: true, message: 'Email successfully verified!' };
      } catch (error: any) {
        return { success: false, message: error.message || 'Verification code invalid.' };
      }
    } else {
      // Mock OTP validation
      const storedOtp = localStorage.getItem('truestyle_pending_otp');
      const pendingData = localStorage.getItem('truestyle_pending_user');
      
      if (storedOtp === code && pendingData) {
        const tempUser = JSON.parse(pendingData);
        // Save user profile to database
        const profile: Profile = {
          id: tempUser.id,
          full_name: tempUser.full_name,
          email: tempUser.email,
          role: tempUser.email.includes('admin') ? 'admin' : 'user', // promote automatically if email contains 'admin'
          created_at: tempUser.created_at
        };

        // Create credential list in localStorage for mock login
        const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
        credentials[profile.email.toLowerCase()] = { password: tempUser.password, profile };
        localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));

        await dbRouter.saveProfile(profile);
        await dbRouter.addLog({
          actor_id: profile.id,
          actor_name: profile.full_name,
          action: 'otp_verified',
          details: `User successfully validated OTP. Profile finalized.`,
          ip_address: '127.0.0.1'
        });

        // Set current session
        setUser(profile);
        const prefs = await dbRouter.getPreferences(profile.id);
        setPreferences(prefs);
        localStorage.setItem('truestyle_current_user', JSON.stringify(profile));
        
        // Clear variables
        localStorage.removeItem('truestyle_pending_otp');
        localStorage.removeItem('truestyle_pending_user');
        setOtpCodeNeeded(null);

        return { success: true, message: 'Email successfully verified! Logged in.' };
      } else {
        return { success: false, message: 'Invalid OTP code. Please enter the code displayed.' };
      }
    }
  };

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch profile
        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          const prof = profile as Profile;
          setUser(prof);
          const prefs = await dbRouter.getPreferences(prof.id);
          setPreferences(prefs);
          return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Profile data not found.' };
      } catch (error: any) {
        return { success: false, message: error.message || 'Login failed.' };
      }
    } else {
      // Seed default accounts in mock DB if they aren't seeded in mock_creds yet
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (Object.keys(credentials).length === 0) {
        const defaultUser = await dbRouter.getProfileByEmail('user@truestyle.security');
        const defaultAdmin = await dbRouter.getProfileByEmail('admin@truestyle.security');
        // Seed default
        credentials['user@truestyle.security'] = { 
          password: 'UserPassword123!', 
          profile: defaultUser 
        };
        credentials['admin@truestyle.security'] = { 
          password: 'AdminPassword123!', 
          profile: defaultAdmin 
        };
        localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
      }

      const match = credentials[email.toLowerCase()];
      if (match && match.password === password) {
        const profile = match.profile as Profile;
        setUser(profile);
        const prefs = await dbRouter.getPreferences(profile.id);
        setPreferences(prefs);
        localStorage.setItem('truestyle_current_user', JSON.stringify(profile));

        await dbRouter.addLog({
          actor_id: profile.id,
          actor_name: profile.full_name,
          action: 'user_login',
          details: `User logged in using local storage backend. Session generated.`,
          ip_address: '127.0.0.1'
        });

        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid email or password.' };
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    
    // Clear local session
    setUser(null);
    setPreferences(null);
    localStorage.removeItem('truestyle_current_user');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password-confirm',
        });
        if (error) throw error;
        return { success: true, message: 'Password reset link sent to your email.' };
      } catch (error: any) {
        return { success: false, message: error.message || 'Reset password request failed.' };
      }
    } else {
      // Mock Reset
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (credentials[email.toLowerCase()]) {
        return { success: true, message: `Mock Reset Link Generated! In actual usage, a reset link would be emailed. [Local Mock: Password is "${credentials[email.toLowerCase()].password}"]` };
      } else {
        return { success: false, message: 'Email address not found.' };
      }
    }
  };

  const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;
    await dbRouter.updatePreferences(user.id, updates);
    setPreferences(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateUserProfile = async (fullName: string): Promise<boolean> => {
    if (!user) return false;
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user.id);
        
        if (error) throw error;
        setUser({ ...user, full_name: fullName });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      const updatedProfile = { ...user, full_name: fullName };
      
      // Update in profiles
      await dbRouter.saveProfile(updatedProfile);
      
      // Update in credentials
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (credentials[user.email.toLowerCase()]) {
        credentials[user.email.toLowerCase()].profile = updatedProfile;
        localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
      }

      setUser(updatedProfile);
      localStorage.setItem('truestyle_current_user', JSON.stringify(updatedProfile));
      
      await dbRouter.addLog({
        actor_id: user.id,
        actor_name: fullName,
        action: 'profile_update',
        details: `Updated full name in profile preferences.`,
        ip_address: '127.0.0.1'
      });

      return true;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isSupabase: isSupabaseConfigured,
      isAuthenticated: !!user,
      preferences,
      otpCodeNeeded,
      signUp,
      verifyOtp,
      login,
      logout,
      resetPassword,
      updateUserPreferences,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
