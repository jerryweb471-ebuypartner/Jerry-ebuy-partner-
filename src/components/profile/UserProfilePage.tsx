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
} from 'lucide-react';

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
    paymentConfig,
    logout,
    showToast,
    formatCurrency,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // In-Page Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<'binance' | 'crypto' | 'bank_transfer'>('crypto');
  const [cryptoNetwork, setCryptoNetwork] = useState<string>('TRC20 (USDT)');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [accountTitle, setAccountTitle] = useState<string>(currentUser?.name || '');
  const [memoTag, setMemoTag] = useState<string>('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  if (!currentUser) return null;

  // Filter user's specific withdrawals
  const userWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    showToast('Personal information updated.', 'success');
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://ebuy-partner.com/register?ref=${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    showToast('Referral invitation link copied to clipboard.', 'info');
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
            Member Profile & Account Overview
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage your account assets, submit withdrawals, and track disbursement status
          </p>
        </div>

        <button
          onClick={logout}
          className="self-start sm:self-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          title="Sign out of your session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* MEMBER ASSET CARD */}
      <section className="bg-white rounded-[18px] border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-6">
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FFD7C2]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#171717]">{currentUser.name}</h2>
                <span className="text-[11px] font-bold text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                  LVL {currentUser.level}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {currentUser.countryFlag} {currentUser.country || 'Verified'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#666666] mt-0.5">
                <span className="font-mono">ID: {currentUser.id}</span>
                <span>·</span>
                <span>{currentLevelConfig?.name}</span>
                <span>·</span>
                <span>Joined {currentUser.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLevelForModal(currentLevelConfig)}
              className="px-3.5 py-2 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] rounded-xl text-xs font-bold border border-[#FFD7C2] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspect Tier Benefits</span>
            </button>
          </div>
        </div>

        {/* Financial Assets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#FFF8F4] p-3.5 rounded-xl border border-[#FFD7C2]/70">
            <span className="text-xs text-[#666666] font-medium block">Available Balance</span>
            <span className="text-lg sm:text-xl font-black text-[#E5390B] mt-1 block font-mono">
              {formatCurrency(userWallet?.availableBalance ?? 0)}
            </span>
            <span className="text-[11px] text-[#16A34A] font-semibold">Ready for withdrawal</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-[#E5E7EB]">
            <span className="text-xs text-[#666666] font-medium block">Total Commission</span>
            <span className="text-lg sm:text-xl font-black text-[#16A34A] mt-1 block font-mono">
              {formatCurrency(userWallet?.totalCommission ?? 0)}
            </span>
            <span className="text-[11px] text-[#666666]">From product ratings</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-[#E5E7EB]">
            <span className="text-xs text-[#666666] font-medium block">Total Withdrawn</span>
            <span className="text-lg sm:text-xl font-bold text-[#171717] mt-1 block font-mono">
              {formatCurrency(userWallet?.totalWithdrawn ?? 0)}
            </span>
            <span className="text-[11px] text-[#666666]">100% Disbursed</span>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-[#E5E7EB]">
            <span className="text-xs text-[#666666] font-medium block">Total Deposited</span>
            <span className="text-lg sm:text-xl font-bold text-[#171717] mt-1 block font-mono">
              {formatCurrency(userWallet?.totalDeposited ?? 0)}
            </span>
            <span className="text-[11px] text-[#666666]">Account Capital</span>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="px-4 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Deposit & Select Plan
            </button>
          )}
          <button
            onClick={() => setCurrentView('tasks')}
            className="px-4 py-2.5 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-colors"
          >
            Daily Tasks Hub
          </button>
          <button
            onClick={() => setCurrentView('ranking')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#171717] rounded-xl text-xs font-bold transition-colors"
          >
            National Ranking
          </button>
          <button
            onClick={() => setCurrentView('company_docs')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#171717] border border-[#E5E7EB] rounded-xl text-xs font-bold transition-colors"
          >
            Company Docs & License
          </button>
        </div>
      </section>

      {/* 1. SUBMIT WITHDRAWAL FORM */}
      <section className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-[#F4511E]" />
              <span>Withdraw Funds</span>
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Submit a disbursement request to your TRC20, ERC20, Binance Pay, or Bank account
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#888888] block">Available to Withdraw</span>
            <span className="text-sm font-mono font-black text-[#E5390B]">
              {formatCurrency(userWallet?.availableBalance ?? 0)}
            </span>
          </div>
        </div>

        <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Withdrawal Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#666666]">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Min $10.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>
              <p className="text-[10px] text-[#888888] mt-1">Minimum payout: $10.00 USD • 0% fee</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Payout Method
              </label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              >
                <option value="crypto">USDT (Crypto Wallet)</option>
                <option value="binance">Binance Pay ID</option>
                <option value="bank_transfer">Bank Transfer / Wire</option>
              </select>
            </div>

            {withdrawMethod === 'crypto' && (
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Crypto Network
                </label>
                <select
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
                >
                  <option value="TRC20 (USDT)">TRC20 (Tron Network - Instant)</option>
                  <option value="BEP20 (USDT)">BEP20 (BNB Smart Chain)</option>
                  <option value="ERC20 (USDT)">ERC20 (Ethereum)</option>
                  <option value="Polygon (USDT)">Polygon (MATIC)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {withdrawMethod === 'crypto'
                  ? 'Recipient Wallet Address'
                  : withdrawMethod === 'binance'
                  ? 'Binance Pay ID / UID'
                  : 'Account / IBAN Number'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  withdrawMethod === 'crypto'
                    ? 'e.g. Txyz... (TRC20 Address)'
                    : withdrawMethod === 'binance'
                    ? 'e.g. 198273641'
                    : 'Account / IBAN'
                }
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Account Title / Beneficial Owner
              </label>
              <input
                type="text"
                required
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="Full Name as per ID"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              />
            </div>

            {withdrawMethod === 'crypto' && (
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Memo / Destination Tag (Optional)
                </label>
                <input
                  type="text"
                  value={memoTag}
                  onChange={(e) => setMemoTag(e.target.value)}
                  placeholder="Only if required by your exchange"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#666666] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Escrow Disbursement</span>
            </span>

            <button
              type="submit"
              disabled={isSubmittingWithdrawal}
              className="px-5 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingWithdrawal ? 'Submitting...' : 'Submit Withdrawal Request'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. WITHDRAWAL REQUESTS & HISTORY LEDGER */}
      <section className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F4511E]" />
              <span>Withdrawal Requests & Disbursement Status</span>
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Live updates on payout approvals, blockchain receipts, and administrative notes
            </p>
          </div>
          <span className="text-xs font-semibold text-[#888888]">
            {userWithdrawals.length} Total Requests
          </span>
        </div>

        {userWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#888888] bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
            <p>No withdrawal requests submitted yet.</p>
            <p className="text-[11px] mt-1">Submit your first payout request using the form above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userWithdrawals.map((w) => {
              const isPending = w.status === 'pending';
              const isCompleted = w.status === 'completed';
              const isRejected = w.status === 'rejected';

              return (
                <div
                  key={w.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isRejected
                      ? 'bg-rose-50/40 border-rose-200'
                      : isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-[#FFFDFB] border-[#FFD7C2]/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#171717]">{w.id}</span>
                      <span className="text-[11px] text-[#666666]">·</span>
                      <span className="text-xs font-semibold text-[#555555]">{w.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-black text-[#171717]">
                        {formatCurrency(w.amount)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        }`}
                      >
                        {isCompleted ? 'Approved & Paid' : isRejected ? 'Rejected' : 'Pending Review'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555555] pt-1">
                    <div>
                      <span className="text-[10px] text-[#888888] block">Payout Method & Network:</span>
                      <span className="font-semibold text-[#171717]">
                        {w.method.toUpperCase()} ({w.accountInfo.cryptoNetwork || 'TRC20'})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#888888] block">Recipient Wallet / Account:</span>
                      <span className="font-mono font-semibold text-[#171717] truncate block" title={w.accountInfo.walletAddress}>
                        {w.accountInfo.walletAddress}
                      </span>
                    </div>
                  </div>

                  {/* ADMIN REVIEW NOTE (Displayed prominently on Rejection or Note) */}
                  {isRejected && (
                    <div className="p-3 bg-white rounded-lg border border-rose-300 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Admin Review Note (Jerry@786):</span>
                      </div>
                      <p className="text-[#333333] leading-relaxed">
                        {w.rejectionReason || 'Withdrawal verification requirements not met. Please review account details.'}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                        ✓ Balance of {formatCurrency(w.amount)} has been automatically refunded to your available balance.
                      </p>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Disbursement approved and completed by administrator. Funds sent to destination.</span>
                    </div>
                  )}

                  {isPending && (
                    <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Your request is queued for audit & blockchain payout authorization by admin Jerry@786.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TEAM & REFERRAL LINK */}
      <section className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#171717]">
            Team & Referral Commission
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Invite partners globally. Earn bonus commissions on every verified task order completed by your network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#666666] font-medium block">Your Referral Code</span>
              <span className="text-base font-mono font-bold text-[#171717]">{currentUser.referralCode}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUser.referralCode);
                showToast('Referral code copied!', 'info');
              }}
              className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#171717] hover:bg-slate-50 cursor-pointer"
            >
              Copy Code
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#666666] font-medium block">Direct Invitation Link</span>
              <span className="text-xs text-[#F4511E] font-medium truncate max-w-[180px] block">
                ebuy-partner.com/register?ref={currentUser.referralCode}
              </span>
            </div>
            <button
              onClick={handleCopyReferral}
              className="px-3.5 py-1.5 bg-[#F4511E] text-white rounded-lg text-xs font-bold hover:bg-[#E5390B] cursor-pointer"
            >
              {copiedReferral ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </section>

      {/* Personal Info Edit Form */}
      <form onSubmit={handleSaveProfile} className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#171717]">Personal Information</h2>
          <p className="text-xs text-[#666666] mt-0.5">Update your display name and contact phone number.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* ACTIVITY & AUDIT LOG + LOGOUT FOOTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] border border-[#FFD7C2] flex items-center justify-center text-[#F4511E]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Activity & Audit Log
              </h3>
              <p className="text-[11px] text-[#666666]">
                Inspect rewards, earnings & settlement ledger
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('notifications')}
            className="px-4 py-2 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Activity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        <section className="p-5 bg-white rounded-[18px] border border-rose-200 shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                Sign Out of Account
              </h3>
              <p className="text-[11px] text-[#666666]">
                End current active session securely
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Sign Out</span>
          </button>
        </section>
      </div>
    </div>
  );
};
