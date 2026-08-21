import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { dbRouter } from '../services/databaseRouter';
import { Profile, UserPreferences } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isFirebase: boolean; // Keeping name for compatibility, but it refers to Supabase now
  isAuthenticated: boolean;
  preferences: UserPreferences | null;
  otpCodeNeeded: string | null;
  signUp: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message: string; otpSent?: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; emailUnverified?: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;
  updateUserProfile: (fullName: string, avatarUrl?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpCodeNeeded, setOtpCodeNeeded] = useState<string | null>(null);
  
  // We use the presence of SUPABASE_URL in the client to determine if we are in Mock mode or Live mode
  const isSupabaseConfigured = !!(supabase as any).supabaseUrl;

  useEffect(() => {
    const failsafeTimeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    if (isSupabaseConfigured) {
      // Check active session on mount
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
        handleAuthChange(session);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        handleAuthChange(session);
      });

      return () => {
        subscription.unsubscribe();
        clearTimeout(failsafeTimeout);
      };
    } else {
      loadMockSession().finally(() => {
        setLoading(false);
        clearTimeout(failsafeTimeout);
      });
    }
  }, []);

  const handleAuthChange = async (session: any) => {
    if (session?.user) {
      try {
        let profile = await dbRouter.getProfileById(session.user.id);
        
        // Auto-create profile if missing
        if (!profile) {
            profile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: session.user.email?.includes('admin') ? 'admin' : 'user',
                created_at: new Date().toISOString()
            };
            await dbRouter.saveProfile(profile);
        }

        setUser(profile);
        const prefs = await dbRouter.getPreferences(profile.id);
        setPreferences(prefs);
      } catch (error) {
        console.error("Supabase session initialization failed:", error);
        // Fallback to session user data to prevent logging out on network drop
        const fallbackProfile = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: session.user.email?.includes('admin') ? 'admin' : ('user' as 'user' | 'admin'),
            created_at: new Date().toISOString()
        };
        setUser(fallbackProfile);
      }
    } else {
      setUser((prevUser) => {
        // If we already have a user, a sudden null session is likely a network token refresh failure.
        // We only clear the user if it's a deliberate logout (which explicitly sets user to null).
        return prevUser ? prevUser : null;
      });
      // Do not clear preferences if we are retaining the user
      setPreferences((prevPrefs) => prevPrefs ? prevPrefs : null);
    }
    setLoading(false);
  };

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
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      return { success: false, message: pwdErr };
    }

    if (isSupabaseConfigured) {
      try {
        const existing = await dbRouter.getProfileByEmail(email);
        if (existing) {
           return { success: false, message: 'This email is already registered.' };
        }
      } catch (err) {}
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCodeNeeded(code);

    const tempUser = {
      id: 'user-uuid-' + Math.random().toString(36).substr(2, 9),
      full_name: fullName,
      email,
      password,
      role: email.includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('truestyle_pending_user', JSON.stringify(tempUser));
    localStorage.setItem('truestyle_pending_otp', code);

    let backendSuccess = false;

    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_email: email,
          to_name: fullName,
          otp_code: code
        })
      });
      if (response.ok) {
        backendSuccess = true;
        console.log(`[BACKEND] Sent Real OTP Email to ${email}`);
      } else {
        console.error('Backend returned an error.');
      }
    } catch (err) {
      console.error('Failed to connect to backend server on port 5000.', err);
    }

    if (!backendSuccess) {
      return { 
        success: false, 
        message: `Failed to send verification email. Please ensure the backend server is running (restart your terminal) and your SMTP credentials are correct.`,
        otpSent: false 
      };
    }

    return { 
      success: true, 
      message: `Verification code sent to ${email}. Please check your inbox.`,
      otpSent: true 
    };
  };

  const verifyOtp = async (email: string, code: string) => {
    const storedOtp = localStorage.getItem('truestyle_pending_otp');
    const pendingData = localStorage.getItem('truestyle_pending_user');
    
    if (storedOtp === code && pendingData) {
      const tempUser = JSON.parse(pendingData);
      let finalProfile: Profile;

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: tempUser.email,
            password: tempUser.password,
            options: {
              data: {
                full_name: tempUser.full_name
              }
            }
          });
          
          if (error) throw error;
          if (!data.user) throw new Error("Signup failed to return user");

          finalProfile = {
            id: data.user.id,
            full_name: tempUser.full_name,
            email: tempUser.email,
            role: tempUser.role as 'user' | 'admin',
            created_at: tempUser.created_at
          };
          await dbRouter.saveProfile(finalProfile);
        } catch (e: any) {
          let errorMsg = e.message || 'Supabase signup failed.';
          if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network Error')) {
            errorMsg = 'Network connection issue detected. Please check your internet connection.';
          }
          return { success: false, message: errorMsg };
        }
      } else {
        finalProfile = {
          id: tempUser.id,
          full_name: tempUser.full_name,
          email: tempUser.email,
          role: tempUser.role as 'user' | 'admin',
          created_at: tempUser.created_at
        };

        const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
        credentials[finalProfile.email.toLowerCase()] = { password: tempUser.password, profile: finalProfile };
        localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
        await dbRouter.saveProfile(finalProfile);
      }

      await dbRouter.addLog({
        actor_id: finalProfile.id,
        actor_name: finalProfile.full_name,
        action: 'otp_verified',
        details: `User successfully validated OTP. Profile finalized.`,
        ip_address: '127.0.0.1'
      });

      setUser(finalProfile);
      const prefs = await dbRouter.getPreferences(finalProfile.id);
      setPreferences(prefs);
      localStorage.setItem('truestyle_current_user', JSON.stringify(finalProfile));
      
      localStorage.removeItem('truestyle_pending_otp');
      localStorage.removeItem('truestyle_pending_user');
      setOtpCodeNeeded(null);

      return { success: true, message: 'Email successfully verified! Logged in.' };
    } else {
      return { success: false, message: 'Invalid OTP code. Please enter the correct code.' };
    }
  };

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("Login failed");

        let profile = await dbRouter.getProfileById(data.user.id);
        
        if (!profile) {
          profile = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: email,
            role: email.includes('admin') ? 'admin' : 'user',
            created_at: new Date().toISOString()
          };
          await dbRouter.saveProfile(profile);
        }
        
        setUser(profile);
        const prefs = await dbRouter.getPreferences(profile.id);
        setPreferences(prefs);
        return { success: true, message: 'Login successful!' };
      } catch (error: any) {
        let errorMsg = error.message || 'Login failed.';
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network Error')) {
          errorMsg = 'Network connection issue detected. Please check your internet connection.';
        } else if (errorMsg.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password.';
        }
        return { success: false, message: errorMsg };
      }
    } else {
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (Object.keys(credentials).length === 0) {
        const defaultUser = await dbRouter.getProfileByEmail('user@truestyle.security');
        const defaultAdmin = await dbRouter.getProfileByEmail('admin@truestyle.security');
        credentials['user@truestyle.security'] = { password: 'UserPassword123!', profile: defaultUser };
        credentials['admin@truestyle.security'] = { password: 'AdminPassword123!', profile: defaultAdmin };
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
          details: `User logged in.`,
          ip_address: '127.0.0.1'
        });

        return { success: true, message: 'Login successful!' };
      } else {
        if (!match) {
          // Auto-register user if they don't exist in this localStorage instance (e.g., changed IP/Network)
          const newProfile: Profile = {
            id: 'user-uuid-' + Math.random().toString(36).substr(2, 9),
            full_name: email.split('@')[0],
            email: email.toLowerCase(),
            role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
            created_at: new Date().toISOString()
          };
          credentials[email.toLowerCase()] = { password: password, profile: newProfile };
          localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
          
          await dbRouter.saveProfile(newProfile);
          
          setUser(newProfile);
          const prefs = await dbRouter.getPreferences(newProfile.id);
          setPreferences(prefs);
          localStorage.setItem('truestyle_current_user', JSON.stringify(newProfile));
          
          await dbRouter.addLog({
            actor_id: newProfile.id,
            actor_name: newProfile.full_name,
            action: 'user_login',
            details: `Auto-registered mock user on new network/IP.`,
            ip_address: '127.0.0.1'
          });

          return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setPreferences(null);
    localStorage.removeItem('truestyle_current_user');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, message: 'Password reset link sent to your email.' };
      } catch (error: any) {
        let errorMsg = error.message || 'Reset password request failed.';
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network Error')) {
          errorMsg = 'Network connection issue detected. Please check your internet connection.';
        }
        return { success: false, message: errorMsg };
      }
    } else {
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (credentials[email.toLowerCase()]) {
        return { success: true, message: `Mock Reset Link Generated! [Local Mock: Password is "${credentials[email.toLowerCase()].password}"]` };
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

  const updateUserProfile = async (fullName: string, avatarUrl?: string): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, full_name: fullName };
    if (avatarUrl !== undefined) {
      updatedUser.avatar_url = avatarUrl;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: fullName, avatar_url: avatarUrl }
        });
        if (error) throw error;
        
        await dbRouter.saveProfile(updatedUser);
        localStorage.setItem('truestyle_current_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      } catch (error) {
        console.error("Profile update failed", error);
        return false;
      }
    } else {
      await dbRouter.saveProfile(updatedUser);
      
      const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
      if (credentials[user.email.toLowerCase()]) {
        credentials[user.email.toLowerCase()].profile = updatedUser;
        localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
      }

      localStorage.setItem('truestyle_current_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isFirebase: isSupabaseConfigured, // Return isSupabaseConfigured as isFirebase for backwards compatibility
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
