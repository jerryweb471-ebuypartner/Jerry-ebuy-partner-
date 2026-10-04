import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserLevel } from '../../types';
import { Modal } from '../common/Modal';
import {
  Upload,
  CheckCircle2,
  Copy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Lock,
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  initialAmount,
}) => {
  const { userPlans, paymentConfig, submitDeposit, formatCurrency, showToast } = useApp();
  const paidPlans = useMemo(() => userPlans.filter((p) => p.level > 0), [userPlans]);

  const [step, setStep] = useState<'select_plan' | 'payment'>('select_plan');
  const [selectedPlan, setSelectedPlan] = useState<UserLevel>(() => paidPlans[0] || userPlans[0]);
  const [amount, setAmount] = useState<number>(() => paidPlans[0]?.requiredDeposit || 500);
  const [network, setNetwork] = useState<string>(paymentConfig.binanceDepositNetwork || 'TRC20 (USDT)');
  const [reference, setReference] = useState<string>(() => `DEP-USD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [cryptoTxHash, setCryptoTxHash] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('select_plan');
      return;
    }
    if (initialAmount && initialAmount > 0) {
      const matched = paidPlans.find((l) => Math.abs(l.requiredDeposit - initialAmount) < 0.01);
      if (matched) {
        setSelectedPlan(matched);
        setAmount(matched.requiredDeposit);
        setStep('payment');
      } else {
        setAmount(initialAmount);
        setStep('payment');
      }
    } else {
      setSelectedPlan(paidPlans[0]);
      setAmount(paidPlans[0]?.requiredDeposit || 500);
      setStep('select_plan');
    }
  }, [isOpen, initialAmount, paidPlans]);

  const scrollToIndex = (idx: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 640 ? 260 : 295;
      scrollContainerRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth',
      });
      setActiveIndex(idx);
    }
  };

  const scrollLeft = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToIndex(nextIdx);
  };

  const scrollRight = () => {
    const nextIdx = Math.min(paidPlans.length - 1, activeIndex + 1);
    scrollToIndex(nextIdx);
  };

  const handleChoosePlan = (lvl: UserLevel) => {
    setSelectedPlan(lvl);
    setAmount(lvl.requiredDeposit);
    setStep('payment');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Binance deposit address copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitDeposit(
        amount,
        'binance',
        reference,
        proofFileName || `binance_receipt_${reference.toLowerCase()}.jpg`,
        network,
        cryptoTxHash
      );
      setIsSubmitting(false);
      setStep('select_plan');
      onClose();
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStep('select_plan');
        onClose();
      }}
      title={step === 'select_plan' ? 'Choose Membership Tier to Deposit' : `Deposit ${formatCurrency(amount)} via Binance / Crypto`}
      subtitle={
        step === 'select_plan'
          ? 'Platform currency: USD ($) · Official Binance & Crypto settlement rails'
          : `Send exact USDT/USDC to the official Binance escrow address on ${network}.`
      }
      maxWidth="3xl"
    >
      {step === 'select_plan' ? (
        <div className="space-y-4 font-sans">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                USD Currency Architecture
              </span>
              <span className="text-xs text-[#666666]">
                All tiers operate exclusively in USD ($)
              </span>
            </div>

            {/* Scroll buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollLeft}
                disabled={activeIndex === 0}
                className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] disabled:opacity-40 flex items-center justify-center text-xs transition-colors shadow-2xs"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                disabled={activeIndex >= paidPlans.length - 1}
                className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] disabled:opacity-40 flex items-center justify-center text-xs transition-colors shadow-2xs"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {paidPlans.map((plan) => {
              const isSelected = selectedPlan.level === plan.level;
              return (
                <div
                  key={plan.level}
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-[260px] sm:w-[285px] shrink-0 snap-start rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'border-[#F4511E] shadow-md ring-2 ring-[#F4511E]/20 -translate-y-0.5 bg-gradient-to-b from-[#FFFDFB] to-white'
                      : 'border-[#E5E7EB] shadow-xs hover:border-[#FF8A3D] hover:shadow-sm'
                  }`}
                >
                  <div className={`h-1.5 w-full ${isSelected ? 'bg-gradient-to-r from-[#F4511E] to-[#FF8A3D]' : 'bg-[#E5E7EB]'}`} />

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]">
                        Level {plan.level}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4511E] text-white">
                          Selected
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#171717] group-hover:text-[#F4511E] transition-colors line-clamp-1">
                        {plan.name}
                      </h4>
                      <p className="text-[11px] text-[#666666]">
                        {plan.dailyProductTasks} Tasks · +{formatCurrency(plan.earningPerProduct)}/task
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFF8F4] border border-[#FFD7C2]">
                      <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
                        Deposit Required
                      </span>
                      <div className="text-xl font-black text-[#E5390B] font-mono mt-0.5">
                        {formatCurrency(plan.requiredDeposit)}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-emerald-900">Daily Potential:</span>
                      <span className="font-black text-[#16A34A] font-mono">
                        +{formatCurrency(plan.dailyTotalEarning)}
                      </span>
                    </div>

                    <ul className="space-y-1 text-xs text-[#666666]">
                      {plan.benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-[#F4511E] shrink-0" />
                          <span className="truncate text-[#171717]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleChoosePlan(plan)}
                      className={`w-full h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#F4511E] text-white shadow-xs'
                          : 'bg-white text-[#F4511E] border border-[#FF8A3D] hover:bg-[#FFF4ED]'
                      }`}
                    >
                      <span>Deposit {formatCurrency(plan.requiredDeposit)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#FFF8F4] rounded-2xl border border-[#FFD7C2] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#171717]">
              <ShieldCheck className="w-5 h-5 text-[#F4511E]" />
              <span className="font-medium">
                All deposits are 100% secured in insured escrow and refundable upon tier cycle completion.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleChoosePlan(selectedPlan)}
              className="px-4 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Continue with Level {selectedPlan.level}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep('select_plan')}
            className="text-xs font-bold text-[#F4511E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to Tier Selection
          </button>

          {/* Deposit Summary Box */}
          <div className="p-4 bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border-2 border-[#FF8A3D]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4511E]">
                Deposit Overview
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#16A34A] text-white">
                USD ($)
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#171717]">
                {selectedPlan.name} (Level {selectedPlan.level})
              </span>
              <span className="text-2xl font-black text-[#E5390B] font-mono">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          {/* Network Selection */}
          <div>
            <label className="block font-bold text-[#171717] mb-1.5">
              Select Blockchain Network (USDT / USDC)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentConfig.supportedNetworks.map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => setNetwork(net)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all cursor-pointer ${
                    network === net
                      ? 'bg-[#F4511E] text-white border-[#F4511E] shadow-2xs'
                      : 'bg-white text-[#171717] border-[#E5E7EB] hover:border-[#F4511E]'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Binance Deposit Address Box */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-bold text-xs">
                  🟡
                </div>
                <div>
                  <h4 className="font-bold text-[#171717]">Official Binance Deposit Address</h4>
                  <p className="text-[11px] text-[#666666]">Network: {network}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified Escrow
              </span>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-[#E5E7EB]">
              <input
                type="text"
                readOnly
                value={paymentConfig.binanceDepositAddress}
                className="flex-1 bg-transparent font-mono text-xs font-bold text-[#171717] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(paymentConfig.binanceDepositAddress)}
                className="px-3 py-1.5 rounded-lg bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#666666] leading-relaxed">
              {paymentConfig.binanceDepositInstructions}
            </p>
          </div>

          {/* Reference & Transaction Hash Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Blockchain TX Hash / TxID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={cryptoTxHash}
                onChange={(e) => setCryptoTxHash(e.target.value)}
                placeholder="e.g. 0x7f9a... or TRC20 TxID"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                System Reference Tracking ID
              </label>
              <input
                type="text"
                readOnly
                value={reference}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 font-mono text-xs text-[#666666] select-all"
              />
            </div>
          </div>

          {/* Proof Upload */}
          <div>
            <label className="block font-bold text-[#171717] mb-1">
              Upload Transfer Screenshot / Receipt
            </label>
            <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#F4511E] rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-white">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="deposit-proof-file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProofFileName(e.target.files[0].name);
                  }
                }}
              />
              <label htmlFor="deposit-proof-file" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-[#F4511E]" />
                <span className="text-xs font-semibold text-[#171717]">
                  {proofFileName ? proofFileName : 'Click to attach Binance transaction screenshot or receipt'}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep('select_plan')}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[#171717] hover:bg-slate-50 font-bold transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !cryptoTxHash.trim()}
              className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white font-bold transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting Verification...</span>
              ) : (
                <>
                  <span>Submit Deposit for Verification ({formatCurrency(amount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
