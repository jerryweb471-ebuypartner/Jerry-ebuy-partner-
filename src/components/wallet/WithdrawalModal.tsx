import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit?: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
}) => {
  const {
    userWallet,
    submitWithdrawal,
    currentUser,
    paymentConfig,
    formatCurrency,
  } = useApp();

  const isLevelZero = (currentUser?.level ?? 0) === 0;

  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [amount, setAmount] = useState<number>(() => {
    return Math.max(10, Math.min(userWallet.availableBalance, 500));
  });
  const [method, setMethod] = useState<'binance' | 'crypto'>('binance');
  const [cryptoNetwork, setCryptoNetwork] = useState<string>(paymentConfig.binanceWithdrawalNetwork || 'TRC20 (USDT)');
  const [walletAddress, setWalletAddress] = useState('');
  const [memoOrTag, setMemoOrTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minWithdrawal = paymentConfig.minWithdrawal || 10;
  const maxAllowed = userWallet.availableBalance;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLevelZero) return;
    if (amount < minWithdrawal || amount > maxAllowed) return;
    if (!walletAddress.trim()) return;
    setStep('confirm');
  };

  const handleFinalSubmit = async () => {
    if (isLevelZero) return;
    setIsSubmitting(true);
    try {
      const res = await submitWithdrawal(amount, method, {
        cryptoNetwork,
        walletAddress: walletAddress.trim(),
        memoOrTag: memoOrTag.trim() || undefined,
      });
      setIsSubmitting(false);
      if (res.success) {
        setStep('input');
        onClose();
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStep('input');
        onClose();
      }}
      title={step === 'input' ? 'Withdraw Balance (USD)' : 'Confirm Binance / Crypto Payout'}
      subtitle={
        step === 'input'
          ? 'Fast automated payout to your Binance Pay account or crypto wallet address.'
          : 'Please verify all destination details before final disbursement submission.'
      }
      maxWidth="md"
    >
      {isLevelZero ? (
        <div className="space-y-5 py-2 font-sans">
          {/* Locked State Warning for Level 0 */}
          <div className="bg-[#FFF4ED] rounded-2xl p-5 border-2 border-[#FF8A3D]/40 text-[#171717] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4511E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#E5390B]">
                  Withdrawal unavailable. You must achieve Level 1 first.
                </h3>
                <span className="text-xs text-[#666666]">
                  Basic Plan — Starter Trial Active
                </span>
              </div>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed">
              Your Basic Plan trial reward of <strong className="text-[#16A34A] font-bold">{formatCurrency(userWallet?.availableBalance ?? 0)}</strong> is safely stored in your wallet balance. To unlock withdrawals and initiate daily merchant operations, upgrade to <strong className="text-[#171717] font-bold">Level 1</strong>.
            </p>

            <div className="bg-white p-3.5 rounded-xl border border-[#FFD7C2] text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[#666666]">Your Current Balance:</span>
                <span className="font-bold text-[#16A34A] font-mono text-sm">{formatCurrency(userWallet?.availableBalance ?? 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666666]">Level 1 Activation:</span>
                <span className="font-bold text-[#F4511E] font-mono">Unlock Instant Payouts</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDeposit) onOpenDeposit();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Level 1 & Unlock Withdrawals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : step === 'input' ? (
        <form onSubmit={handleProceedToConfirm} className="space-y-4 text-xs font-sans">
          {/* Available Balance Box */}
          <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#FFD7C2] flex items-center justify-between">
            <div>
              <span className="text-[#666666] font-semibold block text-[11px]">Available Balance</span>
              <span className="text-2xl font-black text-[#16A34A] font-mono mt-0.5 block">
                {formatCurrency(userWallet.availableBalance)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white font-bold bg-[#F4511E] px-2 py-0.5 rounded-md">
                Level {currentUser?.level} Active
              </span>
              <span className="text-[11px] text-[#666666] block mt-1">
                Min. Withdrawal: {formatCurrency(minWithdrawal)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-[#171717] mb-1.5">
              Withdrawal Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('binance')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  method === 'binance'
                    ? 'bg-[#F4511E] text-white border-[#F4511E] shadow-2xs'
                    : 'bg-white text-[#171717] border-[#E5E7EB] hover:border-[#F4511E]'
                }`}
              >
                <span>🟡 Binance Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('crypto')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  method === 'crypto'
                    ? 'bg-[#F4511E] text-white border-[#F4511E] shadow-2xs'
                    : 'bg-white text-[#171717] border-[#E5E7EB] hover:border-[#F4511E]'
                }`}
              >
                <span>🌐 Crypto Wallet</span>
              </button>
            </div>
          </div>

          {/* Network Selection */}
          <div>
            <label className="block font-bold text-[#171717] mb-1.5">
              Blockchain Network
            </label>
            <select
              value={cryptoNetwork}
              onChange={(e) => setCryptoNetwork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold text-[#171717] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            >
              {(paymentConfig.supportedNetworks || ['TRC20 (USDT)', 'BEP20 (USDT)', 'ERC20 (USDT)']).map((net) => (
                <option key={net} value={net}>
                  {net}
                </option>
              ))}
            </select>
          </div>

          {/* Wallet Address Input */}
          <div>
            <label className="block font-bold text-[#171717] mb-1">
              {method === 'binance' ? 'Binance Pay ID / Crypto Wallet Address' : 'Recipient Crypto Wallet Address'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="e.g. TQx9Jn... or 0x8F9a... or Binance Pay ID"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          {/* Memo / Tag */}
          <div>
            <label className="block font-bold text-[#171717] mb-1">
              Memo / Tag (Optional)
            </label>
            <input
              type="text"
              value={memoOrTag}
              onChange={(e) => setMemoOrTag(e.target.value)}
              placeholder="e.g. 1029481 (if required by your exchange)"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-[#171717]">
                Withdrawal Amount ($ USD) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAmount(userWallet.availableBalance)}
                className="text-xs text-[#F4511E] hover:underline font-bold"
              >
                Max ({formatCurrency(userWallet.availableBalance)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-black text-[#666666]">$</span>
              <input
                type="number"
                min={minWithdrawal}
                max={userWallet.availableBalance}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] font-mono font-bold text-sm text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          {/* Payout note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-[#E5E7EB] text-[11px] text-[#666666] leading-relaxed">
            {paymentConfig.binanceWithdrawalInstructions}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={amount < minWithdrawal || amount > userWallet.availableBalance || !walletAddress.trim()}
            className="w-full h-11 font-bold text-white bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] disabled:opacity-40 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Review & Confirm Payout ({formatCurrency(amount)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* Confirmation Screen */
        <div className="space-y-4 text-xs font-sans">
          <div className="p-4 bg-[#FFF8F4] rounded-2xl border border-[#FFD7C2] space-y-3">
            <h4 className="font-extrabold text-[#171717] text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F4511E]" />
              <span>Verify Payout Parameters</span>
            </h4>

            <div className="divide-y divide-[#E5E7EB] text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-[#666666]">Method:</span>
                <span className="font-bold text-[#171717]">{method === 'binance' ? 'Binance Pay' : 'Crypto Wallet'}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#666666]">Network:</span>
                <span className="font-bold text-[#171717]">{cryptoNetwork}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#666666]">Destination Address:</span>
                <span className="font-mono font-bold text-[#171717] text-[11px] break-all">{walletAddress}</span>
              </div>
              {memoOrTag && (
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Memo / Tag:</span>
                  <span className="font-mono font-bold text-[#171717]">{memoOrTag}</span>
                </div>
              )}
              <div className="py-2 flex justify-between">
                <span className="text-[#666666]">Withdrawal Amount:</span>
                <span className="font-mono font-black text-sm text-[#16A34A]">{formatCurrency(amount)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#666666]">Network Processing Fee:</span>
                <span className="font-mono font-bold text-[#171717]">$0.00 (Zero Fee)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="font-bold text-[#171717]">Net Disbursement:</span>
                <span className="font-mono font-black text-base text-[#E5390B]">{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[#171717] hover:bg-slate-50 font-bold transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Broadcasting Payout...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Submit Withdrawal</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
