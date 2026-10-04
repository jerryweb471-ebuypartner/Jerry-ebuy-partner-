import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  ShoppingBag,
  Star,
  Check,
  Eye,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';

interface ProductCatalogProps {
  onOpenCart?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onOpenCart }) => {
  const {
    products,
    addToCart,
    currentUser,
    userLevels,
    currentLevelConfig,
    currentUserPlan,
    completedTasksToday,
    executeProductTask,
    setSelectedLevelForModal,
    setCurrentView,
    formatCurrency,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Selected product for detail inspection
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...list];
  }, [products]);

  const quota = currentUserPlan?.dailyProductTasks || currentLevelConfig?.dailyProductTasks || 4;
  const completedCount = completedTasksToday.length;
  const isQuotaReached = completedCount >= quota;
  const rewardAmount = currentUserPlan?.earningPerProduct || currentLevelConfig?.earningPerProduct || 20;
  const progressPercent = Math.min(100, Math.round((completedCount / quota) * 100));

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchCategory && !matchSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Handle Add to Cart Task
  const handleAddToCartTask = async (product: Product) => {
    setLoadingProductId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 350));
    executeProductTask(product);
    setLoadingProductId(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Quota Progress Banner - White + Orange Theme */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.12)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-[#FFF4ED] rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-3 py-1 rounded-full border border-[#FF8A3D]/30 inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#F4511E]" />
              {currentLevelConfig?.name || `Level ${currentUser?.level ?? 1}`}
            </span>
            <span className="text-xs font-semibold text-[#666666] bg-gray-100 px-2.5 py-0.5 rounded-full">
              Task Reward: <strong className="text-[#16A34A] font-bold">+{formatCurrency(rewardAmount)} / item</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] mt-2 tracking-tight">
            Product Order Marketplace
          </h1>
          <p className="text-xs text-[#666666] mt-1 max-w-xl leading-relaxed">
            Click "Add to Cart" below on any product to complete your daily verification task and get rewarded immediately.
          </p>
        </div>

        {/* Progress Display */}
        <div className="bg-[#FFF8F4] p-4 rounded-xl border border-[#FF8A3D]/30 min-w-[220px] relative z-10 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#666666] font-semibold">Today's Tasks:</span>
            <span className="font-extrabold text-[#171717]">
              {completedCount} / {quota} Done ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-white h-2.5 rounded-full mt-2 overflow-hidden border border-[#FF8A3D]/20">
            <div
              className="bg-gradient-to-r from-[#F4511E] to-[#FF6D00] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#16A34A] font-bold block mt-1.5 text-right">
            Earned today: {formatCurrency(completedCount * rewardAmount)}
          </span>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] text-white shadow-[0_4px_12px_rgba(244,81,30,0.25)]'
                  : 'bg-white text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] border border-[#E5E7EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#F4511E] focus:ring-2 focus:ring-[#F4511E]/20 bg-white text-[#171717]"
            />
          </div>

          <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-xl bg-white px-3 py-2 text-xs text-[#171717] shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#F4511E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-xs font-semibold cursor-pointer text-[#171717]"
            >
              <option value="newest">Featured</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID (3 columns on desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.06)]">
          <p className="text-sm font-bold text-[#171717]">No matching products found</p>
          <p className="text-xs text-[#666666] mt-1">Try adjusting your search query or category filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const isLoading = loadingProductId === prod.id;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(244,81,30,0.16)] hover:border-[#FF8A3D]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div
                    onClick={() => setInspectedProduct(prod)}
                    className="aspect-4/3 overflow-hidden bg-[#FFF8F4] relative cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Commission Tag */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-black text-[#16A34A] shadow-md border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                      Reward: +{formatCurrency(rewardAmount)}
                    </div>

                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 bg-[#171717]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-[#171717] text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#F4511E]" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#666666]">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                      <div className="flex items-center gap-1 text-[#171717] font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setInspectedProduct(prod)}
                      className="text-sm font-extrabold text-[#171717] hover:text-[#F4511E] cursor-pointer line-clamp-1 transition-colors"
                    >
                      {prod.name}
                    </h3>

                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Price & Add to Cart Action */}
                <div className="p-5 pt-3 border-t border-[#E5E7EB] bg-[#FFF8F4]/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
                      Retail Price
                    </span>
                    <span className="text-base font-black text-[#171717]">
                      {formatCurrency(prod.price ?? 0)}
                    </span>
                  </div>

                  {isQuotaReached ? (
                    <button
                      onClick={() => setCurrentView('plans')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-[#F4511E] text-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Upgrade Plan</span>
                    </button>
                  ) : (
                    <button
                      disabled={isLoading}
                      onClick={() => handleAddToCartTask(prod)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLoading
                          ? 'bg-[#FF8A3D] text-white cursor-wait'
                          : 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white shadow-[0_4px_12px_rgba(244,81,30,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {isLoading ? 'Verifying...' : `Add to Cart (+${formatCurrency(rewardAmount)})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail inspection modal */}
      {inspectedProduct && (
        <ProductDetailModal
          product={inspectedProduct}
          isOpen={true}
          onClose={() => setInspectedProduct(null)}
          onOpenCart={() => {
            if (onOpenCart) onOpenCart();
            setInspectedProduct(null);
          }}
        />
      )}
    </div>
  );
};
