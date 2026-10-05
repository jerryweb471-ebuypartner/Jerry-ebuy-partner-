import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  ShieldCheck,
  Save,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  XCircle,
  AlertCircle,
  LogOut,
  ArrowDownLeft,
  DollarSign,
  Send,
  HelpCircle,
  Mail,
  Copy,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { auth, sendEmailVerification, getActionCodeSettings } from '../../firebase';

interface UserProfilePageProps {
  onOpenDeposit?: () => void;
  onOpenWithdrawal?: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onOpenDeposit,
  onOpenWithdrawal,
}) => {
  const {
    currentUser,
    userWallet,
    currentLevelConfig,
    setSelectedLevelForModal,
    setCurrentView,
    updateUserProfile,
    withdrawals,
    submitWithdrawal,
    logout,
    showToast,
    formatCurrency,
    openAuthModal,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Modals / Status views
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Withdrawal form fields
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<'binance' | 'crypto' | 'bank_transfer'>('crypto');
  const [cryptoNetwork, setCryptoNetwork] = useState<string>('TRC20 (USDT)');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [accountTitle, setAccountTitle] = useState<string>(currentUser?.name || '');
  const [memoTag, setMemoTag] = useState<string>('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Email verification resend state
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const userWithdrawals = currentUser ? withdrawals.filter((w) => w.userId === currentUser.id) : [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please sign in to update your personal details.', 'info');
      return;
    }
    updateUserProfile({ name, phone });
    showToast('Personal information updated.', 'success');
  };

  const handleCopyReferral = () => {
    if (!currentUser) {
      openAuthModal('register');
      showToast('Please register or sign in to obtain your referral invitation link.', 'info');
      return;
    }
    navigator.clipboard.writeText(`https://ebuy-partner.shop/register?ref=${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    showToast('Referral invitation link copied to clipboard.', 'info');
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser || !currentUser) {
      openAuthModal('login');
      showToast('Please sign in to resend verification email.', 'info');
      return;
    }
    setIsSendingVerification(true);
    try {
      const actionCodeSettings = getActionCodeSettings();
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      showToast(`Verification link sent to ${currentUser.email}! Check your inbox & spam.`, 'success');
    } catch (err: any) {
      try {
        await sendEmailVerification(auth.currentUser);
        showToast(`Verification email dispatched to ${currentUser.email}!`, 'success');
      } catch (fallbackErr: any) {
        showToast(fallbackErr?.message || 'Failed to send verification email.', 'error');
      }
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please sign in to submit a withdrawal request.', 'info');
      return;
    }

    const numAmount = parseFloat(withdrawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid withdrawal amount.', 'error');
      return;
    }

    if (!walletAddress.trim()) {
      showToast('Please provide your recipient wallet address / account number.', 'error');
      return;
    }

    setIsSubmittingWithdrawal(true);
    const result = await submitWithdrawal(numAmount, withdrawMethod, {
      accountTitle: accountTitle.trim() || currentUser.name,
      walletAddress: walletAddress.trim(),
      cryptoNetwork: withdrawMethod === 'bank_transfer' ? 'Local Banking' : cryptoNetwork,
      memoOrTag: memoTag.trim() || undefined,
    });

    setIsSubmittingWithdrawal(false);

    if (result.success) {
      setWithdrawAmount('');
      setWalletAddress('');
      setMemoTag('');
      setShowWithdrawModal(false);
      setShowStatusModal(true);
    }
  };

  // =========================================================================
  // GUEST / UNAUTHENTICATED STATE VIEW
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="space-y-5 pb-20 max-w-4xl mx-auto font-sans">
        {/* 1. GUEST BANNER / ACTION CALLOUT */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-[#F4511E] shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-[#171717] flex items-center gap-2">
                <span>Guest Account & Unauthenticated Session</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold uppercase">
                  Login Required
                </span>
              </h4>
              <p className="text-xs text-[#555555] mt-0.5">
                Sign in or register to activate your personal dashboard, track rating commissions, and execute instant USD ($) withdrawals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl bg-[#F4511E] hover:bg-[#E5390B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#171717] border border-amber-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#F4511E]" />
              <span>Register Free</span>
            </button>
          </div>
        </div>

        {/* 2. GUEST USER PROFILE & EMPTY BALANCES CARD (Light Gray Background) */}
        <section className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-5 sm:p-7 shadow-sm space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-400 shadow-2xs flex-shrink-0">
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">Guest User</h1>
                  <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    Not Logged In
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                    <span>🌐</span>
                    <span>International Guest</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#64748B] flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>guest@ebuy-partner.shop</span>
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#64748B] pt-0.5">
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[11px] text-[#94A3B8]">Active Plan:</span>
                    <strong className="text-[#0F172A] font-extrabold">No Plan Active</strong>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs font-mono">
                    <span className="text-[11px] text-[#94A3B8]">User ID:</span>
                    <strong className="text-slate-400 font-bold">GUEST-SESSION</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Access Plan</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Sections (Guest Mode) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#F4511E]" />
                <h2 className="text-xs font-black text-[#334155] uppercase tracking-wider">
                  Account Overview & Balances ($ USD)
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                Locked (Guest Mode)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4.5">
              {/* Box 1: Withdrawable Balance */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                    <span className="text-base leading-none">💰</span>
                    <span className="uppercase tracking-wider">Withdrawable Balance</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-400 mt-2 block font-mono">
                    $0.00
                  </span>
                </div>
                <span className="text-[10px] text-amber-600 font-bold mt-2 block">
                  ● Sign in to view balance
                </span>
              </div>

              {/* Box 2: Total Invested Amount */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                      <span className="text-base leading-none">📈</span>
                      <span className="uppercase tracking-wider">Invested Amount</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      Level 0
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-400 mt-2 block font-mono">
                    $0.00
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] font-semibold mt-2 block">
                  Basic Trial ($0 Deposit)
                </span>
              </div>

              {/* Box 3: 1 Product Cart Commission */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                    <span className="text-base leading-none">🛒</span>
                    <span className="uppercase tracking-wider">1 Product Cart Reward</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#F4511E] mt-2 block font-mono">
                    +$20.00
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] font-semibold mt-2 block">
                  Per 1 product added to cart & rated
                </span>
              </div>

              {/* Box 4: Total Commission Earned */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                    <span className="text-base leading-none">💎</span>
                    <span className="uppercase tracking-wider">Total Commission Earned</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-400 mt-2 block font-mono">
                    $0.00
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] font-semibold mt-2 block">
                  Sign in to view earnings
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WITHDRAWAL ACTION SECTION (GUEST CLICK TRIGGERS AUTH) */}
        <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownLeft className="w-5 h-5 text-[#F4511E]" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#171717]">
                Withdraw Funds & Settlement
              </h3>
              <p className="text-xs text-[#666666]">
                Request balance payout or inspect your live disbursement approval status in USD ($).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                openAuthModal('login');
                showToast('Please sign in to withdraw your earnings.', 'info');
              }}
              className="py-3.5 px-4 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Withdraw Funds</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                openAuthModal('login');
                showToast('Please sign in to inspect withdrawal status.', 'info');
              }}
              className="py-3.5 px-4 bg-white hover:bg-gray-50 text-[#171717] border border-[#D1D5DB] rounded-xl font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Withdrawal Status (0)</span>
            </button>
          </div>
        </section>

        {/* 4. PERSONAL INFORMATION (GUEST PLACEHOLDER) */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#F4511E]" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60">
            <div>
              <label className="block text-xs font-bold text-[#666666] mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value="Guest Member"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs bg-slate-100 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#666666] mb-1">Phone Number</label>
              <input
                type="text"
                disabled
                value="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs bg-slate-100 font-semibold"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Update Personal Details & Referral Links</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED USER STATE VIEW
  // =========================================================================
  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto font-sans">
      {/* UNIFIED PROFESSIONAL USER PROFILE & BALANCES CARD (Light Gray Background) */}
      <section className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-5 sm:p-7 shadow-sm space-y-6">
        {/* Top Profile Header: Avatar, Name + Level Badge, Gmail, Status, Credit Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#F4511E]/30 shadow-xs flex-shrink-0 bg-white"
            />
            <div className="space-y-1.5">
              {/* Row 1: Bold Name + Level badge + Status */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">{currentUser.name}</h1>
                <span className="text-xs font-black text-[#F4511E] bg-[#FFF4ED] px-3 py-0.5 rounded-full border border-[#FFD7C2] shadow-2xs">
                  Level {currentUser.level}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    currentUser.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentUser.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>Status: {currentUser.status === 'active' ? 'Active' : 'Deactive'}</span>
                </span>
              </div>

              {/* Row 2: Gmail (in clear font) */}
              <p className="text-xs sm:text-sm font-semibold text-[#475569] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{currentUser.email}</span>
              </p>

              {/* Row 3: Credit Score, Active Plan & User ID */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-[#64748B] pt-0.5">
                {/* Credit Score Badge */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4511E]" />
                  <span className="text-[11px] text-[#64748B]">Credit Score:</span>
                  <strong className="text-[#0F172A] font-black font-mono">
                    {currentUser.creditScore ?? 100}/100
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-bold">● High</span>
                </div>

                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[11px] text-[#94A3B8]">Active Plan:</span>
                  <strong className="text-[#0F172A] font-extrabold">{currentLevelConfig?.name || 'Basic Trial'}</strong>
                </div>

                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0] shadow-2xs font-mono">
                  <span className="text-[11px] text-[#94A3B8]">ID:</span>
                  <strong className="text-[#0F172A] font-bold">{currentUser.id}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Benefits Button */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setSelectedLevelForModal(currentLevelConfig)}
              className="px-4 py-2.5 bg-white hover:bg-[#FFF4ED] text-[#F4511E] rounded-xl text-xs font-bold border border-[#FFD7C2] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:border-[#F4511E]"
            >
              <Sparkles className="w-4 h-4 text-[#F4511E]" />
              <span>Plan Benefits</span>
            </button>
          </div>
        </div>

        {/* Financial Balances & Account Overview: Exactly 4 Boxes in 2 Rows x 2 Columns with Emojis & Gray Borders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#F4511E]" />
              <h2 className="text-xs font-black text-[#334155] uppercase tracking-wider">
                Account Overview & Balances ($ USD)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              USD ($) Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4.5">
            {/* Box 1: Withdrawable Balance (Top Left) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                  <span className="text-base leading-none">💰</span>
                  <span className="uppercase tracking-wider">Withdrawable Balance</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#E5390B] mt-2 font-mono">
                  {formatCurrency(userWallet?.availableBalance ?? 0)}
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                <span>●</span>
                <span>Ready for Instant Withdrawal</span>
              </span>
            </div>

            {/* Box 2: Total Invested Amount + Level Badge (Top Right) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                    <span className="text-base leading-none">📈</span>
                    <span className="uppercase tracking-wider">Invested Amount</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]">
                    Level {currentUser.level}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] mt-2 font-mono">
                  {formatCurrency(userWallet?.totalDeposited ?? (currentLevelConfig?.requiredDeposit ?? 0))}
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#64748B] font-semibold mt-2 block">
                {currentLevelConfig?.name || 'Active Tier'} Security Deposit
              </span>
            </div>

            {/* Box 3: 1 Product Cart Commission (Bottom Left) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                  <span className="text-base leading-none">🛒</span>
                  <span className="uppercase tracking-wider">1 Product Cart Reward</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F4511E] mt-2 font-mono">
                  +{formatCurrency(currentLevelConfig?.earningPerProduct ?? 20)}
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#64748B] font-semibold mt-2 block">
                Per 1 product added to cart & rated
              </span>
            </div>

            {/* Box 4: Total Commission Earned (Bottom Right) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                  <span className="text-base leading-none">💎</span>
                  <span className="uppercase tracking-wider">Total Commission Earned</span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600 mt-2 font-mono">
                  +{formatCurrency(userWallet?.totalCommission ?? 0)}
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold mt-2 block">
                Earned from verified cart evaluations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMPLIFIED WITHDRAWAL ACTION SECTION (EXACTLY 2 BUTTONS) */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ArrowDownLeft className="w-5 h-5 text-[#F4511E]" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#171717]">
              Withdraw Funds & Settlement
            </h3>
            <p className="text-xs text-[#666666]">
              Request balance payout or inspect your live disbursement approval status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Button 1: Withdraw Funds */}
          <button
            type="button"
            onClick={() => {
              if (onOpenWithdrawal) {
                onOpenWithdrawal();
              } else {
                setShowWithdrawModal(true);
              }
            }}
            className="py-3.5 px-4 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Withdraw Funds</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Button 2: Withdrawal Status */}
          <button
            type="button"
            onClick={() => setShowStatusModal(true)}
            className="py-3.5 px-4 bg-white hover:bg-gray-50 text-[#171717] border border-[#D1D5DB] rounded-xl font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-gray-600" />
            <span>Withdrawal Status ({userWithdrawals.length})</span>
          </button>
        </div>
      </section>

      {/* 4. PERSONAL PROFILE & REFERRAL INVITATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#F4511E]" />
            <span>Personal Information</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#666666] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#666666] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Personal Information</span>
            </button>
          </form>
        </div>

        {/* Referral Invitation Link */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4511E]" />
              <span>Referral Program</span>
            </h3>
            <p className="text-xs text-[#666666] mt-1 leading-relaxed">
              Invite prospective merchant rating specialists using your unique link and earn multi-tier revenue dividends on their task completions.
            </p>
            <div className="mt-3 p-3 bg-[#FFF8F4] rounded-xl border border-[#FFD7C2] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Your Referral Code:</span>
                <span className="font-black text-[#F4511E] font-mono">{currentUser.referralCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Commission Share:</span>
                <span className="font-bold text-emerald-600">Up to 15% Multi-Tier</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyReferral}
            className="w-full py-2.5 bg-white hover:bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedReferral ? 'Copied to Clipboard!' : 'Copy Referral Invitation Link'}</span>
          </button>
        </div>
      </div>

      {/* Account Security & Sign Out (Clean Bottom Section) */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Account Security & Session</h4>
            <p className="text-[11px] text-gray-500">256-bit AES crypto encryption active across all active wallet channels.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            showToast('You have been signed out safely.', 'info');
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Request Withdrawal</h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="50.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Available for withdrawal: <strong className="text-emerald-600">{formatCurrency(userWallet?.availableBalance ?? 0)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e: any) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                >
                  <option value="crypto">Crypto (USDT TRC20 / BEP20)</option>
                  <option value="binance">Binance Pay (Instant ID)</option>
                  <option value="bank_transfer">Local Banking Wire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Recipient Address / Account / Binance ID
                </label>
                <input
                  type="text"
                  required
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="e.g. TRC20 address or Binance ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWithdrawal}
                  className="flex-1 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {isSubmittingWithdrawal ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAWAL STATUS MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F4511E]" />
                <h3 className="text-base font-bold text-gray-900">Live Withdrawal Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {userWithdrawals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold">No withdrawal requests submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userWithdrawals.map((w) => (
                  <div key={w.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 font-mono">{w.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-mono font-bold">{formatCurrency(w.amount)}</span>
                      <span className="text-[11px] text-gray-500">{w.method.toUpperCase()} ({w.createdAt})</span>
                    </div>
                    {w.rejectionReason && (
                      <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                        Admin Note: {w.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
