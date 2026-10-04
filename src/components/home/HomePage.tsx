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
} from 'lucide-react';
import { Product, UserLevel } from '../../types';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import { EbayLicenseModal } from '../common/EbayLicenseModal';

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
  } = useApp();

  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [activeActivityIdx, setActiveActivityIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
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

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 font-sans">
      {/* =========================================================================
          SECTION 1: VERIFIED ACTIVITY (USD Settlements, 4-Second Rotation)
         ========================================================================= */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-[#FF8A3D]/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-black text-[#F4511E] bg-[#FFF4ED] border border-[#FFD7C2] px-3 py-1 rounded-full shrink-0 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-pulse" />
              Verified Activity
            </span>
            <span className="text-[11px] font-semibold text-[#666666] hidden sm:inline">
              Real-time audited Binance & crypto USD ($) settlements
            </span>
          </div>

          {activeActivity ? (
            <div className="flex items-center gap-3 text-xs bg-[#FFFDFB] sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-[#FFD7C2]/40 transition-all duration-500">
              <div className="flex items-center gap-2">
                <span className="text-base">{activeActivity.countryFlag}</span>
                <span className="font-extrabold text-[#171717]">
                  {activeActivity.displayName}
                </span>
                <span className="text-[#666666]">
                  from {activeActivity.city}, {activeActivity.countryName}
                </span>
              </div>

              <div className="h-3.5 w-px bg-gray-200 hidden md:block" />

              <div className="flex items-center gap-1.5">
                <span className="text-[#666666] capitalize font-medium">
                  {activeActivity.activityType.replace('_', ' ')}:
                </span>
                <strong className="text-[#16A34A] font-black font-mono">
                  {formatCurrency(activeActivity.amount)}
                </strong>
              </div>

              <div className="h-3.5 w-px bg-gray-200 hidden md:block" />

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
          OFFICIAL EBAY SISTER ENTITY & STATUTORY LICENSING TRUST BANNER
         ========================================================================= */}
      <section className="bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 rounded-3xl border-2 border-amber-300/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(245,175,2,0.12)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-black shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>eBay Official Sister Company & Certified Partner</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                License #EB-PARTNER-2024-884920-US
              </span>
            </div>

            <div className="flex items-center gap-3">
              <EBuyPartnerLogo size={46} />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                  eBuy-Partner Commercial Network
                </h2>
                <p className="text-xs font-bold text-[#0064D2]">
                  Authorized Affiliate & Promotional Sister Entity of eBay Inc. (San Jose, CA)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
              <strong>eBuy-Partner</strong> operates under statutory international trade alliance with <strong>eBay Inc.</strong> to provide certified merchandise evaluations, algorithmic seller ratings, and guaranteed task reward settlements in United States Dollars ($ USD).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/70">
                <span className="text-[#666666] block text-[10px]">Affiliate Parent</span>
                <strong className="text-[#171717]">eBay Inc. (USA)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/70">
                <span className="text-[#666666] block text-[10px]">Currency Clearing</span>
                <strong className="text-[#16A34A]">USD ($) Exclusive</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/70">
                <span className="text-[#666666] block text-[10px]">Statutory Status</span>
                <strong className="text-emerald-700">100% Certified</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/70">
                <span className="text-[#666666] block text-[10px]">Global Hubs</span>
                <strong className="text-[#171717]">8 Jurisdictions</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
            {/* Action 1: Open Official eBay License Modal */}
            <button
              onClick={() => setIsLicenseModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-[0_4px_15px_rgba(245,175,2,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Award className="w-4 h-4" />
              <span>Inspect eBay License Deed</span>
            </button>

            {/* Action 2: Company Registrations */}
            <button
              onClick={() => setCurrentView('company_docs')}
              className="px-5 py-3.5 bg-white hover:bg-amber-50/50 text-[#171717] hover:text-[#F4511E] border border-amber-300 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#F4511E]" />
              <span>Corporate Registrations</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: DOWNLOAD OUR APP (Direct APK + Google Drive)
         ========================================================================= */}
      <section className="bg-gradient-to-r from-[#FFF4ED] via-white to-[#FFF8F4] rounded-3xl border-2 border-[#FF8A3D]/40 p-6 sm:p-8 shadow-[0_8px_25px_rgba(244,81,30,0.08)] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#FFE5D4]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#FF8A3D]/40 text-[#F4511E] text-xs font-bold shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-[#F4511E]" />
              <span>Official Mobile Application</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Get Our Mobile App
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Download the official verified merchant application for instant task notifications, seamless cart verification, and real-time wallet payout alerts in USD ($).
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#666666] pt-1">
              <span>Version: <strong>{appDownloadConfig.apkVersion}</strong></span>
              <span>·</span>
              <span>Package Size: <strong>{appDownloadConfig.apkSizeMb} MB</strong></span>
              <span>·</span>
              <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Virus & Malware Free
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Option 1: Direct APK Download */}
            {appDownloadConfig.directDownloadEnabled && (
              <a
                href={appDownloadConfig.apkDownloadUrl}
                download={appDownloadConfig.apkFileName}
                className="px-5 py-3.5 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-extrabold shadow-[0_4px_15px_rgba(244,81,30,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </a>
            )}

            {/* Option 2: Google Drive Download */}
            {appDownloadConfig.googleDriveEnabled && (
              <a
                href={appDownloadConfig.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white hover:bg-[#FFF4ED] text-[#171717] hover:text-[#F4511E] border border-[#E5E7EB] hover:border-[#FF8A3D] rounded-xl text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-[#4285F4]" />
                <span>Download from Google Drive</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CURRENT PLAN & CHOOSE PLAN (Basic Trial -> Level 1 to 10)
         ========================================================================= */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                Membership Tier Architecture
              </span>
              <span className="text-xs font-bold text-[#F4511E]">
                USD ($) Unified System
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Your Current Plan & Available Upgrades
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              The free Basic Trial plan ($0 deposit) is already active. Upgrade to Level 1 or higher with Binance / Crypto to unlock regular daily earnings and withdrawals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollPlanLeft}
              className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] hover:text-[#F4511E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollPlanRight}
              className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F4511E] text-[#171717] hover:text-[#F4511E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of Plans: Basic Trial -> Level 1 to Level 10 */}
        <div
          ref={planScrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {userPlans.map((plan) => {
            const isPlan0 = plan.level === 0;
            const isUserActivePlan = plan.level === levelNum;
            const isUserOwnedTrial = isPlan0 && isBasicTrial;

            return (
              <div
                key={plan.level}
                className={`w-[260px] sm:w-[290px] shrink-0 snap-start rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                  isUserActivePlan
                    ? 'border-[#16A34A] shadow-[0_12px_30px_rgba(22,163,74,0.12)] ring-2 ring-[#16A34A]/20'
                    : isPlan0
                    ? 'border-[#FFD7C2] shadow-xs bg-[#FFFDFB]'
                    : 'border-[#E5E7EB] shadow-xs hover:border-[#F4511E] hover:shadow-[0_10px_25px_rgba(244,81,30,0.1)]'
                }`}
              >
                {/* Top Accent Stripe */}
                <div
                  className={`h-1.5 w-full ${
                    isUserActivePlan
                      ? 'bg-[#16A34A]'
                      : isPlan0
                      ? 'bg-[#FF8A3D]'
                      : 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00]'
                  }`}
                />

                <div className="p-4 sm:p-5 space-y-3">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        isPlan0
                          ? 'bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]'
                          : 'bg-gray-100 text-[#171717]'
                      }`}
                    >
                      {isPlan0 ? 'Basic Trial' : `Level ${plan.level}`}
                    </span>

                    {isUserActivePlan && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Current Plan
                      </span>
                    )}
                  </div>

                  {/* Plan Name & Ownership Message */}
                  <div>
                    <h3 className="text-base font-extrabold text-[#171717] line-clamp-1">
                      {plan.name}
                    </h3>
                    {isUserOwnedTrial && (
                      <p className="text-[11px] text-[#16A34A] font-bold mt-0.5">
                        You already have this plan
                      </p>
                    )}
                    {!isPlan0 && (
                      <p className="text-[11px] text-[#666666]">
                        Deposit Required
                      </p>
                    )}
                  </div>

                  {/* Pricing Display (USD ONLY, No Master PKR) */}
                  <div className="p-3 rounded-xl bg-[#FFF8F4] border border-[#FFD7C2]">
                    <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
                      {isPlan0 ? 'Trial Deposit' : 'Deposit Price'}
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#E5390B] font-mono mt-0.5">
                      {formatCurrency(plan.deposit)}
                    </div>
                  </div>

                  {/* Tasks & Rewards Summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#666666] block font-medium">
                        {isPlan0 ? 'Trial Tasks' : 'Daily Tasks'}
                      </span>
                      <span className="text-xs font-black text-[#171717]">{plan.products} Products</span>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#666666] block font-medium">Per Product</span>
                      <span className="text-xs font-black text-[#16A34A] font-mono">
                        +{formatCurrency(plan.per_product)}
                      </span>
                    </div>
                  </div>

                  {/* Daily / Trial Potential */}
                  <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-900">
                      {isPlan0 ? 'Total Trial Reward:' : 'Daily Potential:'}
                    </span>
                    <span className="font-black text-[#16A34A] font-mono text-sm">
                      +{formatCurrency(plan.daily_potential)}
                    </span>
                  </div>

                  {/* Feature Highlights */}
                  <ul className="space-y-1 text-xs text-[#666666]">
                    {plan.benefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#F4511E] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[#171717] line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom Action */}
                <div className="p-4 sm:p-5 pt-0">
                  {isPlan0 ? (
                    <div className="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-[#16A34A] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Already Yours (Active)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLevelForModal(userLevels.find((l) => l.level === plan.level) || null);
                      }}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
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
          SECTION 4: OUR GLOBAL PRESENCE (Company Locations in 8 Jurisdictions)
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2] mb-1">
              <Building2 className="w-3 h-3 text-[#F4511E]" />
              <span>International Corporate Presence</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#171717]">
              Our Global Offices & Registered Locations
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Explore our registered company offices and statutory legal charters across 8 international economies.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('company_docs')}
            className="px-4 py-2 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Explore All 8 Locations</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Highlighted Registered Country Office + Preview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* User's Registered Country Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#FFF9F5] via-white to-[#FFF4ED] border-2 border-[#FF8A3D] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F4511E] text-white text-[10px] font-bold uppercase tracking-wider">
                  Featured Statutory Office
                </span>
                <span className="text-2xl p-1 bg-white rounded-lg border border-[#FFD7C2]">{userRegisteredLocation.flag}</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-[#171717]">{userRegisteredLocation.countryName}</h4>
                <p className="text-xs font-medium text-[#F4511E]">{userRegisteredLocation.companyName} • {userRegisteredLocation.city}</p>
                <p className="text-xs text-[#555555] mt-1.5 line-clamp-2">{userRegisteredLocation.description}</p>
              </div>

              <div className="text-xs text-[#666666] space-y-1 bg-white/80 p-2.5 rounded-xl border border-[#FFD7C2]/60">
                <p className="truncate"><strong className="text-[#171717]">Address:</strong> {userRegisteredLocation.address}</p>
                <p className="truncate"><strong className="text-[#171717]">Reg #:</strong> {userRegisteredLocation.registrationNumber}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FFD7C2] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {userRegisteredLocation.documents?.length || 0} Documents Available
              </span>
              <button
                onClick={() => setCurrentView('company_docs')}
                className="px-3 py-1.5 bg-[#F4511E] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1"
              >
                <span>View Documents</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Preview Cards of other locations */}
          {companyLocations
            .filter((loc) => loc.countryCode.toUpperCase() !== userCountryCode.toUpperCase())
            .slice(0, 2)
            .map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FF8A3D] p-5 shadow-2xs flex flex-col justify-between group transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-1 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">{loc.flag}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold">
                      Verified
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-[#171717] group-hover:text-[#F4511E] transition-colors">
                      {loc.countryName}
                    </h4>
                    <p className="text-[11px] text-[#666666] font-medium">{loc.city}</p>
                    <p className="text-[11px] text-[#666666] mt-1 line-clamp-2">{loc.description}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#888888]">{loc.documents?.length || 0} Files</span>
                  <button
                    onClick={() => setCurrentView('company_docs')}
                    className="text-[#F4511E] hover:text-[#E64A19] font-bold flex items-center gap-0.5 text-xs"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LEGAL DOCUMENTS & POLICIES (All 8 CMS Policies)
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2] mb-1">
              <ShieldCheck className="w-3 h-3 text-[#F4511E]" />
              <span>Compliance & Consumer Protection</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#171717]">
              Legal Documents & Policies
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Audited regulatory charters and operational agreements governing digital merchandise settlements in USD ($).
            </p>
          </div>

          <button
            onClick={() => setCurrentView('policies')}
            className="px-4 py-2 bg-[#FFF4ED] hover:bg-[#FFE5D4] text-[#F4511E] border border-[#FFD7C2] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View All Policies</span>
          </button>
        </div>

        {/* 8 Policies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {policies.map((pol) => (
            <button
              key={pol.id}
              onClick={() => setCurrentView('policies')}
              className="p-4 bg-[#FFFDFB] hover:bg-[#FFF4ED] rounded-2xl border border-[#E5E7EB] hover:border-[#FF8A3D] text-left transition-all duration-200 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] group-hover:border-[#FF8A3D] text-[#F4511E] flex items-center justify-center mb-2.5 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-[#171717] group-hover:text-[#F4511E] transition-colors">
                  {pol.title}
                </h4>
                <p className="text-[11px] text-[#666666] mt-1 line-clamp-2 leading-relaxed">
                  {pol.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#666666] pt-3 border-t border-[#E5E7EB]/60 mt-3 font-semibold">
                <span>{pol.category}</span>
                <span className="text-[#F4511E] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Read <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PRODUCTS & EARN (Interactive Marketplace Tasks)
         ========================================================================= */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F4511E] bg-[#FFF4ED] px-2.5 py-0.5 rounded-full border border-[#FFD7C2]">
                Daily Task Fulfillment
              </span>
              <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +{formatCurrency(rewardPerProduct)} per product
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Products & Earn
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Click "Add to Cart" on merchandise below to verify ratings and instantly earn your daily commission rewards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FFF8F4] px-4 py-2 rounded-xl border border-[#FFD7C2] text-xs">
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.slice(0, 6).map((prod) => {
            const isLoading = loadingProductId === prod.id;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FF8A3D] shadow-xs hover:shadow-[0_12px_28px_rgba(244,81,30,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="aspect-4/3 overflow-hidden bg-[#FFF8F4] relative">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#16A34A] text-xs font-black shadow-xs border border-emerald-200">
                      +{formatCurrency(rewardPerProduct)} Reward
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
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

                <div className="p-4 pt-2 border-t border-[#E5E7EB] bg-[#FFF8F4]/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#666666] block">Retail Price</span>
                    <span className="text-sm font-black text-[#171717]">{formatCurrency(prod.price)}</span>
                  </div>

                  <button
                    disabled={isQuotaReached || isLoading}
                    onClick={() => handleAddToCart(prod)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isQuotaReached
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-[#E5E7EB]'
                        : isLoading
                        ? 'bg-[#FF8A3D] text-white cursor-wait'
                        : 'bg-gradient-to-r from-[#F4511E] to-[#FF6D00] hover:from-[#E5390B] hover:to-[#F4511E] text-white shadow-xs hover:scale-[1.02]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {isQuotaReached
                        ? 'Quota Reached'
                        : isLoading
                        ? 'Verifying...'
                        : `Add to Cart (+${formatCurrency(rewardPerProduct)})`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official eBay License Modal */}
      <EbayLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
};
