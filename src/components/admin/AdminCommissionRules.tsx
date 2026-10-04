import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommissionRule } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminCommissionRules: React.FC = () => {
  const { commissionRules, saveCommissionRule, deleteCommissionRule } = useApp();

  const [editingRule, setEditingRule] = useState<Partial<CommissionRule> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingRule({
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      type: 'category',
      value: 8.0,
      isActive: true,
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !editingRule.name) return;
    saveCommissionRule(editingRule as CommissionRule);
    setIsModalOpen(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Commission & Reward Engine Rules ({commissionRules.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Define automated percentage allocations, category margins, and promotional bonus multipliers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Commission Rule</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Rule Identifier</th>
                <th className="px-6 py-3.5">Rule Name</th>
                <th className="px-6 py-3.5">Rule Type</th>
                <th className="px-6 py-3.5">Target Scope</th>
                <th className="px-6 py-3.5">Rate / Value</th>
                <th className="px-6 py-3.5">Active Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {commissionRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    {rule.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {rule.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-700">
                    {rule.type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {rule.targetCategory || (rule.targetLevel ? `Tier ${rule.targetLevel}` : 'Global')}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-700 font-mono tabular-nums text-sm">
                    +{rule.value}%
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => saveCommissionRule({ ...rule, isActive: !rule.isActive })}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        rule.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingRule({ ...rule });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="Edit rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCommissionRule(rule.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingRule && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Configure Commission Rule"
          subtitle="Formulate automated merchandise reward criteria."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={editingRule.name || ''}
                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rule Type</label>
                <select
                  value={editingRule.type || 'percentage'}
                  onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="percentage">Standard Percentage</option>
                  <option value="category">Category-Specific</option>
                  <option value="level_tier">User Tier Modifier</option>
                  <option value="promotional">Promotional Bonus</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingRule.value ?? 5.0}
                  onChange={(e) => setEditingRule({ ...editingRule, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            {editingRule.type === 'category' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Category</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Audio & Electronics"
                  value={editingRule.targetCategory || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, targetCategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={editingRule.description || ''}
                onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                Save Rule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
