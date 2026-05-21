import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';
import { ActiveView, User } from '../types';
import { api } from '../lib/api';

interface SignUpViewProps {
  onSignUpSuccess: (user: User) => void;
  setView: (view: ActiveView) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function SignUpView({ onSignUpSuccess, setView, onNotify }: SignUpViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-rose-500' };
    if (score === 2) return { label: 'Fair', score: 50, color: 'bg-amber-400' };
    if (score === 3) return { label: 'Good', score: 75, color: 'bg-sky-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500' };
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name check
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    // Phone check
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9]{7,12}$/.test(phone.trim().replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please provide a valid phone number digit sequence.';
    }

    // Password check
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Confirm password check
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Terms agreement check
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onNotify('Kindly verify and complete all fields.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phone.trim().replace(/^0+/, '')}`;
      const { user } = await api.register({ name, email, phone: fullPhoneNumber, password });
      if (user.token) localStorage.setItem('fringe_auth_token', user.token);
      localStorage.setItem('fringe_user_data', JSON.stringify(user));
      onNotify('Account created successfully', 'success');
      onSignUpSuccess(user);
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Sign up failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden" id="signup-view-page">
      {/* Visual backdrops */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-coral-light/20 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl translate-x-12 translate-y-12" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-100/80 rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-900 flex items-center justify-center text-white font-serif font-bold text-2xl">
              F
            </div>
            <span className="font-display text-2xl font-bold text-brand-navy-900 tracking-tight">fridge.pk</span>
          </div>
          <h2 className="text-2xl font-bold font-sans text-brand-navy-900 tracking-tight">Create your account</h2>
          <p className="text-slate-500 text-xs mt-1">Join fridge.pk to save alerts, track orders & speed up checkout</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Farman Ansari"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-4 py-2.5 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>
            {errors.name && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.pk"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-4 py-2.5 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            {errors.email && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.email}</p>}
          </div>

          {/* Phone (with Country Code dropdown) */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-shrink-0">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-[12px] pl-3 pr-8 py-2.5 text-brand-navy-900 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral focus:outline-none appearance-none cursor-pointer"
                  style={{ minWidth: '95px' }}
                >
                  <option value="+92">🇵🇰 +92</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="relative flex-grow">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="3001234567"
                  className={`w-full text-sm bg-slate-50 border ${
                    errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                  } rounded-[12px] pl-10 pr-4 py-2.5 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none`}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>
            {errors.phone && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-10 py-2.5 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy-900 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength bar indicator */}
            {password && (
              <div className="pt-1.5 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Strength:</span>
                  <span className="text-brand-navy-800">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
            {errors.password && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-brand-navy-800 tracking-wide block">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className={`w-full text-sm bg-slate-50 border ${
                  errors.confirmPassword ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-brand-coral'
                } rounded-[12px] pl-10 pr-10 py-2.5 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:outline-none`}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy-900 p-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded border-slate-300 text-brand-coral focus:ring-brand-coral h-4 w-4"
            />
            <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
              I agree to the <span className="text-brand-navy-900 font-semibold underline hover:text-brand-coral transition-colors">Terms & Conditions</span>
            </label>
          </div>
          {errors.terms && <p className="text-rose-600 text-[10px] font-medium pl-1">{errors.terms}</p>}

          {/* Coral "Sign up" button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
            id="register-submit-btn"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign up</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 select-none">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="font-bold text-brand-navy-900 hover:text-brand-coral cursor-pointer border-b border-brand-navy-900 hover:border-brand-coral transition-colors"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
