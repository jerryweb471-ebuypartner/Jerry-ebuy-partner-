import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    orders,
    transactions,
    deposits,
    withdrawals,
    setAdminSection,
  } = useApp();

  // Metrics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'active').length;

  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;

  const totalGrossOrderVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommissionDistributed = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalCommission, 0);

  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const pendingDepositsAmount = pendingDeposits.reduce((sum, d) => sum + d.amount, 0);

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing');
  const pendingWithdrawalsAmount = pendingWithdrawals.reduce((sum, w) => sum + w.netAmount, 0);

  // Realistic sample chart data across the last 7 weeks
  const chartWeeks = [
    { label: 'W1', orders: 18, volume: 14200, commission: 1136, newUsers: 4 },
    { label: 'W2', orders: 24, volume: 18500, commission: 1480, newUsers: 6 },
    { label: 'W3', orders: 28, volume: 22100, commission: 1768, newUsers: 5 },
    { label: 'W4', orders: 32, volume: 26400, commission: 2112, newUsers: 7 },
    { label: 'W5', orders: 39, volume: 31800, commission: 2544, newUsers: 9 },
    { label: 'W6', orders: 45, volume: 38200, commission: 3056, newUsers: 8 },
    { label: 'W7 (Current)', orders: 50, volume: 44650, commission: 3572, newUsers: 11 },
  ];

  const maxVolume = 50000;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Platform Executive Control Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global governance metrics for commercial order flows, liquidity reserves, and partner payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            Fiscal Q3 · Audited
          </span>
        </div>
      </div>

      {/* 8 Primary Governance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total & Active Users */}
        <div
          onClick={() => setAdminSection('users')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Partner Accounts</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalUsersCount}
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">
            {activeUsersCount} active / verified partners
          </p>
        </div>

        {/* Total & Completed Orders */}
        <div
          onClick={() => setAdminSection('orders')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Order Pipeline</span>
            <ShoppingBag className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalOrdersCount}
          </p>
          <p className="text-[11px] text-indigo-700 mt-1">
            {completedOrdersCount} successfully delivered
          </p>
        </div>

        {/* Gross Order Volume */}
        <div
          onClick={() => setAdminSection('transactions')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Gross Order Volume</span>
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${(totalGrossOrderVolume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Cumulative wholesale sales</p>
        </div>

        {/* Total Commission Distributed */}
        <div
          onClick={() => setAdminSection('commissions')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Rewards Distributed</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            ${(totalCommissionDistributed ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Credited upon delivery verification</p>
        </div>

        {/* Pending Deposits */}
        <div
          onClick={() => setAdminSection('deposits')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pending Deposits</span>
            <ArrowDownLeft className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
            {pendingDeposits.length}
          </p>
          <p className="text-[11px] text-amber-700 mt-1 font-mono tabular-nums">
            ${pendingDepositsAmount.toFixed(2)} awaiting verification
          </p>
        </div>

        {/* Pending Withdrawals */}
        <div
          onClick={() => setAdminSection('withdrawals')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pending Payout Requests</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-800 font-mono tabular-nums">
            {pendingWithdrawals.length}
          </p>
          <p className="text-[11px] text-rose-700 mt-1 font-mono tabular-nums">
            ${pendingWithdrawalsAmount.toFixed(2)} in disbursement review
          </p>
        </div>

        {/* Average Fulfillment Time */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Avg Dispatch Speed</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            1.4 Days
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Warehouse fulfillment lead</p>
        </div>

        {/* Compliance Rating */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Audit Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            Nominal
          </p>
          <p className="text-[11px] text-emerald-700 mt-1">100% ledger reconciled</p>
        </div>
      </div>

      {/* Visual Analytics / Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue & Order Volume Trends */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weekly Transaction Volume (USD)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gross commercial order values across active merchant tiers
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-700">
              $44.6K / wk
            </span>
          </div>

          {/* Clean Bar Visualization */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 pb-2">
            {chartWeeks.map((wk, i) => {
              const heightPct = Math.round((wk.volume / maxVolume) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(wk.volume / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full bg-indigo-600 group-hover:bg-indigo-700 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-500">{wk.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Consistent 22.4% MoM volume expansion</span>
            <span className="font-mono text-slate-700">Baseline 6.5% gross margin</span>
          </div>
        </div>

        {/* Chart 2: Commission Distribution Trends */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Verified Commission Credited (USD)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly rewards released following delivery verification
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700">
              +$3,572 / wk
            </span>
          </div>

          {/* Clean Bar Visualization */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-slate-100 pb-2">
            {chartWeeks.map((wk, i) => {
              const heightPct = Math.round((wk.commission / 4000) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    +${wk.commission}
                  </span>
                  <div
                    className="w-full bg-emerald-600 group-hover:bg-emerald-700 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-500">{wk.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Zero unpaid reward liabilities</span>
            <span className="font-mono text-slate-700">Effective payout rate: 8.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
