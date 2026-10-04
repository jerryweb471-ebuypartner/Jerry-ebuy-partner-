import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types';
import { DepositModal } from './DepositModal';
import { WithdrawalModal } from './WithdrawalModal';
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const {
    userWallet,
    userTransactions,
    deposits,
    withdrawals,
    currentUser,
    formatCurrency,
  } = useApp();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myDeposits = deposits.filter((d) => d.userId === currentUser?.id);
  const myWithdrawals = withdrawals.filter((w) => w.userId === currentUser?.id);

  // Filter transactions
  const filteredTransactions = userTransactions.filter((txn) => {
    if (typeFilter !== 'all' && txn.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = txn.id.toLowerCase().includes(q);
      const matchRef = txn.reference.toLowerCase().includes(q);
      const matchDesc = txn.description.toLowerCase().includes(q);
      if (!matchId && !matchRef && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
            Wallet & Double-Entry Ledger
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Complete cryptographic audit trail of all commercial credits, disbursements, and merchandise deductions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDepositOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-[10px] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposit & Select Plan</span>
          </button>
          <button
            onClick={() => setIsWithdrawalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-[#171717] bg-white border border-[#E5E7EB] hover:border-[#F4511E] rounded-[10px] transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw Balance</span>
          </button>
        </div>
      </div>

      {/* Balance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div className="text-xs text-[#666666] mb-2 flex justify-between items-center">
            <span>Available Balance</span>
            <WalletIcon className="w-4 h-4 text-[#F4511E]" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#E5390B] font-mono tabular-nums">
              {formatCurrency(userWallet?.availableBalance ?? 0)}
            </p>
            <p className="text-[11px] text-[#16A34A] font-semibold mt-1">Liquid purchasing power</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div className="text-xs text-[#666666] mb-2 flex justify-between items-center">
            <span>Total Commission</span>
            <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#16A34A] font-mono tabular-nums">
              {formatCurrency(userWallet?.totalCommission ?? 0)}
            </p>
            <p className="text-[11px] text-[#666666] mt-1">From completed product tasks</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div className="text-xs text-[#666666] mb-2 flex justify-between items-center">
            <span>Total Withdrawn</span>
            <Clock className="w-4 h-4 text-[#666666]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#171717] font-mono tabular-nums">
              {formatCurrency(userWallet?.totalWithdrawn ?? 0)}
            </p>
            <p className="text-[11px] text-[#666666] mt-1">Disbursed to bank / mobile</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
          <div className="text-xs text-[#666666] mb-2 flex justify-between items-center">
            <span>Total Deposited</span>
            <CheckCircle2 className="w-4 h-4 text-[#F4511E]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#171717] font-mono tabular-nums">
              {formatCurrency(userWallet?.totalDeposited ?? 0)}
            </p>
            <p className="text-[11px] text-[#666666] mt-1">Escrow capital</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[18px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#171717]">Transaction Ledger</h2>
            <p className="text-xs text-[#666666]">Verified ledger credits and debit entries</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#F4511E] bg-white text-[#171717]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8F4] border-b border-[#E5E7EB] text-[#666666] font-semibold">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance After</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#666666]">
                    No transactions recorded yet
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#FFF8F4] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#171717]">{txn.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.direction === 'credit'
                          ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-bold font-mono ${
                      txn.direction === 'credit' ? 'text-[#16A34A]' : 'text-[#E5390B]'
                    }`}>
                      {txn.direction === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#171717]">{formatCurrency(txn.newBalance)}</td>
                    <td className="px-4 py-3 text-[#666666]">{txn.description}</td>
                    <td className="px-4 py-3 text-[#666666] font-mono text-[11px]">{txn.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        onOpenDeposit={() => {
          setIsWithdrawalOpen(false);
          setIsDepositOpen(true);
        }}
      />
    </div>
  );
};
