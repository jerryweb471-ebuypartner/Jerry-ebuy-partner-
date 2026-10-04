import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Withdrawal } from '../../types';
import { Search, CheckCircle2, XCircle, ArrowUpRight, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, updateWithdrawalStatus, formatCurrency } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectingWithdrawal, setRejectingWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState('Recipient crypto wallet address invalid or network mismatch.');

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = w.id.toLowerCase().includes(q);
      const matchUser = w.userName.toLowerCase().includes(q);
      const matchAddr = (w.accountInfo.walletAddress || '').toLowerCase().includes(q);
      if (!matchId && !matchUser && !matchAddr) return false;
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectingWithdrawal) return;
    updateWithdrawalStatus(rejectingWithdrawal.id, 'rejected', rejectReason);
    setRejectingWithdrawal(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Binance & Crypto Withdrawal Authorizations ({withdrawals.length})
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Authorize outbound Binance Pay & blockchain payouts in USD ($). Rejecting a withdrawal automatically refunds the balance to the user's wallet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, user, or wallet..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#F4511E] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium cursor-pointer"
          >
            <option value="all">All Payouts</option>
            <option value="pending">Pending</option>
            <option value="processing">In Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected / Restored</option>
          </select>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#666666] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Disbursement ID & Date</th>
                <th className="px-6 py-3.5">Partner Name</th>
                <th className="px-6 py-3.5">Disbursement Amount (USD)</th>
                <th className="px-6 py-3.5">Method & Network</th>
                <th className="px-6 py-3.5">Recipient Wallet Address</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-sans">
              {filteredWithdrawals.map((wth) => {
                const isPending = wth.status === 'pending';
                const isProcessing = wth.status === 'processing';
                const isCompleted = wth.status === 'completed';

                return (
                  <tr key={wth.id} className="hover:bg-[#FFF8F4]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#171717] font-mono">{wth.id}</p>
                      <p className="text-[11px] text-[#666666] font-mono mt-0.5">{wth.createdAt}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-[#171717]">{wth.userName}</p>
                      <p className="text-[11px] text-[#666666] font-mono mt-0.5">{wth.userEmail}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-sm font-mono text-[#E5390B]">
                        {formatCurrency(wth.amount)}
                      </p>
                      <p className="text-[10px] text-[#666666] font-mono">
                        Net: {formatCurrency(wth.netAmount)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#171717] block">
                        {wth.method === 'binance' ? '🟡 Binance Pay' : '🌐 Crypto'}
                      </span>
                      <span className="text-[11px] text-[#666666] font-mono">
                        {wth.accountInfo.cryptoNetwork || 'TRC20 (USDT)'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-[#171717] truncate max-w-[170px]" title={wth.accountInfo.walletAddress}>
                        {wth.accountInfo.walletAddress || 'N/A'}
                      </p>
                      {wth.accountInfo.memoOrTag && (
                        <p className="text-[10px] text-[#666666] font-mono mt-0.5">
                          Tag: {wth.accountInfo.memoOrTag}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isProcessing
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {wth.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => updateWithdrawalStatus(wth.id, 'processing')}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Process</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateWithdrawalStatus(wth.id, 'completed')}
                            className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Disburse</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingWithdrawal(wth)}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : isProcessing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => updateWithdrawalStatus(wth.id, 'completed')}
                            className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Completed</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#666666] font-mono">
                          {isCompleted ? 'Disbursed via Blockchain' : 'Rejected & Restored'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingWithdrawal && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingWithdrawal(null)}
          title="Reject & Refund Withdrawal"
          subtitle={`Withdrawal ${rejectingWithdrawal.id} for ${formatCurrency(rejectingWithdrawal.amount)}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-[#666666] leading-relaxed">
              Rejecting this request will immediately refund <strong>{formatCurrency(rejectingWithdrawal.amount)}</strong> back to the partner's available USD wallet balance.
            </p>

            <div>
              <label className="block font-bold text-[#171717] mb-1">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingWithdrawal(null)}
                className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] font-bold text-[#171717] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection & Restore
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
