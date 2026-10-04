import React from 'react';
import { Order } from '../../types';
import { Modal } from '../common/Modal';
import { CheckCircle2, Clock, Package, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const isCompleted = order.status === 'completed';
  const isProcessing = order.status === 'processing';
  const isPending = order.status === 'pending';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order.id}`}
      subtitle={`Created on ${order.createdAt} · Payment: ${order.paymentMethod === 'wallet_balance' ? 'Wallet Balance' : 'Corporate Invoice'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : isProcessing
                  ? 'bg-indigo-100 text-indigo-700'
                  : isPending
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-5 h-5" />}
              {isProcessing && <Package className="w-5 h-5" />}
              {isPending && <Clock className="w-5 h-5" />}
              {!isCompleted && !isProcessing && !isPending && <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 capitalize">
                Status: {order.status}
              </p>
              <p className="text-[11px] text-slate-500">
                {isCompleted
                  ? 'Merchandise verified delivered. Reward released to ledger.'
                  : isProcessing
                  ? 'Assigned to international fulfillment queue.'
                  : 'Awaiting dispatch confirmation.'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Gross Total</span>
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
              PKR {(order.totalAmount ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Lifecycle Timeline */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
            Fulfillment & Commission Lifecycle
          </h4>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 capitalize">
                    {step.status === 'completed'
                      ? 'Order Verified Delivered & Reward Added'
                      : step.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                    {step.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {step.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Itemized Merchandise List */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
            Order Items ({order.items.length})
          </h4>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between bg-white text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Qty: {item.quantity} × PKR {(item.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900 font-mono tabular-nums">
                    PKR {(((item.price ?? 0) * (item.quantity ?? 1))).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium font-mono tabular-nums mt-0.5">
                    +PKR {(item.commissionAmount ?? 0).toFixed(2)} reward
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Reward Summary Breakdown */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Merchandise Subtotal:</span>
            <span className="font-mono tabular-nums">PKR {(order.totalAmount ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method:</span>
            <span className="font-medium text-slate-800 capitalize">
              {order.paymentMethod.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold pt-2 border-t border-slate-200">
            <span>Applicable Partner Reward:</span>
            <span className="font-bold font-mono tabular-nums">
              +PKR {(order.totalCommission ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
