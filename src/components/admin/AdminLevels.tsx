import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserLevel } from '../../types';
import { Edit2, Award, Check, Sparkles, Layers, Globe2, Flag } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminLevels: React.FC = () => {
  const { userLevels, saveUserLevel, formatCurrency } = useApp();
  const [selectedCurrencyView, setSelectedCurrencyView] = useState<'USD' | 'PKR'>('USD');
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);

  const formatPkr = (amt?: number) => {
    const val = Number(amt) || 0;
    return `₨ ${val.toLocaleString()}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;

    // Calculate fallback PKR if not filled
    const pkrDeposit = editingLevel.pkrRequiredDeposit !== undefined
      ? editingLevel.pkrRequiredDeposit
      : editingLevel.requiredDeposit * 280;
    const pkrPerProduct = editingLevel.pkrEarningPerProduct !== undefined
      ? editingLevel.pkrEarningPerProduct
      : editingLevel.earningPerProduct * 280;
    const pkrDaily = editingLevel.pkrDailyTotalEarning !== undefined
      ? editingLevel.pkrDailyTotalEarning
      : editingLevel.dailyTotalEarning * 280;

    const payload: UserLevel = {
      ...editingLevel,
      pkrRequiredDeposit: Number(pkrDeposit),
      pkrEarningPerProduct: Number(pkrPerProduct),
      pkrDailyTotalEarning: Number(pkrDaily),
    };

    saveUserLevel(payload);
    setEditingLevel(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-md border border-[#FFD7C2]">
              Multi-Currency Membership Matrix
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717] mt-1">
            Membership Tier Pricing (USD & Pakistan PKR)
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Configure required security deposits, per-product task rewards, and daily earning potential for International (USD) and Pakistan (PKR) partners.
          </p>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedCurrencyView('USD')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCurrencyView === 'USD'
                ? 'bg-white text-[#171717] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-[#171717]'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Global USD ($)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCurrencyView('PKR')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCurrencyView === 'PKR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-[#171717]'
            }`}
          >
            <span className="text-sm">🇵🇰</span>
            <span>Pakistan (PKR / ₨)</span>
          </button>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {userLevels.map((lvl) => {
          const isPlan0 = lvl.level === 0;
          const isPkr = selectedCurrencyView === 'PKR';

          const depositDisplay = isPkr
            ? formatPkr(lvl.pkrRequiredDeposit ?? lvl.requiredDeposit * 280)
            : formatCurrency(lvl.requiredDeposit);

          const perProductDisplay = isPkr
            ? `+${formatPkr(lvl.pkrEarningPerProduct ?? lvl.earningPerProduct * 280)}`
            : `+${formatCurrency(lvl.earningPerProduct)}`;

          const dailyPotentialDisplay = isPkr
            ? `+${formatPkr(lvl.pkrDailyTotalEarning ?? lvl.dailyTotalEarning * 280)}`
            : `+${formatCurrency(lvl.dailyTotalEarning)}`;

          return (
            <div
              key={lvl.level}
              className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] hover:border-[#FF8A3D] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#FFF4ED] border border-[#FFD7C2] text-[#F4511E] font-black flex items-center justify-center font-mono text-xs">
                      {isPlan0 ? 'T' : `L${lvl.level}`}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-[#171717] line-clamp-1">{lvl.name}</h3>
                      <span className="text-[10px] text-[#666666]">
                        {isPlan0 ? 'Basic Trial (Free)' : `Level ${lvl.level} Paid Tier`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingLevel({
                        ...lvl,
                        pkrRequiredDeposit: lvl.pkrRequiredDeposit ?? lvl.requiredDeposit * 280,
                        pkrEarningPerProduct: lvl.pkrEarningPerProduct ?? lvl.earningPerProduct * 280,
                        pkrDailyTotalEarning: lvl.pkrDailyTotalEarning ?? lvl.dailyTotalEarning * 280,
                      })
                    }
                    className="p-1.5 text-[#666666] hover:text-[#F4511E] hover:bg-[#FFF4ED] rounded-lg transition-colors border border-[#E5E7EB] cursor-pointer"
                    title="Configure Tier & Prices"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-3.5 space-y-2 text-xs">
                  {/* Deposit */}
                  <div className={`p-2.5 rounded-xl border ${isPkr ? 'bg-emerald-50/50 border-emerald-200' : 'bg-[#FFF8F4] border-[#FFD7C2]'}`}>
                    <div className="flex justify-between items-baseline text-[#666666]">
                      <span className="text-[10px] font-bold uppercase">
                        {isPkr ? 'Required Deposit (PKR):' : 'Required Deposit (USD):'}
                      </span>
                      <span className={`font-black font-mono text-sm ${isPkr ? 'text-emerald-700' : 'text-[#E5390B]'}`}>
                        {depositDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Tasks & Reward */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#666666] block">Daily Tasks</span>
                      <span className="font-bold text-[#171717] font-mono">{lvl.dailyProductTasks} Tasks</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#666666] block">Per Product</span>
                      <span className="font-bold text-[#16A34A] font-mono">{perProductDisplay}</span>
                    </div>
                  </div>

                  {/* Daily Potential */}
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-bold text-emerald-900">Daily Potential:</span>
                    <span className="font-black text-[#16A34A] font-mono">{dailyPotentialDisplay}</span>
                  </div>

                  {/* Withdrawal Status */}
                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-[#666666]">Withdrawal:</span>
                    <span className={`font-bold ${lvl.canWithdraw ? 'text-[#16A34A]' : 'text-rose-500'}`}>
                      {lvl.canWithdraw ? 'Unlocked' : 'Locked (Trial)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#666666]">
                <span>Commission: <strong>{lvl.commissionRatePercent}%</strong></span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingLevel({
                      ...lvl,
                      pkrRequiredDeposit: lvl.pkrRequiredDeposit ?? lvl.requiredDeposit * 280,
                      pkrEarningPerProduct: lvl.pkrEarningPerProduct ?? lvl.earningPerProduct * 280,
                      pkrDailyTotalEarning: lvl.pkrDailyTotalEarning ?? lvl.dailyTotalEarning * 280,
                    })
                  }
                  className="text-[#F4511E] hover:underline font-bold cursor-pointer"
                >
                  Edit USD & PKR Prices
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Level Modal (USD & Pakistan PKR Dual Configuration) */}
      {editingLevel && (
        <Modal
          isOpen={true}
          onClose={() => setEditingLevel(null)}
          title={`Edit ${editingLevel.name} (Level ${editingLevel.level})`}
          subtitle="Configure tier security deposit and earning potentials for both Global USD ($) and Pakistan (PKR / ₨)."
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-[#171717] mb-1">Tier Name</label>
              <input
                type="text"
                required
                value={editingLevel.name}
                onChange={(e) => setEditingLevel({ ...editingLevel, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            {/* Section 1: Global USD ($) Pricing */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F4] border border-[#FFD7C2] space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>Global USD ($) Pricing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Required Deposit ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.requiredDeposit}
                    onChange={(e) => setEditingLevel({ ...editingLevel, requiredDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Reward / Product ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.earningPerProduct}
                    onChange={(e) => setEditingLevel({ ...editingLevel, earningPerProduct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Daily Potential ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.dailyTotalEarning}
                    onChange={(e) => setEditingLevel({ ...editingLevel, dailyTotalEarning: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pakistan PKR (₨) Pricing */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                  <span className="text-base">🇵🇰</span>
                  <span>Pakistan Specific Pricing (PKR / ₨)</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Shown to Pakistani Partners
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Deposit (PKR ₨)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.pkrRequiredDeposit ?? editingLevel.requiredDeposit * 280}
                    onChange={(e) => setEditingLevel({ ...editingLevel, pkrRequiredDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Reward / Product (PKR ₨)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.pkrEarningPerProduct ?? editingLevel.earningPerProduct * 280}
                    onChange={(e) => setEditingLevel({ ...editingLevel, pkrEarningPerProduct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#666666] mb-1">Daily Potential (PKR ₨)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={editingLevel.pkrDailyTotalEarning ?? editingLevel.dailyTotalEarning * 280}
                    onChange={(e) => setEditingLevel({ ...editingLevel, pkrDailyTotalEarning: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Tasks & Commission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Daily Product Task Quota</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={editingLevel.dailyProductTasks}
                  onChange={(e) => setEditingLevel({ ...editingLevel, dailyProductTasks: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={editingLevel.commissionRatePercent}
                  onChange={(e) => setEditingLevel({ ...editingLevel, commissionRatePercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#171717]">
                <input
                  type="checkbox"
                  checked={editingLevel.canWithdraw}
                  onChange={(e) => setEditingLevel({ ...editingLevel, canWithdraw: e.target.checked })}
                  className="rounded text-[#F4511E] focus:ring-[#F4511E]"
                />
                <span>Allow Instant Balance Withdrawals</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setEditingLevel(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] font-bold text-[#171717] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save USD & PKR Tier Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
