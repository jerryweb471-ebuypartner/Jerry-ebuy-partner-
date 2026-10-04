import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserLevel } from '../../types';
import { Edit2, Award, Check, Sparkles, Layers } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminLevels: React.FC = () => {
  const { userLevels, saveUserLevel, formatCurrency } = useApp();
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;
    saveUserLevel(editingLevel);
    setEditingLevel(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-md border border-[#FFD7C2]">
              USD Membership Matrix
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717] mt-1">
            Membership Tiers (Basic Trial & Levels 1–10)
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Configure required USD deposits, per-product task rewards, task limits, and maximum daily withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF8F4] px-3 py-1.5 rounded-xl border border-[#FFD7C2]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <span className="text-xs font-bold text-[#171717]">Currency: <strong>USD ($)</strong></span>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {userLevels.map((lvl) => {
          const isPlan0 = lvl.level === 0;
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
                      <span className="text-[10px] text-[#666666]">{isPlan0 ? 'Basic Trial (Free)' : `Level ${lvl.level} Paid Tier`}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingLevel({ ...lvl })}
                    className="p-1.5 text-[#666666] hover:text-[#F4511E] hover:bg-[#FFF4ED] rounded-lg transition-colors border border-[#E5E7EB] cursor-pointer"
                    title="Configure Tier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-3.5 space-y-2 text-xs">
                  {/* Deposit */}
                  <div className="p-2.5 rounded-xl bg-[#FFF8F4] border border-[#FFD7C2]">
                    <div className="flex justify-between items-baseline text-[#666666]">
                      <span className="text-[10px] font-bold uppercase">Required Deposit:</span>
                      <span className="font-black text-[#E5390B] font-mono text-sm">
                        {formatCurrency(lvl.requiredDeposit)}
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
                      <span className="font-bold text-[#16A34A] font-mono">+{formatCurrency(lvl.earningPerProduct)}</span>
                    </div>
                  </div>

                  {/* Daily Potential */}
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
                    <span className="text-[10px] font-bold text-emerald-900">Daily Potential:</span>
                    <span className="font-black text-[#16A34A] font-mono">+{formatCurrency(lvl.dailyTotalEarning)}</span>
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
                  onClick={() => setEditingLevel({ ...lvl })}
                  className="text-[#F4511E] hover:underline font-bold"
                >
                  Edit Tier Parameters
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Level Modal */}
      {editingLevel && (
        <Modal
          isOpen={true}
          onClose={() => setEditingLevel(null)}
          title={`Edit ${editingLevel.name} (Level ${editingLevel.level})`}
          subtitle="Configure tier security deposit and earning potentials in USD ($)."
          maxWidth="md"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Deposit ($ USD)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={editingLevel.requiredDeposit}
                  onChange={(e) => setEditingLevel({ ...editingLevel, requiredDeposit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Daily Tasks</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={editingLevel.dailyProductTasks}
                  onChange={(e) => setEditingLevel({ ...editingLevel, dailyProductTasks: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Reward Per Product ($ USD)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={editingLevel.earningPerProduct}
                  onChange={(e) => setEditingLevel({ ...editingLevel, earningPerProduct: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Daily Potential ($ USD)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={editingLevel.dailyTotalEarning}
                  onChange={(e) => setEditingLevel({ ...editingLevel, dailyTotalEarning: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#171717]">
                <input
                  type="checkbox"
                  checked={editingLevel.canWithdraw}
                  onChange={(e) => setEditingLevel({ ...editingLevel, canWithdraw: e.target.checked })}
                  className="rounded text-[#F4511E] focus:ring-[#F4511E]"
                />
                <span>Allow Balance Withdrawals</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingLevel(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] font-bold text-[#171717] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl shadow-xs"
              >
                Save Tier Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
