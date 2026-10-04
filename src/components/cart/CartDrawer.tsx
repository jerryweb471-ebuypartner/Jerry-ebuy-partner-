import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Wallet as WalletIcon, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenDeposit,
}) => {
  const {
    cart,
    cartTotalAmount,
    cartEstimatedCommission,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    userWallet,
    checkoutCart,
    currentUser,
    setCurrentView,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'wallet_balance' | 'corporate_invoice'>('wallet_balance');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const hasSufficientBalance = userWallet.availableBalance >= cartTotalAmount;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const res = await checkoutCart(paymentMethod);
    setIsCheckingOut(false);
    if (res.success) {
      onClose();
      setCurrentView('orders');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E5E7EB]">
          {/* Header */}
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F4511E]" />
              <h2 className="text-base font-bold text-[#171717]">Commercial Order Cart</h2>
              <span className="text-xs text-[#666666] font-mono">({cart.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#666666] hover:text-[#171717] rounded-lg hover:bg-[#FFF4ED] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E5E7EB]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <ShoppingBag className="w-12 h-12 text-[#FFD7C2] stroke-[1.5] mb-3" />
                <h3 className="text-sm font-bold text-[#171717]">Your cart is empty</h3>
                <p className="text-xs text-[#666666] mt-1 max-w-xs leading-relaxed">
                  Explore our verified marketplace catalog to select available inventory items.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentView('marketplace');
                  }}
                  className="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-[10px] transition-colors shadow-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-slate-100 border border-[#E5E7EB] shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#171717] leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#666666] hover:text-rose-600 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#666666] font-mono">
                        <span className="text-[#171717] font-bold tabular-nums font-sans">
                          PKR {(item.product?.price ?? 0).toFixed(2)}
                        </span>
                        <span>·</span>
                        <span className="text-[#16A34A] font-semibold">
                          +PKR {(item.estimatedCommission ?? 0).toFixed(2)} reward
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E7EB]/50">
                      <div className="flex items-center border border-[#E5E7EB] rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-[#FFF4ED] text-[#666666] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#171717] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-[#FFF4ED] text-[#666666] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#E5390B] tabular-nums font-mono">
                          PKR {((item.product?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E5E7EB] bg-[#FFF8F4] space-y-4">
              {/* Calculations Box */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#666666]">
                  <span>Gross Order Value:</span>
                  <span className="font-bold text-[#171717] tabular-nums font-mono">
                    PKR {(cartTotalAmount ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#16A34A] font-semibold bg-white p-2.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    Applicable Partner Reward:
                  </span>
                  <span className="font-bold tabular-nums font-mono">
                    +PKR {(cartEstimatedCommission ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#666666] pt-1">
                  <span>Your Available Balance:</span>
                  <span className="font-bold text-[#E5390B] tabular-nums font-mono">
                    PKR {(userWallet?.availableBalance ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#171717] mb-1.5 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet_balance')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      paymentMethod === 'wallet_balance'
                        ? 'border-[#F4511E] bg-[#FFF4ED] text-[#F4511E] font-bold shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-[#666666] hover:border-[#FF8A3D]'
                    }`}
                  >
                    <span className="font-bold">Wallet Balance</span>
                    <span className="text-[10px] text-[#666666] mt-1">Instant deduction</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('corporate_invoice')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      paymentMethod === 'corporate_invoice'
                        ? 'border-[#F4511E] bg-[#FFF4ED] text-[#F4511E] font-bold shadow-xs'
                        : 'border-[#E5E7EB] bg-white text-[#666666] hover:border-[#FF8A3D]'
                    }`}
                  >
                    <span className="font-bold">Corporate Net-30</span>
                    <span className="text-[10px] text-[#666666] mt-1">Direct wire invoice</span>
                  </button>
                </div>
              </div>

              {/* Insufficient balance warning if paying with wallet */}
              {paymentMethod === 'wallet_balance' && !hasSufficientBalance && (
                <div className="p-3 bg-white border border-[#FFD7C2] rounded-xl text-xs text-[#171717] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E5390B] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-[#E5390B]">Insufficient Available Balance</p>
                    <p className="text-[11px] text-[#666666] mt-0.5">
                      You need PKR {Math.max(0, (cartTotalAmount ?? 0) - (userWallet?.availableBalance ?? 0)).toLocaleString()} more.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDeposit();
                      }}
                      className="mt-1.5 text-xs font-bold text-[#F4511E] underline hover:text-[#E5390B] inline-block"
                    >
                      Deposit & Select Plan Now →
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  (paymentMethod === 'wallet_balance' && !hasSufficientBalance)
                }
                className="w-full h-[48px] text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  'Verifying Order...'
                ) : (
                  <>
                    <span>Confirm Order (PKR {(cartTotalAmount ?? 0).toFixed(2)})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-[#666666] hover:text-[#F4511E] transition-colors"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
