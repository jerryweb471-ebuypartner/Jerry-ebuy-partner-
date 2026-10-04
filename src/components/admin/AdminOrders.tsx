import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { Search, Eye, Filter, CheckCircle2 } from 'lucide-react';
import { OrderDetailModal } from '../orders/OrderDetailModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchUser = order.userName.toLowerCase().includes(q);
      const matchEmail = order.userEmail.toLowerCase().includes(q);
      if (!matchId && !matchUser && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Order Fulfillment Queue ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise logistics dispatch. Marking orders as "Completed" automatically releases verified partner commission rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, user or email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Order ID & Date</th>
                <th className="px-6 py-3.5">Partner / Customer</th>
                <th className="px-6 py-3.5">Order Amount</th>
                <th className="px-6 py-3.5">Commission</th>
                <th className="px-6 py-3.5">Payment Rail</th>
                <th className="px-6 py-3.5">Fulfillment Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredOrders.map((order) => {
                const isCompleted = order.status === 'completed';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 font-mono">{order.id}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{order.createdAt}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{order.userName}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{order.userEmail}</p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 font-mono tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-700 font-mono tabular-nums">
                      +${order.totalCommission.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-slate-700 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border cursor-pointer ${
                          isCompleted
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : order.status === 'processing'
                            ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                            : order.status === 'pending'
                            ? 'border-amber-300 bg-amber-50 text-amber-800'
                            : 'border-slate-300 bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed (Release Reward)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectedOrder(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors bg-white inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      <OrderDetailModal
        order={inspectedOrder}
        isOpen={Boolean(inspectedOrder)}
        onClose={() => setInspectedOrder(null)}
      />
    </div>
  );
};
