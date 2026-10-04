import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  Copy,
  Check,
  Save,
  Wallet,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  FileText,
  X,
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
    showToast,
    formatCurrency,
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bankTitle, setBankTitle] = useState(currentUser?.name || 'Hamza Malik');
  const [accountNumber, setAccountNumber] = useState('0300 9876543');
  const [payoutRail, setPayoutRail] = useState('JazzCash');
  const [copiedReferral, setCopiedReferral] = useState(false);

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    showToast('Personal information updated.', 'success');
  };

  const handleSaveBankBinding = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Payout account bound successfully!', 'success');
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://ebuy-partner.com/register?ref=${currentUser.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    showToast('Referral invitation link copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
          Member Profile & Asset Overview
        </h1>
        <p className="text-xs text-[#666666] mt-1">
          Manage your payout credentials, inspect asset balances, and tier privileges
        </p>
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
              className="px-3.5 py-2 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] rounded-xl text-xs font-bold border border-[#FFD7C2] transition-colors flex items-center gap-1.5"
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
            <span className="text-[11px] text-[#666666]">From product tasks</span>
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
          {onOpenWithdrawal && (
            <button
              onClick={onOpenWithdrawal}
              className="px-4 py-2.5 bg-white hover:bg-[#FFF8F4] text-[#171717] border border-[#E5E7EB] hover:border-[#F4511E] rounded-xl text-xs font-bold transition-colors"
            >
              Withdraw Funds
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
        </div>
      </section>

      {/* PAYOUT ACCOUNT BINDING */}
      <section className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#171717]">
            Saved Payout Account Binding
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Bind your JazzCash, EasyPaisa, or Bank Account for automated withdrawal processing.
          </p>
        </div>

        <form onSubmit={handleSaveBankBinding} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Payout Channel
              </label>
              <select
                value={payoutRail}
                onChange={(e) => setPayoutRail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              >
                <option value="JazzCash">JazzCash Mobile Account</option>
                <option value="EasyPaisa">EasyPaisa Mobile Account</option>
                <option value="Meezan Bank">Meezan Bank Ltd.</option>
                <option value="Bank Alfalah">Bank Alfalah Ltd.</option>
                <option value="Habib Bank (HBL)">Habib Bank Limited (HBL)</option>
                <option value="Raast">Raast Instant Pay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Account Title (Full Name)
              </label>
              <input
                type="text"
                required
                value={bankTitle}
                onChange={(e) => setBankTitle(e.target.value)}
                placeholder="e.g. Hamza Malik"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Account / Mobile Number
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="0300 9876543"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#F4511E]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#171717] hover:bg-[#333333] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Account Binding</span>
            </button>
          </div>
        </form>
      </section>

      {/* TEAM & REFERRAL LINK */}
      <section className="p-6 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#171717]">
            Team & Referral Commission
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Invite colleagues across Pakistan. Earn bonus commissions on every verified task order completed by your network.
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
              className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#171717] hover:bg-slate-50"
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
              className="px-3.5 py-1.5 bg-[#F4511E] text-white rounded-lg text-xs font-bold hover:bg-[#E5390B]"
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
            className="px-4 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* ACTIVITY & AUDIT LOG */}
      <section className="p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] border border-[#FFD7C2] flex items-center justify-center text-[#F4511E]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              {currentUser.role === 'admin' ? 'Admin Governance Console' : 'Activity & Audit Log'}
            </h3>
            <p className="text-xs text-[#666666]">
              {currentUser.role === 'admin'
                ? 'Manage financial ledger, user assets, and platform settings'
                : 'Inspect personal task rewards, withdrawal proofs, and ledger history'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentUser.role === 'admin') {
              setCurrentView('admin');
            } else {
              setCurrentView('notifications');
            }
          }}
          className="px-5 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-[10px] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>{currentUser.role === 'admin' ? 'Open Admin Console' : 'View Activity Log'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
