import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalPaymentConfig } from '../../types';
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe2,
} from 'lucide-react';

export const AdminPaymentSettings: React.FC = () => {
  const { paymentConfig, updatePaymentConfig, showToast } = useApp();
  const [formState, setFormState] = useState<GlobalPaymentConfig>(paymentConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig(formState);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
              USD Settlement Architecture
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
            USD Payment & Wallet Settings (Binance & Crypto)
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Configure global Binance deposit/withdrawal escrow addresses, supported networks, minimum limits, and refund policies. Single currency: USD ($).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFF8F4] border border-[#FF8A3D]/30 text-xs font-bold text-[#171717]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <span>Active Currency: <strong>USD ($)</strong></span>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Binance Deposit Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] text-[#F4511E] flex items-center justify-center font-bold text-base border border-[#FFD7C2]">
                🟡
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Binance Deposit Configuration (USD)
                </h3>
                <p className="text-xs text-[#666666]">
                  Official Binance merchant receiving address and deposit parameters
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formState.binanceDepositEnabled}
                onChange={(e) => setFormState({ ...formState, binanceDepositEnabled: e.target.checked })}
                className="rounded text-[#F4511E] focus:ring-[#F4511E]"
              />
              <span>Enable Binance Deposit</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Binance Deposit Address (USDT/USDC)
              </label>
              <input
                type="text"
                required
                value={formState.binanceDepositAddress}
                onChange={(e) => setFormState({ ...formState, binanceDepositAddress: e.target.value })}
                placeholder="e.g. TQx9JnK8aB5vZ2pL1mW7eR4tY6uI3oP0qS"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Default Deposit Network
              </label>
              <select
                value={formState.binanceDepositNetwork}
                onChange={(e) => setFormState({ ...formState, binanceDepositNetwork: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              >
                {formState.supportedNetworks.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Minimum Deposit ($ USD)
              </label>
              <input
                type="number"
                min={1}
                required
                value={formState.minDeposit}
                onChange={(e) => setFormState({ ...formState, minDeposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Maximum Deposit ($ USD)
              </label>
              <input
                type="number"
                min={100}
                required
                value={formState.maxDeposit}
                onChange={(e) => setFormState({ ...formState, maxDeposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1">
              Binance Deposit Instructions (Shown to Users)
            </label>
            <textarea
              rows={2}
              value={formState.binanceDepositInstructions}
              onChange={(e) => setFormState({ ...formState, binanceDepositInstructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Binance Withdrawal Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base border border-emerald-200">
                💸
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Binance Withdrawal Configuration (USD)
                </h3>
                <p className="text-xs text-[#666666]">
                  Disbursement parameters and automated crypto payout routing
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formState.binanceWithdrawalEnabled}
                onChange={(e) => setFormState({ ...formState, binanceWithdrawalEnabled: e.target.checked })}
                className="rounded text-[#F4511E] focus:ring-[#F4511E]"
              />
              <span>Enable Binance Withdrawal</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Disbursement Liquidity Pool Address
              </label>
              <input
                type="text"
                value={formState.binanceWithdrawalAddress}
                onChange={(e) => setFormState({ ...formState, binanceWithdrawalAddress: e.target.value })}
                placeholder="e.g. TWy8HnJ7bC6wA1qM2nX8fS5uV7tJ4pQ1rT"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Withdrawal Fee ($ USD)
              </label>
              <input
                type="number"
                min={0}
                value={formState.withdrawalFee}
                onChange={(e) => setFormState({ ...formState, withdrawalFee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Minimum Withdrawal ($ USD)
              </label>
              <input
                type="number"
                min={1}
                value={formState.minWithdrawal}
                onChange={(e) => setFormState({ ...formState, minWithdrawal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Maximum Daily Withdrawal ($ USD)
              </label>
              <input
                type="number"
                min={100}
                value={formState.maxWithdrawal}
                onChange={(e) => setFormState({ ...formState, maxWithdrawal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1">
              Binance Withdrawal Instructions
            </label>
            <textarea
              rows={2}
              value={formState.binanceWithdrawalInstructions}
              onChange={(e) => setFormState({ ...formState, binanceWithdrawalInstructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Crypto Networks & Refund Rules */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base border border-blue-200">
                🌐
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Crypto Networks & Refund Policy (USD)
                </h3>
                <p className="text-xs text-[#666666]">
                  Supported blockchain networks and automated escrow return terms
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formState.cryptoEnabled}
                onChange={(e) => setFormState({ ...formState, cryptoEnabled: e.target.checked })}
                className="rounded text-[#F4511E] focus:ring-[#F4511E]"
              />
              <span>Enable Crypto Network Rails</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">
              Supported Networks (Comma separated)
            </label>
            <input
              type="text"
              value={formState.supportedNetworks.join(', ')}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  supportedNetworks: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1">
              Escrow Refund Policy Instructions
            </label>
            <textarea
              rows={2}
              value={formState.refundInstructions}
              onChange={(e) => setFormState({ ...formState, refundInstructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save USD Payment & Wallet Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
