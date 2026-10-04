import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const UserLevelsPage: React.FC = () => {
  const { getUserPlans, currentUser, formatCurrency, setCurrentView, openAuthModal, showToast } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const userPlans = getUserPlans();
  const userLevel = currentUser?.level ?? 0;
  const isBasicTrial = userLevel === 0;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] border border-[#FFD7C2] px-2.5 py-0.5 rounded-md">
              USD ($) Unified System
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#171717] mt-1">
            MEMBERSHIP <span className="text-[#F4511E]">TIER DIRECTORY</span>
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Explore the free Basic Trial plan and full Level 1 to Level 10 tier packages in USD ($).
          </p>
          <div className="w-16 h-1 bg-[#F4511E] rounded-full mt-2.5" />
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:bg-[#FFF4ED] text-[#171717] hover:text-[#F4511E] transition-all shadow-2xs cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:bg-[#FFF4ED] text-[#171717] hover:text-[#F4511E] transition-all shadow-2xs cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel View (Left to Right) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 sm:gap-5 overflow-x-auto pb-5 pt-2 px-1 snap-x scrollbar-none"
      >
        {userPlans.map((lvl) => {
          const isPlan0 = lvl.level === 0;
          const isCurrent = lvl.level === userLevel;

          return (
            <div
              key={lvl.level}
              className={`relative flex-shrink-0 w-[260px] sm:w-[290px] bg-[#FFFFFF] rounded-[18px] p-4 sm:p-5 border transition-all duration-200 snap-start flex flex-col justify-between group hover:-translate-y-1 ${
                isCurrent
                  ? 'border-2 border-[#16A34A] bg-[#FFFDFB] shadow-[0_12px_30px_rgba(22,163,74,0.12)] ring-2 ring-[#16A34A]/20'
                  : 'border-[#E5E7EB] shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-[#F4511E]'
              }`}
            >
              {/* Upper Left Number Badge */}
              <div className="absolute -top-2.5 -left-1.5 bg-[#F4511E] text-[#FFFFFF] font-black text-[11px] px-2.5 py-0.5 rounded-br-lg shadow-xs z-10">
                {isPlan0 ? 'TRIAL' : `LVL ${lvl.level}`}
              </div>

              {/* Card Top Information */}
              <div>
                <div className="pt-1.5 flex justify-between items-start">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#666666]">
                      {isPlan0 ? 'BASIC TRIAL' : `TIER ${lvl.level}`}
                    </h4>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#171717] mt-0.5">
                      {lvl.name}
                    </h3>
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-0.5 bg-[#16A34A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Price / Required Amount */}
                <div className="mt-2.5 pb-2.5 border-b border-[#E5E7EB]">
                  <span className="text-[10px] text-[#666666] font-medium uppercase block">
                    {isPlan0 ? 'Trial Deposit Required' : 'Deposit Escrow Price'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#E5390B] font-mono tracking-tight">
                      {formatCurrency(lvl.deposit)}
                    </span>
                  </div>
                </div>

                {/* Commission / Reward Box */}
                <div className="mt-2.5 p-2.5 bg-[#FFF4ED] border border-[#FFD7C2] rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666]">{isPlan0 ? 'Trial Tasks' : 'Daily Tasks'}</span>
                    <span className="font-bold text-[#171717]">{lvl.products} Products</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666]">Per Product</span>
                    <span className="font-bold text-[#16A34A] font-mono">
                      +{formatCurrency(lvl.per_product)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#FFD7C2]">
                    <span className="text-[#171717] font-bold">{isPlan0 ? 'Trial Reward' : 'Daily Potential'}</span>
                    <span className="font-black text-[#F4511E] font-mono">
                      +{formatCurrency(lvl.daily_potential)}
                    </span>
                  </div>
                </div>

                {/* Feature Limits List */}
                <div className="mt-2.5 space-y-1.5 text-[11px] text-[#444444]">
                  {lvl.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#F4511E] shrink-0" />
                      <span className="line-clamp-1">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Choose Level Button */}
              <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                {isPlan0 ? (
                  <div className="w-full h-[42px] rounded-[10px] bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Already Yours</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        openAuthModal('login');
                        showToast('Please sign in or register to activate this plan.', 'info');
                        return;
                      }
                      setCurrentView('plans');
                      window.location.hash = '#plans';
                    }}
                    className="w-full h-[42px] rounded-[10px] bg-[#F4511E] hover:bg-[#E5390B] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{isCurrent ? 'ACTIVE PLAN' : `CHOOSE LEVEL ${lvl.level}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
