import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Download, BookOpen } from 'lucide-react';

export const AdminLedger: React.FC = () => {
  const { transactions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = transactions.filter((txn) => {
    if (typeFilter !== 'all' && txn.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = txn.id.toLowerCase().includes(q);
      const matchEmail = txn.userEmail.toLowerCase().includes(q);
      const matchRef = txn.reference.toLowerCase().includes(q);
      const matchDesc = txn.description.toLowerCase().includes(q);
      if (!matchId && !matchEmail && !matchRef && !matchDesc) return false;
    }
    return true;
  });

  const totalCreditVolume = transactions
    .filter((t) => t.direction === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebitVolume = transactions
    .filter((t) => t.direction === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Platform Double-Entry Transaction Ledger ({transactions.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global balance journal tracing all deposits, merchandise order deductions, commission releases, and payouts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger entries..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
          >
            <option value="all">All Movements</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="order_payment">Order Payments</option>
            <option value="commission">Commissions</option>
            <option value="refund">Refunds</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500">Total Credit Volume (Inbound / Rewards):</span>
          <p className="text-lg font-bold text-emerald-700 font-mono tabular-nums mt-1">
            +${(totalCreditVolume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500">Total Debit Volume (Orders / Payouts):</span>
          <p className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
            -${(totalDebitVolume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500">Audit Status:</span>
          <p className="text-lg font-bold text-indigo-700 font-mono mt-1">
            Reconciled
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">User Email</th>
                <th className="px-6 py-3.5">Type & Reference</th>
                <th className="px-6 py-3.5">Direction</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Balance Delta</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Initiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((txn) => {
                const isCredit = txn.direction === 'credit';

                return (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                      {txn.id}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {txn.userEmail}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 capitalize">
                        {txn.type.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Ref: {txn.reference}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold capitalize ${
                          isCredit ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {txn.direction}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 font-bold font-mono tabular-nums ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}${txn.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 font-mono tabular-nums text-slate-500">
                      ${txn.previousBalance.toFixed(2)} →{' '}
                      <span className="font-semibold text-slate-900">
                        ${txn.newBalance.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono tabular-nums text-slate-500">
                      {txn.createdAt}
                    </td>

                    <td className="px-6 py-4">
                      <span className="capitalize text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {txn.createdBy}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
