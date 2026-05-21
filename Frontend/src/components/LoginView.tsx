import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, Mail, Phone, Lock, ChevronRight } from 'lucide-react';
import { ActiveView, User } from '../types';
import { api } from '../lib/api';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  setView: (view: ActiveView) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function LoginView({ onLoginSuccess, setView, onNotify }: LoginViewProps) {
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    // Identifier check (Email or phone)
    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your email or phone number.';
    } else {
      const isEmail = identifier.includes('@');
      const isPhone = /^[0-9+() -]{7,15}$/.test(identifier);
      if (!isEmail && !isPhone) {
        newErrors.identifier = 'Please enter a valid Pakistani phone number or email address.';
      }
    }

    // Password check
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validate()) {
      onNotify('Please resolve the highlighted validation errors.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await api.login(identifier.trim(), password);
      if (user.token) localStorage.setItem('fringe_auth_token', user.token);
      localStorage.setItem('fringe_user_data', JSON.stringify(user));
      onNotify('Salamat! Welcome back to fridge.pk.', 'success');
      onLoginSuccess(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrors({ general: msg });
      onNotify(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'email' | 'phone') => {
    if (type === 'email') {
      setIdentifier('farman.ansari@fridge.pk');
      setPassword('fringe123');
    } else {
      setIdentifier('03001234567');
      setPassword('fringe123');
    }
    onNotify('Demo login fast-filled successfully.', 'info');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden" id="login-view-page">
      {/* Decorative background visual elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-coral-light/30 rounded-full blur-3xl translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl -translate-x-12 translate-y-12" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-100/80 rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
      >
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-900 flex items-center justify-center text-white font-serif font-bold text-2xl">
              F
            </div>
            <span className="font-display text-2xl font-bold text-brand-navy-900 tracking-tight">fridge.pk</span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-brand-navy-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 text-xs mt-1">Sign in to unlock your custom loyalty tier and cart history</p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs text-center font-medium">
              {errors.general}
            </div>
          )}

          {/* Identifier field */}
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="03001234567 or you@fringe.pk"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.identifier ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-4 py-3 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none transition-colors duration-150`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </div>
            </div>
            {errors.identifier && (
              <p className="text-rose-600 text-[11px] font-medium pl-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
                Password
              </label>
              <button
                type="button"
                onClick={() => setView('forgot-password')}
                className="text-xs font-semibold text-brand-coral hover:text-brand-coral-hover transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-10 py-3 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none transition-colors duration-150`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy-900 p-1 rounded cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-600 text-[11px] font-medium pl-1">{errors.password}</p>
            )}
          </div>

          {/* Login Action Trigger - coral pink full width */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            id="login-submit-btn"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In Securely</span>
            )}
          </button>
        </form>

        {/* Divider with or */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <span className="relative bg-white px-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            or continue as
          </span>
        </div>

        {/* Continue with Google mockup */}
        <button
          onClick={() => {
            onNotify('Connecting safely with Google credentials...', 'info');
            setTimeout(() => {
              const mockGoogleUser = {
                name: 'Farman Ansari',
                email: 'farmanullahansari908@gmail.com',
                token: 'google_oauth_token_' + Math.random().toString(36).substring(7)
              };
              localStorage.setItem('fringe_auth_token', mockGoogleUser.token);
              localStorage.setItem('fringe_user_data', JSON.stringify(mockGoogleUser));
              onLoginSuccess(mockGoogleUser);
              onNotify('Successfully authenticated via Google!', 'success');
            }, 1000);
          }}
          className="w-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 py-3 rounded-[12px] text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          id="google-login-btn"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Demo Fast-login Assist */}
        <div className="mt-8 pt-6 border-t border-slate-50 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-coral shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Demo Quick Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemoCredentials('email')}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg font-medium text-center transition-colors cursor-pointer"
            >
              Demo Email
            </button>
            <button
              onClick={() => fillDemoCredentials('phone')}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg font-medium text-center transition-colors cursor-pointer"
            >
              Demo Phone
            </button>
          </div>
        </div>

        {/* Route context selector trigger */}
        <p className="text-center text-xs text-slate-500 mt-8 font-sans">
          Don't have an account?{' '}
          <button
            onClick={() => setView('signup')}
            className="font-bold text-brand-navy-900 hover:text-brand-coral cursor-pointer border-b border-brand-navy-900 hover:border-brand-coral transition-colors"
            id="signup-link"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
