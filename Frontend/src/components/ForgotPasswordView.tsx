import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Key, Lock, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ActiveView } from '../types';
import { api } from '../lib/api';

interface ForgotPasswordViewProps {
  setView: (view: ActiveView) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type ResetStep = 'request' | 'verify' | 'new-password' | 'success';

export default function ForgotPasswordView({ setView, onNotify }: ForgotPasswordViewProps) {
  const [step, setStep] = useState<ResetStep>('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      onNotify('Please enter your email or phone number.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(identifier.trim());
      const hint = res.devOtp ? ` (Dev OTP: ${res.devOtp})` : '';
      onNotify(`OTP sent to ${identifier}!${hint}`, 'success');
      setStep('verify');
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 4) {
      onNotify('Please enter the complete 4-digit code.', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.verifyOtp(identifier.trim(), enteredCode);
      onNotify('OTP verified successfully!', 'success');
      setStep('new-password');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      onNotify('Please declare your new password.', 'error');
      return;
    }
    if (password.length < 5) {
      onNotify('Password must be at least 5 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      onNotify('Passwords do not match. Re-enter carefully.', 'error');
      return;
    }
    setLoading(true);
    try {
      const enteredCode = otp.join('');
      await api.resetPassword(identifier.trim(), enteredCode, password);
      onNotify('Your password has been reset successfully.', 'success');
      setStep('success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next element automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden" id="forgot-pw-view">
      {/* Visual background layers */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-coral-light/20 rounded-full blur-3xl translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl -translate-x-12 translate-y-12" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white border border-slate-100/80 rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
      >
        {/* Back navigation element layout */}
        {step !== 'success' && (
          <button
            onClick={() => setView('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-coral mb-6 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        )}

        {/* Step 1 Content: Request Reset Pin */}
        {step === 'request' && (
          <div id="forgot-step-request">
            <h2 className="text-xl font-bold text-brand-navy-900 tracking-tight">Forgot password?</h2>
            <p className="text-xs text-slate-500 mt-1.5 mb-6">
              Enter your email address or phone or WhatsApp number. We will send you a 4-digit code to verify your identity.
            </p>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-navy-800 uppercase tracking-wider block">
                  Email or Registered Phone
                </label>
                <input
                  type="text"
                  required
                  placeholder="03001234567 or you@domain.pk"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-3 text-brand-navy-900 placeholder-slate-400 focus:ring-1 focus:ring-brand-coral focus:border-brand-coral focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Pin</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 Content: Verify Pin code received */}
        {step === 'verify' && (
          <div id="forgot-step-verify">
            <h2 className="text-xl font-bold text-brand-navy-900 tracking-tight">Enter Verification Pin</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              We have dispatched a 4-digit OTP to <span className="font-semibold text-brand-navy-900">{identifier}</span>. Entered below to proceed.
            </p>
            <p className="text-[10px] bg-sky-50 border border-sky-100 text-sky-700 px-3 py-1.5 rounded-lg mt-3 font-semibold">
              Demo Tip: You can type any 4 digits (e.g., 1-2-3-4) to unlock successfully!
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-6 mt-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 focus:border-brand-coral focus:ring-1 focus:ring-brand-coral rounded-xl focus:outline-none text-brand-navy-900"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-navy-900 hover:bg-brand-coral text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <Key className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-[11px] text-slate-400">Resend PIN in {resendTimer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setResendTimer(60);
                      onNotify('New OTP PIN dispatched!', 'info');
                    }}
                    className="text-[11px] font-bold text-brand-coral hover:underline flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend PIN Now
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Step 3 Content: Set New Password */}
        {step === 'new-password' && (
          <div id="forgot-step-new-pw">
            <h2 className="text-xl font-bold text-brand-navy-900 tracking-tight">Create New Password</h2>
            <p className="text-xs text-slate-500 mt-1.5 mb-6">
              Decide a strong, new protective password. Ensure it does not match your past combinations.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-navy-800 tracking-wider block">
                  New Password (5+ characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-2.5 text-brand-navy-900 focus:ring-1 focus:ring-brand-coral focus:border-brand-coral focus:outline-none"
                />
              </div>

              {/* Confirm password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-navy-800 tracking-wider block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-2.5 text-brand-navy-900 focus:ring-1 focus:ring-brand-coral focus:border-brand-coral focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <Lock className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 4 Content: Reset Success State */}
        {step === 'success' && (
          <div className="text-center py-4" id="forgot-step-success">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy-900 tracking-tight">Security Updated</h2>
            <p className="text-xs text-slate-500 mt-2 mb-8 leading-relaxed">
              Your fridge.pk account password has been updated securely. You can now log in with your credentials.
            </p>

            <button
              onClick={() => setView('login')}
              className="w-full bg-brand-coral hover:bg-brand-coral-hover text-white py-3 rounded-[12px] text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-md"
            >
              Sign In Now
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
