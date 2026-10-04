import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Mail,
  Lock,
  Phone,
  User,
  KeyRound,
  ArrowRight,
  Globe2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { COUNTRIES_LIST } from '../../data/initialData';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'otp_verify' | 'forgot'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP states
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [userEnteredOtp, setUserEnteredOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(60);

  const selectedCountry = COUNTRIES_LIST.find((c) => c.code === selectedCountryCode) || COUNTRIES_LIST[0];

  // Handle standard email & password login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address or username.', 'error');
      return;
    }
    if (!password) {
      showToast('Please enter your password.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login(email, password);
      setIsSubmitting(false);
      if (ok) {
        onClose();
      }
    }, 400);
  };

  // Handle standard registration form submission
  const handleStartEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your Gmail / email address.', 'error');
      return;
    }
    if (!password) {
      showToast('Please create a password.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter your password.', 'error');
      return;
    }

    // Direct successful registration to land immediately on Basic Trial plan
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = register(
        name.trim(),
        email.trim(),
        phone.trim() || `+1 555-0192`,
        password,
        referralCode.trim(),
        selectedCountry
      );
      setIsSubmitting(false);
      if (ok) {
        showToast(`Registration complete! Welcome to eBuy-Partner Free Basic Trial Plan ($ USD).`, 'success');
        onClose();
      }
    }, 400);
  };

  // Handle Google Login / Registration with persistent email
  const handleGoogleAuth = () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      showToast('Please enter your Gmail / Email address above first, then click Sign in with Google.', 'info');
      return;
    }

    setIsSubmitting(true);
    const googleName = name.trim() || targetEmail.split('@')[0] || 'Google Partner';
    const googlePhone = phone.trim() || `+1 555-0192`;

    setTimeout(() => {
      // First try to check if user already exists
      const loginAttempt = login(targetEmail, 'GoogleOAuthPass2026!');
      if (loginAttempt) {
        setIsSubmitting(false);
        showToast(`Signed in successfully as ${targetEmail} ($ USD).`, 'success');
        onClose();
      } else {
        // If new, register
        const ok = register(
          googleName,
          targetEmail,
          googlePhone,
          'GoogleOAuthPass2026!',
          referralCode.trim(),
          selectedCountry
        );
        setIsSubmitting(false);
        if (ok) {
          showToast(`Account created for ${targetEmail}! Welcome to Basic Trial ($ USD).`, 'success');
          onClose();
        }
      }
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign In to Your Account'
          : mode === 'register'
          ? 'Register New Account'
          : mode === 'otp_verify'
          ? 'Verify Security Code'
          : 'Reset Password'
      }
      subtitle={
        mode === 'login'
          ? 'Login with your email and password or continue with Google.'
          : mode === 'register'
          ? 'Create your free merchant account and start on the Basic Trial Plan ($0 deposit).'
          : mode === 'otp_verify'
          ? `Enter the 6-digit verification code sent to ${email}.`
          : 'Enter your registered email address to recover your account.'
      }
      maxWidth="md"
    >
      {/* Top Brand Logo Banner */}
      <div className="flex items-center justify-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
        <EBuyPartnerLogo size={36} />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#171717]">eBuy<span className="text-[#F4511E]">-Partner</span></span>
            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">eBay Sister Entity</span>
          </div>
          <p className="text-[10px] text-[#666666]">Official Merchant Rating & USD Commission Network</p>
        </div>
      </div>

      {/* Top Mode Tabs (Login / Register) */}
      {(mode === 'login' || mode === 'register') && (
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F5F5F7] rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-[#F4511E] shadow-sm font-black'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-[#F4511E] shadow-sm font-black'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Account</span>
          </button>
        </div>
      )}

      {/* 1. LOGIN MODE */}
      {mode === 'login' && (
        <div className="space-y-4">
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Gmail or Email Address <span className="text-[#F4511E]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="alex.merchant@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#171717]">
                  Password <span className="text-[#F4511E]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] font-bold text-[#F4511E] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-black text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In with Email & Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* OR DIVIDER */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#171717] transition-all flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google Account</span>
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-[#666666]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#F4511E] hover:underline"
              >
                Create Account (Free Basic Trial)
              </button>
            </p>
          </div>
        </div>
      )}

      {/* 2. REGISTER MODE */}
      {mode === 'register' && (
        <form onSubmit={handleStartEmailRegister} className="space-y-3">
          {/* Country Selection for profile */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Your Region / Location
            </label>
            <div className="relative">
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#171717] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none appearance-none cursor-pointer"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#666666]">
                ▼
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Full Legal Name <span className="text-[#F4511E]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Alexander Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Gmail / Email Address <span className="text-[#F4511E]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="alex.merchant@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="+1 555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Create Password <span className="text-[#F4511E]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Confirm Password <span className="text-[#F4511E]">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label className="block text-[11px] font-bold text-[#666666] mb-1">
              Referral Code / Sponsor ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. VIP-NX892"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium uppercase font-mono tracking-wider focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          {/* Plan Notice */}
          <div className="p-2.5 bg-[#FFF4ED] border border-[#FFD7C2] rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4511E] shrink-0" />
            <span className="text-[11px] font-bold text-[#171717]">
              Automatic Enrollment: Free Basic Trial Plan ($0 Deposit · 4 Products · Total $80 USD Reward)
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-black text-xs transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register Account & Land on Basic Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* GOOGLE REGISTER BUTTON */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#171717] transition-all flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Register Instantly with Google Account</span>
          </button>

          <div className="text-center pt-1">
            <p className="text-xs text-[#666666]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#F4511E] hover:underline"
              >
                Sign In directly
              </button>
            </p>
          </div>
        </form>
      )}

      {/* 3. FORGOT PASSWORD */}
      {mode === 'forgot' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) {
              showToast('Please enter your email address.', 'error');
              return;
            }
            showToast(`Password reset link has been dispatched to ${email}.`, 'success');
            setMode('login');
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="alex.merchant@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#171717] rounded-xl font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-black text-xs"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
