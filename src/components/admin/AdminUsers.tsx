import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserStatus } from '../../types';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Edit2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wallet,
  Plus,
  Minus,
  Sparkles,
  KeyRound,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminUsers: React.FC = () => {
  const {
    users,
    wallets,
    orders,
    updateUserStatus,
    updateUserLevel,
    adminUpdateUserAssets,
    userLevels,
    formatCurrency,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Asset Control Modal State
  const [assetControlUser, setAssetControlUser] = useState<User | null>(null);
  const [balanceAdjustmentAmount, setBalanceAdjustmentAmount] = useState<string>('');
  const [balanceAdjustmentType, setBalanceAdjustmentType] = useState<'add' | 'deduct' | 'set'>('add');
  const [targetLevel, setTargetLevel] = useState<number>(1);
  const [targetStatus, setTargetStatus] = useState<UserStatus>('active');
  const [targetCreditScore, setTargetCreditScore] = useState<number>(100);
  const [newPassword, setNewPassword] = useState<string>('');
  const [auditNote, setAuditNote] = useState<string>('');

  const filteredUsers = users.filter((u) => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      const matchCountry = (u.country || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchCountry) return false;
    }
    return true;
  });

  const handleOpenAssetControl = (user: User) => {
    setAssetControlUser(user);
    setTargetLevel(user.level ?? 1);
    setTargetStatus(user.status);
    setTargetCreditScore(user.creditScore ?? 100);
    setBalanceAdjustmentAmount('');
    setBalanceAdjustmentType('add');
    setNewPassword('');
    setAuditNote('Administrative ledger balance update.');
  };

  const handleSaveAssetControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetControlUser) return;

    const userWallet = wallets[assetControlUser.id] || {
      userId: assetControlUser.id,
      availableBalance: 0,
      pendingBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalCommission: 0,
    };

    let newBalance = userWallet.availableBalance;
    const numAmount = parseFloat(balanceAdjustmentAmount);

    if (!isNaN(numAmount) && numAmount > 0) {
      if (balanceAdjustmentType === 'add') {
        newBalance += numAmount;
      } else if (balanceAdjustmentType === 'deduct') {
        newBalance = Math.max(0, newBalance - numAmount);
      } else if (balanceAdjustmentType === 'set') {
        newBalance = numAmount;
      }
    }

    adminUpdateUserAssets(assetControlUser.id, {
      availableBalance: newBalance,
      level: targetLevel,
      status: targetStatus,
      creditScore: targetCreditScore,
      newPassword: newPassword.trim() || undefined,
      auditNote: auditNote || 'Administrative balance adjustment',
    });

    showToast(`Client ${assetControlUser.name} assets & level updated successfully!`, 'success');
    setAssetControlUser(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Client & Merchant Directory ({users.length})
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Oversee registered client country origins, control available balances, adjust level tiers (0–10), and govern accounts.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ID, or country..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#F4511E] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF4ED]/60 border-b border-[#E5E7EB] text-[#666666] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Client & ID</th>
                <th className="px-5 py-3.5">Country & Region</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Credit Score</th>
                <th className="px-5 py-3.5">Level Tier</th>
                <th className="px-5 py-3.5">Available Balance</th>
                <th className="px-5 py-3.5">Orders</th>
                <th className="px-5 py-3.5 text-right">Asset Control & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-sans">
              {filteredUsers.map((user, idx) => {
                const userWallet = wallets[user.id];
                const userOrdersList = orders.filter((o) => o.userId === user.id);
                const isActive = user.status === 'active';
                const isSuspended = user.status === 'suspended';

                return (
                  <tr key={`${user.id}-${idx}`} className="hover:bg-[#FFF8F4]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-[#E5E7EB] shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#171717]">{user.name}</p>
                          <p className="text-[11px] text-[#666666] font-mono mt-0.5">
                            {user.email} · <span className="text-[#F4511E] font-semibold">{user.id}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{user.countryFlag || '🌐'}</span>
                        <div>
                          <p className="font-semibold text-[#171717]">{user.country || 'Global / USA'}</p>
                          <p className="text-[10px] text-[#666666] font-mono">{user.currency || 'USD'} ({user.currencySymbol || '$'})</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive
                              ? 'bg-[#16A34A]'
                              : isSuspended
                              ? 'bg-rose-600'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize font-bold text-[#171717]">
                          {user.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        <Shield className="w-3 h-3 text-[#F4511E]" />
                        <span>{user.creditScore ?? 100}/100</span>
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={user.level}
                        onChange={(e) => updateUserLevel(user.id, Number(e.target.value))}
                        className="px-2 py-1 text-xs rounded-lg border border-[#E5E7EB] bg-white font-mono cursor-pointer font-bold text-[#F4511E]"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            Level {lvl}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4 font-bold text-[#171717] font-mono tabular-nums">
                      {formatCurrency(userWallet ? userWallet.availableBalance : 0)}
                    </td>

                    <td className="px-5 py-4 text-[#666666] font-mono tabular-nums">
                      {userOrdersList.length} tasks
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAssetControl(user)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Manage Assets</span>
                        </button>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#171717] hover:bg-slate-100 border border-[#E5E7EB] rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Control Modal (Balance, Level 0-10, Status, Password) */}
      {assetControlUser && (
        <Modal
          isOpen={Boolean(assetControlUser)}
          onClose={() => setAssetControlUser(null)}
          title={`Asset & Tier Control: ${assetControlUser.name}`}
          subtitle={`Account ID: ${assetControlUser.id} · Registered Country: ${assetControlUser.countryFlag || ''} ${assetControlUser.country || 'Global'}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveAssetControl} className="space-y-4 text-xs font-sans">
            {/* Current Balance Overview */}
            <div className="p-3.5 rounded-xl bg-[#FFF4ED] border border-[#FFD7C2] flex items-center justify-between">
              <div>
                <span className="text-[#666666] block">Current Available Balance:</span>
                <span className="text-lg font-black text-[#E5390B] font-mono">
                  {formatCurrency(wallets[assetControlUser.id]?.availableBalance || 0)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#666666] block">Current Tier:</span>
                <span className="text-sm font-bold text-[#171717] font-mono">
                  Level {assetControlUser.level}
                </span>
              </div>
            </div>

            {/* Balance Adjustment Section */}
            <div>
              <label className="block font-bold text-[#171717] mb-1.5">
                Adjust Client Wallet Balance
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setBalanceAdjustmentType('add')}
                  className={`py-1.5 rounded-lg border font-bold transition-colors ${
                    balanceAdjustmentType === 'add'
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-white text-[#666666] border-[#E5E7EB]'
                  }`}
                >
                  + Add Balance
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceAdjustmentType('deduct')}
                  className={`py-1.5 rounded-lg border font-bold transition-colors ${
                    balanceAdjustmentType === 'deduct'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-[#666666] border-[#E5E7EB]'
                  }`}
                >
                  - Deduct Balance
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceAdjustmentType('set')}
                  className={`py-1.5 rounded-lg border font-bold transition-colors ${
                    balanceAdjustmentType === 'set'
                      ? 'bg-[#F4511E] text-white border-[#F4511E]'
                      : 'bg-white text-[#666666] border-[#E5E7EB]'
                  }`}
                >
                  Set Fixed Total
                </button>
              </div>

              <input
                type="number"
                step="any"
                min="0"
                value={balanceAdjustmentAmount}
                onChange={(e) => setBalanceAdjustmentAmount(e.target.value)}
                placeholder="Enter amount to modify (e.g. 5000)..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-sm focus:ring-2 focus:ring-[#F4511E]"
              />
            </div>

            {/* Level Selector, Status & Credit Score */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Set Level (0–10)</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold text-[#F4511E]"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Account Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-medium"
                >
                  <option value="active">Active</option>
                  <option value="pending_verification">Pending</option>
                  <option value="suspended">Deactive/Suspended</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Credit Score (0–100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={targetCreditScore}
                  onChange={(e) => setTargetCreditScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold font-mono text-[#171717]"
                />
              </div>
            </div>

            {/* Reset Password */}
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Reset Client Password (Optional)
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono"
              />
            </div>

            {/* Audit Note */}
            <div>
              <label className="block font-bold text-[#171717] mb-1">Compliance Audit Note</label>
              <input
                type="text"
                required
                value={auditNote}
                onChange={(e) => setAuditNote(e.target.value)}
                placeholder="e.g. Deposit verified or tier upgrade approved"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssetControlUser(null)}
                className="px-4 py-2 font-semibold text-[#666666] hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl shadow-xs"
              >
                Apply Asset Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title={`Partner Profile: ${selectedUser.name}`}
          subtitle={`Account ID: ${selectedUser.id} · Registered on ${selectedUser.createdAt}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-4 bg-slate-50 rounded-xl border border-[#E5E7EB] grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#666666]">Corporate Email:</span>
                <p className="font-bold text-[#171717]">{selectedUser.email}</p>
              </div>
              <div>
                <span className="text-[#666666]">Direct Contact:</span>
                <p className="font-bold text-[#171717] font-mono">{selectedUser.phone}</p>
              </div>
              <div>
                <span className="text-[#666666]">Country of Origin:</span>
                <p className="font-bold text-[#171717]">{selectedUser.countryFlag} {selectedUser.country || 'Global'}</p>
              </div>
              <div>
                <span className="text-[#666666]">Currency:</span>
                <p className="font-mono font-bold text-[#F4511E]">{selectedUser.currency || 'USD'} ({selectedUser.currencySymbol || '$'})</p>
              </div>
              <div>
                <span className="text-[#666666]">Affiliate Referral Code:</span>
                <p className="font-mono font-bold text-[#F4511E]">{selectedUser.referralCode}</p>
              </div>
              <div>
                <span className="text-[#666666]">Current Tier:</span>
                <p className="font-bold text-[#16A34A]">Level {selectedUser.level}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
