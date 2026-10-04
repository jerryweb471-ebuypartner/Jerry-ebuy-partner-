import React from 'react';
import { X, Trophy, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LevelZeroAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedAmount: number;
  type: 'quota_reached' | 'withdrawal_locked';
  onDepositUpgrade: () => void;
  onViewTasks?: () => void;
}

export const LevelZeroAlertModal: React.FC<LevelZeroAlertModalProps> = ({
  isOpen,
  onClose,
  earnedAmount,
  type,
  onDepositUpgrade,
  onViewTasks,
}) => {
  const { formatCurrency, userLevels } = useApp();
  if (!isOpen) return null;

  const isQuota = type === 'quota_reached';
  const level1 = userLevels.find((l) => l.level === 1);
  const depositReq = level1?.requiredDeposit ?? 20;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-5 pt-20 sm:pt-24 pb-16">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div
          className={`p-6 text-center relative ${
            isQuota
              ? 'bg-gradient-to-b from-[#FFF4ED] to-white'
              : 'bg-gradient-to-b from-amber-50 to-white'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-3 ${
              isQuota
                ? 'bg-[#F4511E] text-white shadow-[#F4511E]/20'
                : 'bg-amber-500 text-white shadow-amber-200'
            }`}
          >
            {isQuota ? <Trophy className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            {isQuota ? 'All 4 Daily Tasks Completed!' : 'Withdrawal Requires Level 1'}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {isQuota
              ? 'You have successfully added 4 products to cart for today.'
              : 'Level 0 Basic Trial tier does not permit balance withdrawal.'}
          </p>
        </div>

        {/* Amount Box */}
        <div className="px-6 py-2">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium">Your Current Earnings Balance</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {formatCurrency(earnedAmount ?? 0)}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              100% Secured in Escrow (USD)
            </span>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-6 space-y-4 pt-4">
          <div className="bg-orange-50/60 rounded-xl p-3.5 border border-orange-100 text-xs text-orange-950 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-orange-900">
              <CheckCircle2 className="w-4 h-4 text-[#F4511E]" />
              How to Withdraw Your {formatCurrency(earnedAmount ?? 0)}:
            </div>
            <p className="leading-relaxed text-slate-700">
              To withdraw your balance and activate daily recurring payouts, upgrade to{' '}
              <strong className="text-[#F4511E]">Level 1 (Bronze Member)</strong> with a deposit of{' '}
              <strong className="text-slate-900 font-bold">{formatCurrency(depositReq)}</strong>.
            </p>
          </div>

          {/* Level 1 Benefits preview */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-600 uppercase tracking-wider text-[11px] block">
              Level 1 (Bronze) Perks:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Daily Tasks</span>
                <span className="font-bold text-slate-900 text-sm">3 Products</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Reward / Item</span>
                <span className="font-bold text-[#F4511E] text-sm">+{formatCurrency(0.50)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block text-[11px]">Daily Potential</span>
                <span className="font-bold text-emerald-600 text-sm">+{formatCurrency(1.50)} / day</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-700 block text-[11px]">Withdrawals</span>
                <span className="font-bold text-emerald-800 text-sm">Instant (Unlocked)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors text-center cursor-pointer"
          >
            I'll Upgrade Later
          </button>
          <button
            onClick={() => {
              onClose();
              onDepositUpgrade();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Deposit {formatCurrency(depositReq)} & Unlock Level 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
