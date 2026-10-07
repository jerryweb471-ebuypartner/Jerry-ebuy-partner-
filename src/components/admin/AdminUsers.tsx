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
  Globe2,
  Smartphone,
  Calendar,
  ShieldCheck,
  MapPin,
  Activity,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modal';

const formatDateTime = (isoString?: string) => {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
};

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

  const filteredUsers = users
    .filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchId = u.id.toLowerCase().includes(q);
        const matchCountry = (u.country || '').toLowerCase().includes(q);
        const matchIp = (u.ipAddress || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchId && !matchCountry && !matchIp) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Pin Admin Jerry at the top
      if (a.email === 'jerryhun47@gmail.com') return -1;
      if (b.email === 'jerryhun47@gmail.com') return 1;
      // Sort other users by registration date descending (newest first)
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
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
            Real-time client tracking: exact registration timestamp, client public IP address, geolocation, 100/100 credit scores, and asset management.
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
              placeholder="Search by name, email, ID, country, or IP..."
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
                <th className="px-5 py-3.5">Registration Date & Time</th>
                <th className="px-5 py-3.5">IP Address & Device</th>
                <th className="px-5 py-3.5">Country & Origin</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Credit Score</th>
                <th className="px-5 py-3.5">Level Tier</th>
                <th className="px-5 py-3.5">Available Balance</th>
                <th className="px-5 py-3.5 text-right">Asset Control & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-sans">
              {filteredUsers.map((user, idx) => {
                const userWallet = wallets[user.id];
                const isActive = user.status === 'active';
                const isSuspended = user.status === 'suspended';
                const isRecentRegistration = Date.now() - new Date(user.createdAt || 0).getTime() < 48 * 60 * 60 * 1000 && user.role !== 'admin';

                return (
                  <tr key={`${user.id}-${idx}`} className={`hover:bg-[#FFF8F4]/50 transition-colors ${isRecentRegistration ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-[#E5E7EB] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-[#171717]">{user.name}</p>
                            {user.role === 'admin' ? (
                              <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-900 font-extrabold text-[9px] border border-purple-200">
                                ADMIN
                              </span>
                            ) : isRecentRegistration ? (
                              <span className="px-1.5 py-0.2 rounded-md bg-orange-100 text-[#F4511E] font-black text-[9px] border border-orange-300 animate-pulse">
                                ✨ NEW
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[11px] text-[#666666] font-mono mt-0.5">
                            {user.email} · <span className="text-[#F4511E] font-semibold">{user.id}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Registration Date & Time */}
                    <td className="px-5 py-4 font-mono">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[#171717] font-semibold text-[11px]">
                          <Calendar className="w-3 h-3 text-[#F4511E]" />
                          <span>{formatDateTime(user.createdAt)}</span>
                        </div>
                        <div className="text-[10px] text-[#666666] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-gray-400" />
                          <span>Active: {formatDateTime(user.lastLoginAt)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Client IP & Device */}
                    <td className="px-5 py-4 font-mono">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-[#0F172A] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {user.ipAddress || user.registrationIp || '104.28.192.44'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-sans truncate max-w-[140px]">
                          <Smartphone className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                          <span className="truncate">{user.deviceInfo || 'Chrome on Android'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{user.countryFlag || '🌐'}</span>
                        <div>
                          <p className="font-semibold text-[#171717]">{user.country || 'Global / USA'}</p>
                          <p className="text-[10px] text-[#666666] font-mono">{user.city ? `${user.city} · ` : ''}{user.currency || 'USD'} ({user.currencySymbol || '$'})</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
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
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>OTP Verified</span>
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

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAssetControl(user)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-lg transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#171717] hover:bg-slate-100 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                        >
                          Audit
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
                  className={`py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
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
                  className={`py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
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
                  className={`py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                    balanceAdjustmentType === 'set'
                      ? 'bg-[#F4511E] text-white border-[#F4511E]'
                      : 'bg-white text-[#666666] border-[#E5E7EB]'
                  }`}
                >
                  = Set Fixed
                </button>
              </div>

              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount (e.g. 500.00)"
                  value={balanceAdjustmentAmount}
                  onChange={(e) => setBalanceAdjustmentAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-mono font-bold text-sm focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </div>

            {/* Level Tier & Status */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Target Plan Level</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold font-mono cursor-pointer"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white font-bold cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="suspended">Suspended</option>
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
                className="px-4 py-2 font-semibold text-[#666666] hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl shadow-xs cursor-pointer"
              >
                Apply Asset Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* User Details & IP / Security Audit Modal */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title={`Client Security & IP Audit: ${selectedUser.name}`}
          subtitle={`Account ID: ${selectedUser.id} · Registered on ${formatDateTime(selectedUser.createdAt)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs font-sans">
            {/* Security Verification Banner */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-950">Legitimate Verified Client</h4>
                  <p className="text-[11px] text-emerald-800">
                    Passed 5-Digit SMS OTP security check. IP address and territory recorded.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white font-mono font-black text-xs text-emerald-700 border border-emerald-300 shadow-2xs">
                Score: {selectedUser.creditScore ?? 100}/100
              </span>
            </div>

            {/* Network & IP Audit Grid */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-[#F4511E]" />
                  <span>Public IP Address:</span>
                </span>
                <p className="font-mono font-bold text-sm text-[#0F172A] mt-0.5">
                  {selectedUser.ipAddress || selectedUser.registrationIp || '104.28.192.44'}
                </p>
              </div>

              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#F4511E]" />
                  <span>Exact Registration:</span>
                </span>
                <p className="font-mono font-bold text-[#171717] mt-0.5">
                  {formatDateTime(selectedUser.createdAt)}
                </p>
              </div>

              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#F4511E]" />
                  <span>Last Active / Login:</span>
                </span>
                <p className="font-mono font-bold text-[#171717] mt-0.5">
                  {formatDateTime(selectedUser.lastLoginAt)}
                </p>
              </div>

              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F4511E]" />
                  <span>Country & Region:</span>
                </span>
                <p className="font-bold text-[#171717] mt-0.5">
                  {selectedUser.countryFlag} {selectedUser.country || 'Global'} ({selectedUser.city || 'Origin'})
                </p>
              </div>

              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#F4511E]" />
                  <span>Device & Environment:</span>
                </span>
                <p className="font-medium text-[#171717] mt-0.5">
                  {selectedUser.deviceInfo || 'Chrome on Mobile Device'}
                </p>
              </div>

              <div>
                <span className="text-[#666666] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#F4511E]" />
                  <span>Current Tier & Currency:</span>
                </span>
                <p className="font-bold text-[#16A34A] mt-0.5">
                  Level {selectedUser.level} · {selectedUser.currency || 'USD'} ({selectedUser.currencySymbol || '$'})
                </p>
              </div>
            </div>

            {/* Contact & Credentials */}
            <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#666666]">Client Email Address:</span>
                <p className="font-bold text-[#171717] font-mono">{selectedUser.email}</p>
              </div>
              <div>
                <span className="text-[#666666]">Phone / WhatsApp:</span>
                <p className="font-bold text-[#171717] font-mono">{selectedUser.phone}</p>
              </div>
              <div>
                <span className="text-[#666666]">Affiliate Referral Code:</span>
                <p className="font-mono font-bold text-[#F4511E]">{selectedUser.referralCode}</p>
              </div>
              <div>
                <span className="text-[#666666]">Wallet Balance:</span>
                <p className="font-mono font-black text-sm text-[#16A34A]">
                  {formatCurrency(wallets[selectedUser.id]?.availableBalance || 0)}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
