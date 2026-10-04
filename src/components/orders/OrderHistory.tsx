import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { OrderDetailModal } from './OrderDetailModal';
import { Search, ShoppingBag, Eye, ArrowUpDown, ChevronRight } from 'lucide-react';

interface OrderHistoryProps {
  initialSelectedOrderId?: string | null;
  onClearInitialOrder?: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  initialSelectedOrderId,
  onClearInitialOrder,
}) => {
  const { userOrders, setCurrentView } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(() => {
    if (initialSelectedOrderId) {
      return userOrders.find((o) => o.id === initialSelectedOrderId) || null;
    }
    return null;
  });

  const filteredOrders = userOrders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchItem = order.items.some((it) => it.name.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Order Fulfillment History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track merchandise delivery stages and corresponding ledger commission settlements
          </p>
        </div>

        <button
          onClick={() => setCurrentView('marketplace')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or item..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">No orders found</p>
          <p className="text-xs text-slate-500 mt-1">
            There are no orders matching your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Order ID & Primary Item</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Earned Reward</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date Created</th>
                  <th className="px-6 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredOrders.map((order) => {
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
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate max-w-xs">
                              {order.items[0]?.name}
                              {order.items.length > 1 && (
                                <span className="text-slate-500 font-normal">
                                  {' '}
                                  +{order.items.length - 1} other items
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {order.id} · {order.items.reduce((s, it) => s + it.quantity, 0)} total units
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900 font-mono tabular-nums">
                        PKR {(order.totalAmount ?? 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 font-semibold text-emerald-700 font-mono tabular-nums">
                        +PKR {(order.totalCommission ?? 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-slate-600 capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </td>

                      <td className="px-6 py-4">
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
                          <span className="capitalize font-medium text-slate-800">
                            {order.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500 font-mono tabular-nums">
                        {order.createdAt}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setInspectedOrder(order)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors bg-white inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      <OrderDetailModal
        order={inspectedOrder}
        isOpen={Boolean(inspectedOrder)}
        onClose={() => {
          setInspectedOrder(null);
          if (onClearInitialOrder) onClearInitialOrder();
        }}
      />
    </div>
  );
};
