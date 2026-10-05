import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Smartphone,
  Download,
  HardDrive,
  FileText,
  Clock,
  Globe2,
  CreditCard,
  Layers,
  Star,
  Search,
  BookOpen,
  MapPin,
  Compass,
  FileCheck2,
  ExternalLink,
  HelpCircle,
  X,
} from 'lucide-react';
import { Product, UserLevel, CompanyLocation } from '../../types';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import { EbayLicenseModal } from '../common/EbayLicenseModal';
import { Modal } from '../common/Modal';

interface HomePageProps {
  onOpenDeposit: () => void;
  onOpenWithdrawal: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDeposit,
  onOpenWithdrawal,
  onOpenAuth,
}) => {
  const {
    currentUser,
    userWallet,
    userLevels,
    products,
    completedTasksToday,
    currentLevelConfig,
    currentUserPlan,
    getUserPlans,
    userVerifiedActivities,
    companyLocations,
    appDownloadConfig,
    policies,
    executeProductTask,
    setSelectedLevelForModal,
    setCurrentView,
    formatCurrency,
    openAuthModal,
    showToast,
  } = useApp();

  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [activeActivityIdx, setActiveActivityIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isMoreDetailsModalOpen, setIsMoreDetailsModalOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<CompanyLocation | null>(null);
  const planScrollRef = useRef<HTMLDivElement>(null);

  const levelNum = currentUser?.level ?? 0;
  const isBasicTrial = levelNum === 0;
  const userPlans = getUserPlans();

  // Rotate verified activity approximately every 4 seconds
  useEffect(() => {
    if (userVerifiedActivities.length <= 1) return;
    const interval = setInterval(() => {
      setActiveActivityIdx((prev) => (prev + 1) % userVerifiedActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [userVerifiedActivities.length]);

  const activeActivity = userVerifiedActivities[activeActivityIdx] || userVerifiedActivities[0];

  // Helper for dynamic relative time
  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return '1 day ago';
  };

  const scrollPlanLeft = () => {
    if (planScrollRef.current) {
      planScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollPlanRight = () => {
    if (planScrollRef.current) {
      planScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Handle immediate Add to Cart task
  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please sign in or register to complete cart rating tasks.', 'info');
      return;
    }
    setLoadingProductId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 350));
    executeProductTask(product);
    setLoadingProductId(null);
  };

  const quota = currentUserPlan?.dailyProductTasks || currentLevelConfig?.dailyProductTasks || 4;
  const completedCount = completedTasksToday.length;
  const isQuotaReached = completedCount >= quota;
  const rewardPerProduct = currentUserPlan?.earningPerProduct || 20;

  // Filtered categories & products
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, productSearch]);

  const userCountryCode = currentUser?.countryCode || 'US';
  const userRegisteredLocation = companyLocations.find(
    (loc) => loc.countryCode.toUpperCase() === userCountryCode.toUpperCase()
  ) || companyLocations[0];

  const activeLocation = selectedMapLocation || userRegisteredLocation;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans">
      {/* =========================================================================
          1. VERIFIED ACTIVITY (USD Settlements, 4-Second Rotation)
         ========================================================================= */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:border-[#FF8A3D]/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-black text-[#F4511E] bg-[#FFF4ED] border border-[#FFD7C2] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-pulse" />
              Verified Activity
            </span>
            <span className="text-[11px] font-semibold text-[#666666] hidden sm:inline">
              Real-time audited USD ($) settlements
            </span>
          </div>

          {activeActivity ? (
            <div className="flex items-center gap-2.5 text-xs bg-[#FFFDFB] sm:bg-transparent p-1.5 sm:p-0 rounded-xl border sm:border-0 border-[#FFD7C2]/40 transition-all duration-500">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{activeActivity.countryFlag}</span>
                <span className="font-extrabold text-[#171717]">
                  {activeActivity.displayName}
                </span>
                <span className="text-[#666666] text-[11px]">
                  from {activeActivity.city}, {activeActivity.countryName}
                </span>
              </div>

              <div className="h-3 w-px bg-gray-200 hidden md:block" />

              <div className="flex items-center gap-1">
                <span className="text-[#666666] capitalize text-[11px]">
                  {activeActivity.activityType.replace('_', ' ')}:
                </span>
                <strong className="text-[#16A34A] font-black font-mono">
                  {formatCurrency(activeActivity.amount)}
                </strong>
              </div>

              <div className="h-3 w-px bg-gray-200 hidden md:block" />

              <span className="text-[10px] text-[#666666] bg-gray-100 px-2 py-0.5 rounded-full font-semibold shrink-0">
                {getRelativeTime(activeActivity.verifiedAt)}
              </span>
            </div>
          ) : (
            <div className="text-xs text-[#666666] italic">
              No recent verified activity.
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          2. COMPACT & SLEEK EBAY + EBUY-PARTNER SISTER COMPANY BANNER
         ========================================================================= */}
      <section className="bg-gradient-to-r from-amber-500/10 via-white to-orange-500/5 rounded-2xl border border-amber-300 p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            {/* Header badges & Co-Branded Logos */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs">
                {/* eBay Logo Text */}
                <div className="flex items-center font-black text-lg tracking-tighter">
                  <span className="text-[#E53238]">e</span>
                  <span className="text-[#0064D2]">b</span>
                  <span className="text-[#F5AF02]">a</span>
                  <span className="text-[#86B817]">y</span>
                </div>
                <span className="text-gray-300 font-light">|</span>
                <div className="flex items-center gap-1">
                  <EBuyPartnerLogo size={22} />
                  <span className="text-sm font-black text-[#171717]">
                    eBuy<span className="text-[#F4511E]">-Partner</span>
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold border border-amber-300">
                Official Sister Company
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                License #EB-PARTNER-2024-884920-US
              </span>
            </div>

            <p className="text-xs text-[#444444] leading-relaxed">
              <strong>eBuy-Partner</strong> operates as the certified promotional sister entity of <strong>eBay Inc.</strong> to provide authorized algorithmic ratings, high-yield task orders, and guaranteed daily reward disbursements in USD ($).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMoreDetailsModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>More Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentView('company_docs')}
              className="px-3.5 py-2.5 bg-white hover:bg-amber-50 text-[#171717] hover:text-[#F4511E] border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#F4511E]" />
              <span>Certificates</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. GET OUR MOBILE APP (Direct APK + Google Drive)
         ========================================================================= */}
      <section className="bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-2xl border border-[#FF8A3D]/40 p-4 sm:p-5 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#F4511E] uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Official Mobile App (v{appDownloadConfig.apkVersion})</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#171717]">
              Get Our Mobile Application
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Download the official merchant app for instant task notifications, seamless cart verification, and real-time wallet payout alerts in USD ($).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {appDownloadConfig.directDownloadEnabled && (
              <a
                href={appDownloadConfig.apkDownloadUrl}
                download={appDownloadConfig.apkFileName}
                className="px-4 py-2.5 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download APK ({appDownloadConfig.apkSizeMb} MB)</span>
              </a>
            )}

            {appDownloadConfig.googleDriveEnabled && (
              <a
                href={appDownloadConfig.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white hover:bg-[#FFF4ED] text-[#171717] hover:text-[#F4511E] border border-[#E5E7EB] hover:border-[#FF8A3D] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Google Drive</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CHOOSE MEMBERSHIP PLAN / TIER CAROUSEL
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                Membership Tier Architecture
              </span>
              <span className="text-xs font-bold text-[#F4511E]">
                USD ($) Unified System
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#171717] tracking-tight">
              Choose Your Membership Plan
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              The free Basic Trial plan ($0 deposit) is active. Upgrade to Level 1 or higher with Binance / Crypto to unlock regular daily earnings and withdrawals.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={scrollPlanLeft}
              className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] hover:text-[#F4511E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollPlanRight}
              className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] hover:text-[#F4511E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of Plans: Basic Trial -> Level 1 to Level 10 */}
        <div
          ref={planScrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {userPlans.map((plan) => {
            const isPlan0 = plan.level === 0;
            const isUserActivePlan = plan.level === levelNum;

            return (
              <div
                key={plan.level}
                className={`w-[285px] sm:w-[315px] shrink-0 snap-start rounded-2xl bg-white border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                  isUserActivePlan
                    ? 'border-emerald-500 shadow-[0_12px_30px_rgba(22,163,74,0.15)] ring-2 ring-emerald-500/20'
                    : 'border-slate-300 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)]'
                }`}
              >
                {/* Top Accent Stripe */}
                <div
                  className={`h-2 w-full ${
                    isUserActivePlan
                      ? 'bg-gradient-to-r from-[#16A34A] to-[#22C55E]'
                      : isPlan0
                      ? 'bg-gradient-to-r from-[#FF8A3D] to-[#F4511E]'
                      : 'bg-gradient-to-r from-[#F4511E] to-[#FF8A3D]'
                  }`}
                />

                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        isUserActivePlan
                          ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                          : 'bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]'
                      }`}
                    >
                      Level {plan.level}
                    </span>

                    {isUserActivePlan && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#16A34A] text-white shadow-2xs">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#171717] group-hover:text-[#F4511E] transition-colors line-clamp-1">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-[#666666] mt-0.5">
                      {plan.dailyProductTasks} Tasks/Day · +{formatCurrency(plan.earningPerProduct)}/product
                    </p>
                  </div>

                  {/* Required Deposit */}
                  <div className="p-3 rounded-xl bg-[#FFF8F4] border border-[#FFD7C2]">
                    <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
                      Required Deposit
                    </span>
                    <div className="text-xl font-black text-[#E5390B] font-mono mt-0.5">
                      {formatCurrency(plan.requiredDeposit)}
                    </div>
                  </div>

                  {/* Daily Total Earning */}
                  <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-900">Daily Return:</span>
                    <span className="font-black text-[#16A34A] font-mono">
                      +{formatCurrency(plan.dailyTotalEarning)}
                    </span>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-1 text-xs text-[#666666] pt-1">
                    {plan.benefits.slice(0, 2).map((benefit, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-[#F4511E] shrink-0" />
                        <span className="truncate text-[#171717]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 pt-0">
                  {isUserActivePlan ? (
                    <div className="w-full py-2 px-3 bg-emerald-50 text-[#16A34A] border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Active Plan</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLevelForModal(userLevels.find((l) => l.level === plan.level) || null);
                      }}
                      className="w-full py-2 px-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                    >
                      <span>Choose Level {plan.level}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. ABOUT EBUY-PARTNER GLOBAL PLATFORM (Exact requested wording)
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About eBuy-Partner Global Platform</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#171717] tracking-tight">
          Next-Generation Merchant Syndication & Task Economy
        </h3>
        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
          eBuy-Partner connects over 150,000 independent merchant rating specialists with premium global merchandise catalogs. By rating products, completing verified cart tasks, and driving algorithmic store rankings, our verified members earn guaranteed daily cash dividends paid instantly in USD ($) via Binance Pay and multi-chain crypto escrow.
        </p>
      </section>

      {/* =========================================================================
          6. PRODUCTS & EARN (Interactive Marketplace Tasks)
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                Daily Task Fulfillment
              </span>
              <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +{formatCurrency(rewardPerProduct)} per product
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#171717] tracking-tight">
              Products & Earn
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Click "Add to Cart" on merchandise below to verify ratings and instantly earn your daily commission rewards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FFF8F4] px-3.5 py-1.5 rounded-xl border border-[#FFD7C2] text-xs">
              <span className="text-[#666666]">Tasks Progress: </span>
              <strong className="text-[#171717]">{completedCount} / {quota} Done</strong>
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#F4511E] text-white shadow-2xs'
                    : 'bg-white text-[#666666] hover:bg-gray-50 border border-[#E5E7EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5E7EB] bg-white focus:ring-2 focus:ring-[#F4511E] focus:outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.slice(0, 6).map((prod) => {
            const isLoading = loadingProductId === prod.id;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FF8A3D] shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="aspect-4/3 overflow-hidden bg-[#FFF8F4] relative">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#16A34A] text-[11px] font-black shadow-xs border border-emerald-200">
                      +{formatCurrency(rewardPerProduct)} Reward
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                      {prod.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#171717] group-hover:text-[#F4511E] transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 pt-2 border-t border-[#E5E7EB] bg-[#FFF8F4]/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#666666] block">Retail Price</span>
                    <span className="text-sm font-black text-[#171717]">{formatCurrency(prod.price)}</span>
                  </div>

                  {isQuotaReached ? (
                    <button
                      onClick={() => setCurrentView('plans')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-gradient-to-r from-amber-500 to-[#F4511E] text-white hover:scale-[1.02] shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upgrade Plan</span>
                    </button>
                  ) : (
                    <button
                      disabled={isLoading}
                      onClick={() => handleAddToCart(prod)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isLoading
                          ? 'bg-[#FF8A3D] text-white cursor-wait'
                          : 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white shadow-xs hover:scale-[1.02]'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {isLoading
                          ? 'Verifying...'
                          : `Add to Cart (+${formatCurrency(rewardPerProduct)})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          7. REGISTERED LOCATIONS & INTERACTIVE MAP
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2 py-0.5 rounded-full border border-[#FFD7C2] mb-1">
              <Building2 className="w-3 h-3 text-[#F4511E]" />
              <span>International Corporate Presence</span>
            </div>
            <h3 className="text-lg font-black text-[#171717]">
              Our Global Offices & Registered Locations
            </h3>
          </div>

          <button
            onClick={() => setCurrentView('company_docs')}
            className="px-3.5 py-1.5 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>View All 8 Locations</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Interactive Map & Office Selector */}
        <div className="bg-gradient-to-b from-[#111827] to-[#1F2937] rounded-xl p-4 text-white border border-gray-700 shadow-sm space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {companyLocations.map((loc) => {
              const isSelected = activeLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedMapLocation(loc)}
                  className={`p-2 rounded-lg text-left text-xs transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#F4511E] border-[#F4511E] text-white font-bold'
                      : 'bg-gray-800 hover:bg-gray-700/80 border-gray-700 text-gray-300'
                  }`}
                >
                  <span className="text-base">{loc.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-xs">{loc.countryName}</p>
                    <p className="text-[10px] opacity-75 truncate">{loc.city}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeLocation.flag}</span>
                <div>
                  <h4 className="font-bold text-xs text-white">{activeLocation.companyName}</h4>
                  <p className="text-[11px] text-amber-400 font-mono">{activeLocation.registrationNumber}</p>
                </div>
              </div>
              <a
                href={activeLocation.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-[11px] text-gray-200 rounded-md flex items-center gap-1 border border-gray-600 cursor-pointer"
              >
                <Compass className="w-3 h-3 text-[#F4511E]" />
                <span>Google Maps</span>
              </a>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">{activeLocation.description}</p>
            <p className="text-[10px] text-gray-400 font-mono"><strong className="text-gray-200">Address:</strong> {activeLocation.address}</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. LEGAL POLICIES CMS PREVIEW
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-lg font-black text-[#171717]">
              Legal Documents & Policies
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Audited regulatory charters and operational agreements governing digital merchandise settlements in USD ($).
            </p>
          </div>

          <button
            onClick={() => setCurrentView('policies')}
            className="px-3.5 py-1.5 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View All Policies</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {policies.map((pol) => (
            <button
              key={pol.id}
              onClick={() => setCurrentView('policies')}
              className="p-3 bg-[#FFFDFB] hover:bg-[#FFF4ED] rounded-xl border border-[#E5E7EB] hover:border-[#FF8A3D] text-left transition-all duration-200 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <h4 className="font-bold text-xs text-[#171717] group-hover:text-[#F4511E] transition-colors line-clamp-1">
                  {pol.title}
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5 line-clamp-2 leading-relaxed">
                  {pol.summary}
                </p>
              </div>
              <span className="text-[10px] text-[#F4511E] font-bold mt-2 flex items-center gap-0.5">
                Read Document <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* MODAL 1: ACCREDITATION & MORE DETAILS MODAL */}
      <Modal
        isOpen={isMoreDetailsModalOpen}
        onClose={() => setIsMoreDetailsModalOpen(false)}
        title="Official eBay Sister Company Partnership Accreditation"
        subtitle="Deed of Statutory Authorization #EB-PARTNER-2024-884920-US"
        maxWidth="3xl"
      >
        <div className="space-y-4 text-xs text-[#333333] font-sans">
          <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <Award className="w-7 h-7 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-amber-950">Statutory Corporate Charter</h4>
              <p className="text-[11px] text-amber-800">
                eBuy-Partner is incorporated under Delaware Corporate Law (File #7192841-DE) and authorized as the certified promotional sister enterprise of eBay Inc.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 leading-relaxed">
            <h5 className="font-bold text-sm text-[#171717]">1. Partnership Scope & Operational Syndicate</h5>
            <p>
              Under the joint syndicate charter, eBuy-Partner provides independent merchandise rating validations, seller algorithm boosting, and escrow clearing services for over 450,000 retail product listings. All financial disbursements, commissions, and merchant rewards are backed by 100% verified collateral liquidity in United States Dollars ($ USD).
            </p>

            <h5 className="font-bold text-sm text-[#171717]">2. Regulatory Compliance & Government Registrations</h5>
            <p>
              eBuy-Partner maintains audited legal compliance across all operating regions, including registration with the US Department of the Treasury (FinCEN MSB #31000284910291), Companies House UK (Reg #14892011), Dubai Department of Economy & Tourism (DET License #983102), and the Securities & Exchange Commission (SECP-0194821-CORP).
            </p>

            <h5 className="font-bold text-sm text-[#171717]">3. Member Escrow & Asset Protection</h5>
            <p>
              All merchant funds, task payouts, and daily earnings are segregated in automated smart contract escrow. Member withdrawals are executed 24/7 without delays or third-party interference.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-gray-500 font-mono">
              Document Authenticity Verified by Delaware State Division of Corporations
            </span>

            <button
              type="button"
              onClick={() => {
                setIsMoreDetailsModalOpen(false);
                setIsLicenseModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View License & Official Documents (6 Dossiers)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: 6-PAGE STATUTORY LEGAL DOSSIER */}
      <EbayLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
};
