import React from 'react';
import { UserLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Zap, Lock, Check, Sparkles } from 'lucide-react';

interface LevelDetailsModalProps {
  level: UserLevel | null;
  currentLevel: number;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (levelNumber: number) => void;
  onOpenDeposit: (amount: number) => void;
}

export const LevelDetailsModal: React.FC<LevelDetailsModalProps> = ({
  level,
  currentLevel,
  isOpen,
  onClose,
  onUpgrade,
  onOpenDeposit,
}) => {
  const { getUserPlans, formatCurrency, currentUser, openAuthModal, showToast } = useApp();
  if (!isOpen || !level) return null;

  const userPlans = getUserPlans();
  const planData = userPlans.find((p) => p.level === level.level) || {
    ...level,
    deposit: level.requiredDeposit,
    per_product: level.earningPerProduct,
    daily_potential: level.dailyTotalEarning,
    products: level.dailyProductTasks,
  };

  const isCurrent = level.level === currentLevel;
  const isPast = level.level < currentLevel;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-5 pt-20 sm:pt-24 pb-16">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E5E7EB] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FFF4ED]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4511E] text-white flex items-center justify-center font-black text-base shadow-sm">
              L{level.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#171717]">{level.name}</h3>
                {isCurrent && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white">
                    Active Tier
                  </span>
                )}
              </div>
              <p className="text-xs text-[#666666] flex items-center gap-1 mt-0.5">
                <span>USD ($) · Binance / Crypto Escrow</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Financial Specifications Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFF8F4] p-3.5 rounded-xl border border-[#FFD7C2]">
              <span className="text-xs font-medium text-[#666666] block">Required Deposit Price</span>
              <span className="text-lg font-black text-[#E5390B] block mt-0.5 font-mono">
                {formatCurrency(planData.deposit)}
              </span>
              <span className="text-[11px] text-[#666666]">100% Refund Escrow</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E5E7EB]">
              <span className="text-xs font-medium text-[#666666] block">Daily Product Tasks</span>
              <span className="text-lg font-bold text-[#F4511E] block mt-0.5">
                {planData.products} Products
              </span>
              <span className="text-[11px] text-[#666666]">Add to cart quota</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E5E7EB]">
              <span className="text-xs font-medium text-[#666666] block">Reward Per Product</span>
              <span className="text-lg font-bold text-[#16A34A] block mt-0.5 font-mono">
                +{formatCurrency(planData.per_product)}
              </span>
              <span className="text-[11px] text-[#666666]">Instant wallet credit</span>
            </div>

            <div className="bg-[#FFF8F4] p-3.5 rounded-xl border border-[#FFD7C2]">
              <span className="text-xs font-medium text-[#666666] block">Daily Potential Earning</span>
              <span className="text-lg font-black text-[#16A34A] block mt-0.5 font-mono">
                +{formatCurrency(planData.daily_potential)}
              </span>
              <span className="text-[11px] text-[#666666]">Full task completion</span>
            </div>
          </div>

          {/* Benefits List */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-3">
              Tier Capabilities & Privileges
            </h4>
            <div className="space-y-2">
              {level.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#555555]">
                  <Check className="w-4 h-4 text-[#F4511E] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Policy Notice */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4" />
              <span>Capital Preservation Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your security deposit of {formatCurrency(planData.deposit)} remains held in escrow and is completely refundable upon tier expiration or approved account closure.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:bg-slate-100 text-xs font-bold text-[#171717] transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isCurrent && !isPast && (
            <button
              onClick={() => {
                if (!currentUser) {
                  onClose();
                  openAuthModal('login');
                  showToast('Please sign in or register to activate this plan.', 'info');
                  return;
                }
                onClose();
                onOpenDeposit(planData.deposit);
              }}
              className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl bg-[#F4511E] hover:bg-[#E5390B] text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <span>Deposit {formatCurrency(planData.deposit)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isCurrent && (
            <div className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Currently Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
