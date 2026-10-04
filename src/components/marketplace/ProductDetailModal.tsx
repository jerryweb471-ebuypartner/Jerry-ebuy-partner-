import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ShoppingBag, Check, ShieldCheck, Star, Truck, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const {
    addToCart,
    currentUser,
    userLevels,
    formatCurrency,
    currentLevelConfig,
    completedTasksToday,
    setCurrentView,
  } = useApp();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const userLevel = currentUser?.level ?? 0;
  const userLevelConfig = userLevels.find((l) => l.level === userLevel) || currentLevelConfig;
  const rewardAmount = userLevelConfig?.earningPerProduct || (userLevel === 0 ? 20 : 60);
  const isLimitReached = userLevel === 0 && completedTasksToday.length >= 4;

  const handleAddToCart = () => {
    if (isLimitReached) {
      onClose();
      setCurrentView('plans');
      return;
    }
    addToCart(product, quantity);
    onClose();
    onOpenCart();
  };

  const handleGoToPlans = () => {
    onClose();
    setCurrentView('plans');
  };

  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`SKU: ${product.sku} · Category: ${product.category}`}
      maxWidth="3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">
        {/* Left: Image Gallery */}
        <div className="md:col-span-6 space-y-3">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#FFF8F4] border border-[#E5E7EB] shadow-xs">
            <img
              src={images[selectedImageIdx] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-[#F4511E] ring-2 ring-[#F4511E]/30'
                      : 'border-[#E5E7EB] hover:border-[#FF8A3D]'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Logistics Trust */}
          <div className="p-4 bg-[#FFF8F4] rounded-2xl border border-[#FF8A3D]/30 text-xs text-[#666666] flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#F4511E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#171717]">Commercial Global Fulfillment</p>
              <p className="text-[11px] text-[#666666] mt-0.5 leading-relaxed">
                Dispatches within 24 hours from accredited regional merchant fulfillment center with escrow barcode verification.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Pricing, Commission Breakdown & Specs */}
        <div className="md:col-span-6 space-y-4">
          {/* Price & Rating */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#171717] font-mono">
                {formatCurrency(product.price ?? 0)}
              </span>
              <span className="text-xs text-[#666666] font-semibold">Retail Price</span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-[#666666]">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="ml-1 text-[#171717]">
                  {product.rating}
                </span>
              </div>
              <span>·</span>
              <span>{product.reviewsCount} verified audits</span>
              <span>·</span>
              <span className="text-[#16A34A] font-bold">
                {product.inventory} units available
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#666666] leading-relaxed">
            {product.description}
          </p>

          {/* Transparent Reward Allocation Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFF4ED] border border-[#FF8A3D]/40 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#171717]">
              <span className="flex items-center gap-1.5 text-[#E5390B]">
                <Sparkles className="w-4 h-4 text-[#F4511E]" />
                Task Commission Reward:
              </span>
              <span className="text-[#16A34A] font-extrabold text-base font-mono">
                +{formatCurrency(rewardAmount)}
              </span>
            </div>
            <div className="text-[11px] text-[#666666] leading-normal space-y-1 pt-1 border-t border-[#FF8A3D]/20">
              <div className="flex justify-between">
                <span>Tier Level:</span>
                <span className="font-bold text-[#171717]">Level {userLevel} ({userLevelConfig?.name})</span>
              </div>
              <div className="flex justify-between">
                <span>Settlement Condition:</span>
                <span className="text-[#16A34A] font-semibold">Instant credit upon Add to Cart</span>
              </div>
            </div>
          </div>

          {/* If Plan Limit Reached -> Upgrade Notice */}
          {isLimitReached ? (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Now You Need to Upgrade Plan</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                You have completed your 4 free trial tasks ($80 earned). Upgrade to Level 1 or higher to unlock unlimited tasks and instant withdrawals.
              </p>
              <button
                type="button"
                onClick={handleGoToPlans}
                className="w-full py-2.5 bg-[#F4511E] hover:bg-[#E5390B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Plan Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Purchase Stepper & Add to Cart */
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#171717] hover:bg-[#FFF4ED] rounded-lg text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#171717]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#171717] hover:bg-[#FFF4ED] rounded-lg text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className="flex-1 py-3 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] disabled:opacity-50 rounded-xl transition-all shadow-[0_4px_15px_rgba(244,81,30,0.3)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatCurrency((product.price ?? 0) * (quantity ?? 1))})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
