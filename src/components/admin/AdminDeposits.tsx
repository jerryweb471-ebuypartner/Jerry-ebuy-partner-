import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit } from '../../types';
import { Search, CheckCircle2, XCircle, FileText, ArrowDownLeft } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminDeposits: React.FC = () => {
  const { deposits, approveDeposit, rejectDeposit, formatCurrency } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectingDeposit, setRejectingDeposit] = useState<Deposit | null>(null);
  const [rejectReason, setRejectReason] = useState('Blockchain transaction hash could not be verified on the network.');

  const filteredDeposits = deposits.filter((dep) => {
    if (statusFilter !== 'all' && dep.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = dep.id.toLowerCase().includes(q);
      const matchUser = dep.userName.toLowerCase().includes(q);
      const matchRef = dep.referenceNumber.toLowerCase().includes(q);
      const matchTx = (dep.cryptoTxHash || '').toLowerCase().includes(q);
      if (!matchId && !matchUser && !matchRef && !matchTx) return false;
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectingDeposit) return;
    rejectDeposit(rejectingDeposit.id, rejectReason);
    setRejectingDeposit(null);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Binance & Crypto Deposit Verifications ({deposits.length})
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Reconcile inbound Binance and blockchain USDT/USDC deposits before crediting user balances in USD ($)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deposit ID, user, or TX hash..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#F4511E] bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white font-medium cursor-pointer"
          >
            <option value="all">All Deposits</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved & Credited</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#666666] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Deposit ID & Date</th>
                <th className="px-6 py-3.5">Partner Name</th>
                <th className="px-6 py-3.5">Amount (USD)</th>
                <th className="px-6 py-3.5">Method & Network</th>
                <th className="px-6 py-3.5">Blockchain TX Hash & Proof</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-sans">
              {filteredDeposits.map((dep) => {
                const isPending = dep.status === 'pending';
                const isApproved = dep.status === 'approved';

                return (
                  <tr key={dep.id} className="hover:bg-[#FFF8F4]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#171717] font-mono">{dep.id}</p>
                      <p className="text-[11px] text-[#666666] font-mono mt-0.5">{dep.createdAt}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-[#171717]">{dep.userName}</p>
                      <p className="text-[11px] text-[#666666] font-mono mt-0.5">{dep.userEmail}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-black text-sm font-mono text-[#16A34A]">
                        {formatCurrency(dep.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                        <span>🟡 {dep.paymentMethod.toUpperCase()}</span>
                      </div>
                      <p className="text-[11px] text-[#666666] font-mono mt-0.5">{dep.cryptoNetwork || 'TRC20 (USDT)'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-[#171717] truncate max-w-[160px]" title={dep.cryptoTxHash}>
                        {dep.cryptoTxHash || dep.referenceNumber}
                      </p>
                      {dep.proofDocumentName && (
                        <div className="flex items-center gap-1 text-[11px] text-[#F4511E] mt-0.5">
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[140px]">{dep.proofDocumentName}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => approveDeposit(dep.id)}
                            className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve USD</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingDeposit(dep)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#666666] font-mono">
                          {isApproved ? 'Credited to Wallet' : 'Rejected'}
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
      {rejectingDeposit && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingDeposit(null)}
          title="Reject Deposit Remittance"
          subtitle={`Deposit ${rejectingDeposit.id} for ${formatCurrency(rejectingDeposit.amount)}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs font-sans">
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
                onClick={() => setRejectingDeposit(null)}
                className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] font-bold text-[#171717] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
