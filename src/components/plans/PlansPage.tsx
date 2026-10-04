import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserLevel } from '../../types';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface PlansPageProps {
  onOpenDepositForPlan?: (amount: number) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onOpenDepositForPlan }) => {
  const {
    currentUser,
    userPlans,
    upgradeUserToLevel,
    formatCurrency,
    setCurrentView,
    openAuthModal,
    showToast,
  } = useApp();

  const currentLevelNum = currentUser?.level ?? 0;
  const isBasicTrial = currentLevelNum === 0;

  const [selectedPlanLevel, setSelectedPlanLevel] = useState<number>(currentLevelNum === 0 ? 1 : currentLevelNum);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleChoosePlan = (plan: UserLevel) => {
    if (plan.level === 0) return; // Basic Trial is already owned
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please sign in or register to activate this plan.', 'info');
      return;
    }
    setSelectedPlanLevel(plan.level);
    if (onOpenDepositForPlan) {
      onOpenDepositForPlan(plan.requiredDeposit);
    } else {
      upgradeUserToLevel(plan.level);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto font-sans">
      {/* Header Banner - Professional White + Orange Theme */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-9 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFF4ED] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#F4511E]" />
            <span>USD Membership Tier Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Select Your Membership Plan & Deposit
          </h1>

          <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
            All tier prices, product earnings, and daily potential dividends operate exclusively in <strong>United States Dollars ($ USD)</strong> with automated Binance & Crypto settlement.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF8F4] border border-[#FF8A3D]/30 text-xs font-bold text-[#171717] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4511E]" />
              <span>Platform Currency: <strong>USD ($)</strong></span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#171717] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Current Status: <strong>{currentLevelNum === 0 ? 'Basic Trial (Active)' : `Level ${currentLevelNum}`}</strong></span>
            </div>

            <button
              onClick={() => {
                setCurrentView('company_docs');
                window.location.hash = '#company_docs';
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#FF8A3D] text-[#F4511E] hover:bg-[#FFF4ED] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Official License & Documents</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION HEADER & CAROUSEL CONTROLS */}
      <div className="bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border-2 border-[#FF8A3D]/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-white px-2 py-0.5 rounded-md border border-[#FF8A3D]/30">
              OFFICIAL TIERS
            </span>
            <span className="text-xs font-semibold text-[#666666]">
              Basic Trial → Level 1 to Level 10
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#171717] mt-0.5">
            Partner Membership Levels (USD)
          </h2>
          <p className="text-xs text-[#666666]">
            Transparent security deposit tiers with guaranteed per-task rewards and insured escrow refund guarantees:
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] text-[#171717] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] text-[#171717] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL OF PLAN CARDS: Basic Trial -> Level 1 to Level 10 */}
      <div
        ref={carouselRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {userPlans.map((plan) => {
          const isPlan0 = plan.level === 0;
          const isCurrent = plan.level === currentLevelNum;
          const isSelected = plan.level === selectedPlanLevel;
          const isUserOwnedTrial = isPlan0 && isBasicTrial;

          return (
            <div
              key={plan.level}
              onClick={() => !isPlan0 && setSelectedPlanLevel(plan.level)}
              className={`w-[260px] sm:w-[295px] shrink-0 snap-start rounded-[18px] bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                isCurrent
                  ? 'border-[#16A34A] shadow-[0_12px_30px_rgba(22,163,74,0.12)] ring-2 ring-[#16A34A]/20'
                  : isSelected
                  ? 'border-[#F4511E] shadow-[0_14px_35px_rgba(244,81,30,0.18)] ring-2 ring-[#F4511E]/20 -translate-y-1 bg-gradient-to-b from-[#FFFDFB] to-white'
                  : 'border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-[#FF8A3D] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)]'
              }`}
            >
              {/* Top Stripe Accent */}
              <div
                className={`h-1.5 w-full ${
                  isCurrent
                    ? 'bg-[#16A34A]'
                    : isSelected
                    ? 'bg-gradient-to-r from-[#F4511E] via-[#FF6D00] to-[#FF8A3D]'
                    : isPlan0
                    ? 'bg-[#FF8A3D]'
                    : 'bg-[#E5E7EB]'
                }`}
              />

              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isPlan0
                        ? 'bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]'
                        : 'bg-gray-100 text-[#171717]'
                    }`}
                  >
                    {isPlan0 ? 'Basic Trial' : `Level ${plan.level}`}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                      Current Plan
                    </span>
                  )}
                  {isSelected && !isCurrent && !isPlan0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4511E] text-white">
                      Selected
                    </span>
                  )}
                </div>

                {/* Plan Name */}
                <div>
                  <h3 className="text-base font-extrabold text-[#171717] group-hover:text-[#F4511E] transition-colors line-clamp-1">
                    {plan.name}
                  </h3>
                  {isUserOwnedTrial && (
                    <p className="text-[11px] text-[#16A34A] font-bold mt-0.5">
                      You already have this plan
                    </p>
                  )}
                  {!isPlan0 && (
                    <p className="text-[11px] text-[#666666]">
                      Security Deposit Required
                    </p>
                  )}
                </div>

                {/* Pricing Box (Strictly USD - NO Master PKR) */}
                <div className="p-3 rounded-xl bg-[#FFF8F4] border border-[#FFD7C2]">
                  <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
                    {isPlan0 ? 'Trial Deposit' : 'Deposit Price'}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#E5390B] font-mono mt-0.5">
                    {formatCurrency(plan.requiredDeposit)}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#666666] block font-medium">
                      {isPlan0 ? 'Trial Tasks' : 'Daily Tasks'}
                    </span>
                    <span className="text-xs font-extrabold text-[#171717]">{plan.dailyProductTasks} Tasks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#666666] block font-medium">Per Product</span>
                    <span className="text-xs font-extrabold text-[#16A34A] font-mono">
                      +{formatCurrency(plan.earningPerProduct)}
                    </span>
                  </div>
                </div>

                {/* Daily Potential Box */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-emerald-900">
                    {isPlan0 ? 'Total Trial Reward:' : 'Daily Potential:'}
                  </span>
                  <span className="font-black text-[#16A34A] font-mono text-sm">
                    +{formatCurrency(plan.dailyTotalEarning)}
                  </span>
                </div>

                {/* Benefits list */}
                <ul className="space-y-1.5 text-xs text-[#666666] pt-1">
                  {plan.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#F4511E] shrink-0 mt-0.5" />
                      <span className="text-[11px] text-[#171717] line-clamp-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action Button */}
              <div className="p-4 sm:p-5 pt-0">
                {isPlan0 ? (
                  <div className="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-[#16A34A] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Already Yours (Active)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleChoosePlan(plan)}
                    className={`w-full h-10 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                      isCurrent
                        ? 'bg-gray-100 text-[#171717] hover:bg-gray-200'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] text-white hover:from-[#E5390B] hover:to-[#F4511E] shadow-[0_4px_12px_rgba(244,81,30,0.25)]'
                        : 'bg-white text-[#F4511E] border border-[#FF8A3D] hover:bg-[#FFF4ED]'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Plan' : `CHOOSE LEVEL ${plan.level}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card & Escrow Guarantee */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center shrink-0 border border-[#FF8A3D]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#171717]">100% Guaranteed Escrow Refund Policy</h4>
            <p className="text-xs text-[#666666] mt-0.5 max-w-xl">
              All deposits are securely held in regulated blockchain escrow and 100% refundable upon tier cycle completion. Instant automated settlement in <strong>USD ($)</strong> via Binance Pay and Crypto.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const chosen = userPlans.find((l) => l.level === selectedPlanLevel && l.level > 0) || userPlans[1];
            handleChoosePlan(chosen);
          }}
          className="px-6 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] rounded-xl transition-all shadow-[0_4px_15px_rgba(244,81,30,0.3)] shrink-0 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <CreditCard className="w-4 h-4" />
          <span>Proceed with Level {selectedPlanLevel > 0 ? selectedPlanLevel : 1} Deposit ({formatCurrency(userPlans.find((l) => l.level === (selectedPlanLevel > 0 ? selectedPlanLevel : 1))?.requiredDeposit || 500)})</span>
        </button>
      </div>
    </div>
  );
};
