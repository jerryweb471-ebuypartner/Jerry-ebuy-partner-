import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RefundRecord } from '../../types';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminRefunds: React.FC = () => {
  const { refunds, updateRefundStatus, formatCurrency } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredRefunds = refunds.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.referenceId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (refundId: string, status: RefundRecord['status']) => {
    updateRefundStatus(refundId, status, adminNote);
    setSelectedRefund(null);
    setAdminNote('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
              Escrow Compliance & Reversals
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
            USD Refund & Escrow Return Audit ({refunds.length})
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Audit trail of all requested and processed deposit reversals, Binance refunds, and escrow returns in USD ($).
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-[#E5E7EB]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by User, Email, or Reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E7EB] focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#666666]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold rounded-lg border border-[#E5E7EB] px-3 py-1.5 bg-white text-[#171717]"
          >
            <option value="all">All Statuses ({refunds.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8F4] border-b border-[#E5E7EB] text-[#171717] uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-4">Refund ID & Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Channel & Network</th>
                <th className="py-3 px-4">Amount (USD)</th>
                <th className="py-3 px-4">Destination Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    No refund records found.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FFF8F4]/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#171717] block">{r.id}</span>
                      <span className="text-[10px] text-[#666666] font-mono">{r.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#171717] block">{r.userName}</span>
                      <span className="text-[11px] text-[#666666] font-mono">{r.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#171717] block">
                        🟡 {r.paymentMethod.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#666666] font-mono">{r.network || 'TRC20'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-[#16A34A] text-sm">
                        {formatCurrency(r.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-[#171717] block truncate max-w-[180px]" title={r.destinationDetails}>
                        {r.destinationDetails}
                      </span>
                      <span className="text-[10px] text-[#666666]">Ref: {r.referenceId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : r.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRefund(r);
                          setAdminNote(r.adminNote || '');
                        }}
                        className="px-2.5 py-1 bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Refund Modal */}
      {selectedRefund && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRefund(null)}
          title={`Manage Refund ${selectedRefund.id}`}
          subtitle={`Client: ${selectedRefund.userName} · Amount: ${formatCurrency(selectedRefund.amount)}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3.5 bg-[#FFF8F4] rounded-xl border border-[#FFD7C2] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Method:</span>
                <span className="font-bold text-[#171717]">Binance / Crypto ({selectedRefund.network || 'TRC20'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Destination:</span>
                <span className="font-mono font-bold text-[#171717]">{selectedRefund.destinationDetails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Refund Amount:</span>
                <span className="font-mono font-black text-sm text-[#16A34A]">{formatCurrency(selectedRefund.amount)}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1">Administrative Audit Note</label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter audit explanation or transaction reference..."
                className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-xs focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedRefund.id, 'processing')}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl"
              >
                Mark Processing
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedRefund.id, 'rejected')}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedRefund.id, 'completed')}
                className="px-4 py-1.5 bg-[#16A34A] text-white hover:bg-emerald-700 font-bold rounded-xl shadow-xs"
              >
                Confirm & Completed in USD
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
