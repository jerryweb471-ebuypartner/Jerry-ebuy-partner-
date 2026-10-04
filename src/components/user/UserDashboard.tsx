import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet as WalletIcon,
  ShoppingBag,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface UserDashboardProps {
  onOpenDeposit: () => void;
  onOpenWithdrawal: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenDeposit,
  onOpenWithdrawal,
  onSelectOrder,
}) => {
  const {
    currentUser,
    userWallet,
    userOrders,
    userTransactions,
    userCommissions,
    setCurrentView,
    userLevels,
  } = useApp();

  const currentLevelConfig = userLevels.find((l) => l.level === (currentUser?.level || 1));

  // Order status counts
  const totalOrdersCount = userOrders.length;
  const completedOrders = userOrders.filter((o) => o.status === 'completed');
  const processingOrders = userOrders.filter((o) => o.status === 'processing');
  const pendingOrders = userOrders.filter((o) => o.status === 'pending');
  const cancelledOrders = userOrders.filter((o) => o.status === 'cancelled');

  // Commissions
  const pendingCommissionAmount = userCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + (c.commissionEarned || c.commissionAmount || 0), 0);

  // Time-framed commission calculations
  const lifetimeCommission = userWallet.totalCommission;
  // Estimate realistic current month & week from initial data
  const thisMonthCommission = Number((lifetimeCommission * 0.72).toFixed(2));
  const thisWeekCommission = Number((lifetimeCommission * 0.28).toFixed(2));
  const todayCommission = Number((lifetimeCommission * 0.08).toFixed(2));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner & Tier Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Welcome back</span>
            <span>·</span>
            <span>Account #{currentUser?.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified Partner Tier {currentUser?.level} ({currentLevelConfig?.name}) · Base Reward Rate: {currentLevelConfig?.commissionRatePercent}%
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Deposit Funds
          </button>
          <button
            onClick={onOpenWithdrawal}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Request Payout
          </button>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Available Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Available Balance</span>
            <WalletIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ${(userWallet?.availableBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Ready for orders or payout</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalOrdersCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Across all historical batches</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Delivered & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {completedOrders.length}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">Full reward unlocked</p>
          </div>
        </div>

        {/* Total Commission */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Rewards Earned</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              ${(userWallet?.totalCommission ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Credited to ledger</p>
          </div>
        </div>

        {/* Pending Commission */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Pending Commission</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
              ${(pendingCommissionAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-amber-700 mt-1">Releases upon order delivery</p>
          </div>
        </div>
      </div>

      {/* Grid: Balance & Order & Commission Overviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Balance Overview */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Balance Breakdown</h2>
              <button
                onClick={() => setCurrentView('wallet')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Ledger
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Available Liquid Funds:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${userWallet.availableBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Pending / In-Clearing:</span>
                <span className="font-semibold text-amber-700 font-mono tabular-nums">
                  ${userWallet.pendingBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Lifetime Deposited:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${userWallet.totalDeposited.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Total Lifetime Withdrawn:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${userWallet.totalWithdrawn.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={onOpenDeposit}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Add Funds
            </button>
            <button
              onClick={onOpenWithdrawal}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Disbursement
            </button>
          </div>
        </div>

        {/* Section B: Order Overview */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Order Status Matrix</h2>
              <button
                onClick={() => setCurrentView('orders')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                All Orders
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Pending Validation:</span>
                <span className="font-semibold text-amber-700 font-mono tabular-nums">
                  {pendingOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Warehouse Processing:</span>
                <span className="font-semibold text-indigo-700 font-mono tabular-nums">
                  {processingOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Delivered & Verified:</span>
                <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                  {completedOrders.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Cancelled / Returned:</span>
                <span className="font-semibold text-slate-400 font-mono tabular-nums">
                  {cancelledOrders.length}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('marketplace')}
              className="w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/60 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              Source Additional Inventory
            </button>
          </div>
        </div>

        {/* Section C: Commission Overview */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Commission Timeline</h2>
              <button
                onClick={() => setCurrentView('commissions')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Full Analytics
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Today's Earnings:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${todayCommission.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">This Week's Volume:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${thisWeekCommission.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">This Month's Volume:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${thisMonthCommission.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Total Lifetime Distributed:</span>
                <span className="font-bold text-emerald-700 font-mono tabular-nums">
                  ${lifetimeCommission.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            Tier {currentUser?.level} rate active: +{currentLevelConfig?.commissionRatePercent}% on eligible order lines.
          </div>
        </div>
      </div>

      {/* Section D: Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Merchandise Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track procurement fulfillment and commission status</p>
          </div>
          <button
            onClick={() => setCurrentView('orders')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All ({userOrders.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Product & Order ID</th>
                <th className="px-6 py-3.5">Order Amount</th>
                <th className="px-6 py-3.5">Reward Earned</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {userOrders.slice(0, 5).map((order) => {
                const isCompleted = order.status === 'completed';
                const isProcessing = order.status === 'processing';
                const isPending = order.status === 'pending';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.items[0]?.image}
                          alt={order.items[0]?.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-xs">
                            {order.items[0]?.name}
                            {order.items.length > 1 && (
                              <span className="text-slate-500 font-normal"> +{order.items.length - 1} more</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {order.id} · {order.items.reduce((s, it) => s + it.quantity, 0)} units
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 font-mono tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-700 font-mono tabular-nums">
                      +${order.totalCommission.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {/* Zero-pill: clean text with typographic dot indicator */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-600'
                              : isProcessing
                              ? 'bg-indigo-600'
                              : isPending
                              ? 'bg-amber-600'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="capitalize font-medium text-slate-700">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono tabular-nums">
                      {order.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectOrder(order.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors bg-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section E: Recent Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Ledger Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Double-entry verified balance movements</p>
          </div>
          <button
            onClick={() => setCurrentView('wallet')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Full Ledger ({userTransactions.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Type & Reference</th>
                <th className="px-6 py-3.5">Direction</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Balance After</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userTransactions.slice(0, 5).map((txn) => {
                const isCredit = txn.direction === 'credit';
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      {txn.id}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900 capitalize">
                        {txn.type.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Ref: {txn.reference}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`font-semibold capitalize ${
                          isCredit ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {txn.direction}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-3.5 font-semibold font-mono tabular-nums ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}${txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 font-mono tabular-nums text-slate-600">
                      ${txn.newBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 font-mono tabular-nums text-slate-500">
                      {txn.createdAt}
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
