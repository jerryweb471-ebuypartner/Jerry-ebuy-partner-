import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { COUNTRIES_LIST } from '../../data/initialData';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  syncUserToFirestore,
} from '../../firebase';

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
  const { login, register, setCurrentView, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedCountry =
    COUNTRIES_LIST.find((c) => c.code === selectedCountryCode) || COUNTRIES_LIST[0];

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // 1) Handle Sign In with Firebase Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email or username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebase signInWithEmailAndPassword
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      } catch (fbErr: any) {
        // Fallback for local demo/admin accounts (e.g. Jerry@786 / admin)
        const localSuccess = login(cleanEmail, password);
        if (!localSuccess) {
          const code = fbErr?.code;
          if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
            setErrorMessage('Invalid email or password. Please check your credentials.');
          } else if (code === 'auth/wrong-password') {
            setErrorMessage('Incorrect password.');
          } else {
            setErrorMessage(fbErr?.message || 'Failed to sign in.');
          }
          setIsSubmitting(false);
          return;
        }
      }

      login(cleanEmail, password);

      // Redirect to Home page ("/")
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in. Please try again.');
      setIsSubmitting(false);
    }
  };

  // 2) Handle Sign Up with Firebase Auth
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      let createdUid = `USR-${Date.now()}`;

      // 1. Create account with Firebase Authentication
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        createdUid = userCredential.user.uid;

        // 2. Send Email Verification directly to user's mailbox
        await sendEmailVerification(userCredential.user).catch((emailErr) => {
          console.warn('Firebase email verification notification note:', emailErr);
        });

        setSuccessMessage(
          `Verification email sent to ${cleanEmail}! Please check your Inbox and Spam folder.`
        );
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
          setErrorMessage('An account already exists with this email address.');
          setIsSubmitting(false);
          return;
        } else if (authError.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters.');
          setIsSubmitting(false);
          return;
        } else {
          console.warn('Firebase Auth note:', authError.message);
        }
      }

      // 3. Register user profile in local app state & Firestore
      register(
        cleanName,
        cleanEmail,
        `+1 555-0192`,
        password,
        '',
        selectedCountry
      );

      // 4. Sync profile directly to Firebase Firestore
      syncUserToFirestore({
        id: createdUid,
        name: cleanName,
        email: cleanEmail,
        phone: `+1 555-0192`,
        role: 'user',
        status: 'active',
        level: 0,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
      }).catch((err) => console.warn('Firestore sync note:', err));

      showToast(`Welcome ${cleanName}! Registration successful.`, 'success');

      // Redirect to Home page ("/")
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }

      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign up. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Google Sign In / Registration with Firebase Auth
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const targetEmail = googleUser.email || '';
      const googleName = googleUser.displayName || 'Merchant Partner';

      const loginAttempt = login(targetEmail, 'GooglePass2026!');
      if (!loginAttempt) {
        register(
          googleName,
          targetEmail,
          googleUser.phoneNumber || `+1 555-0192`,
          'GooglePass2026!',
          '',
          selectedCountry
        );

        syncUserToFirestore({
          id: googleUser.uid,
          name: googleName,
          email: targetEmail,
          phone: googleUser.phoneNumber || `+1 555-0192`,
          role: 'user',
          status: 'active',
          level: 0,
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
        }).catch(() => {});
      }

      // Redirect to Home page ("/")
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setIsSubmitting(false);
      showToast(`Welcome back, ${googleName}!`, 'success');
      onClose();
    } catch (err: any) {
      console.warn('Google Auth note:', err);
      // Fallback if popup is blocked
      const targetEmail = email.trim();
      if (targetEmail) {
        const googleName = name.trim() || targetEmail.split('@')[0] || 'Partner';
        const ok = register(googleName, targetEmail, `+1 555-0192`, 'GooglePass2026!', '', selectedCountry);
        if (ok) {
          setCurrentView('home');
          setIsSubmitting(false);
          onClose();
          return;
        }
      }
      setErrorMessage(err?.message || 'Google Sign In was cancelled or closed.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
      subtitle={
        mode === 'login'
          ? 'Enter your credentials to access your eBuy-Partner dashboard.'
          : 'Register now to start with your $0 Free Basic Trial ($ USD).'
      }
      maxWidth="sm"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-2.5 pb-4 border-b border-[#E5E7EB] mb-4">
        <EBuyPartnerLogo size={34} />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#171717]">
              eBuy<span className="text-[#F4511E]">-Partner</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
              eBay Sister Company
            </span>
          </div>
          <p className="text-[10px] text-[#666666]">Official Global Merchant Network</p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#F3F4F6] rounded-xl mb-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => handleModeChange('login')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-white text-[#F4511E] shadow-sm font-black'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('register')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-white text-[#F4511E] shadow-sm font-black'
              : 'text-[#666666] hover:text-[#171717]'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register</span>
        </button>
      </div>

      {/* 1. SIGN IN FORM */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Email Address / Admin ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="you@email.com or Jerry@786"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#888888] hover:text-[#171717]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
            <span className="flex-shrink mx-2 text-[10px] font-bold text-[#888888] uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#171717] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
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
            <span>Continue with Google</span>
          </button>

          <div className="text-center pt-1">
            <p className="text-xs text-[#666666]">
              New to eBuy-Partner?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className="font-bold text-[#F4511E] hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </form>
      )}

      {/* 2. SIGN UP FORM */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-9 pr-10 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#888888] hover:text-[#171717]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Country / Region
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none cursor-pointer"
            >
              {COUNTRIES_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Email Dispatched Notification */}
          {successMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-2 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#171717] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
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
            <span>Register with Google</span>
          </button>

          <div className="text-center pt-1">
            <p className="text-xs text-[#666666]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="font-bold text-[#F4511E] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
