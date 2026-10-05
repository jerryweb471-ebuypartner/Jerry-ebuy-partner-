import React, { useState, useRef, useEffect } from 'react';
import { useApp, ViewType } from '../../context/AppContext';
import { EBuyPartnerLogo } from './EBuyPartnerLogo';
import { EbayLicenseModal } from './EbayLicenseModal';
import {
  ShoppingBag,
  Bell,
  Check,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Building2,
  Lock,
  Layers,
  FileCheck2,
  Award,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAuth }) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    cart,
    userWallet,
    userNotifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    currentLevelConfig,
    completedTasksToday,
    formatCurrency,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const remainingTasks = Math.max(
    0,
    (currentLevelConfig?.dailyProductTasks || 3) - completedTasksToday.length
  );

  const navLinks: { label: string; view: ViewType; badge?: number }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Deposit & Plans', view: 'plans' },
    { label: 'Products', view: 'products' },
    { label: 'Top Ranking', view: 'ranking' },
    {
      label: 'Tasks',
      view: 'tasks',
      badge: remainingTasks > 0 ? remainingTasks : undefined,
    },
    { label: 'Company Docs', view: 'company_docs' },
    { label: 'Profile', view: 'profile' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] pt-2 sm:pt-0 [padding-top:max(0.6rem,env(safe-area-inset-top))] sm:[padding-top:0px] transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Zone 1: Wordmark */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setCurrentView(currentUser ? 'home' : 'landing')}
                className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
              >
                <EBuyPartnerLogo size={32} />
                <div className="flex flex-col justify-center">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#171717] group-hover:text-[#F4511E] transition-colors leading-none whitespace-nowrap">
                    eBuy<span className="text-[#F4511E]">-Partner</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium tracking-tight mt-0.5 whitespace-nowrap">
                    With eBay Registered Company
                  </span>
                </div>
              </button>

              {/* License Button */}
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold transition-colors shadow-2xs cursor-pointer"
                title="Inspect Official eBay Sister Company License"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>eBay License Verified</span>
              </button>
            </div>

            {/* Zone 2: Navigation links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#666666]">
              {currentUser ? (
                navLinks.map((link) => {
                  const isActive = currentView === link.view;
                  return (
                    <button
                      key={link.view}
                      onClick={() => setCurrentView(link.view)}
                      className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                        isActive
                          ? 'text-[#F4511E] font-bold'
                          : 'text-[#666666] hover:text-[#171717]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]">
                          {link.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F4511E] rounded-full" />
                      )}
                    </button>
                  );
                })
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView('landing')}
                    className="text-[#666666] hover:text-[#171717] transition-colors"
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setCurrentView('plans')}
                    className="text-[#666666] hover:text-[#171717] transition-colors"
                  >
                    Deposit Plans
                  </button>
                  <button
                    onClick={() => setCurrentView('products')}
                    className="text-[#666666] hover:text-[#171717] transition-colors"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => setCurrentView('company_docs')}
                    className="text-[#666666] hover:text-[#171717] transition-colors"
                  >
                    Legal Certificates
                  </button>
                  <button
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="text-amber-700 hover:text-amber-900 font-bold transition-colors flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>eBay License</span>
                  </button>
                </>
              )}
            </nav>

            {/* Zone 3: Actions & Profile (Country -> Notification with count -> Cart -> Profile Photo) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* 1. Country Flag & Currency */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-sm sm:text-base leading-none">
                  {currentUser?.countryFlag || '🌐'}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#171717]">
                  {currentUser?.currency || 'USD'}
                </span>
              </div>

              {/* 2. Notifications Bell with Exact Count Badge */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-1.5 sm:p-2 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] transition-colors cursor-pointer"
                  aria-label="View notifications"
                >
                  <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#F4511E] text-white text-[9px] font-black flex items-center justify-center font-mono ring-2 ring-white shadow-xs">
                    {unreadNotificationCount > 0 ? unreadNotificationCount : userNotifications.length}
                  </span>
                </button>

                {isNotifOpen && (
                  <div className="fixed inset-x-3 top-18 sm:top-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-2 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] py-3 z-50 animate-in fade-in zoom-in-95 max-h-[75vh] flex flex-col">
                    <div className="px-4 py-2.5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#F4511E]" />
                        <span className="text-sm font-black text-[#171717]">
                          {unreadNotificationCount > 0 ? unreadNotificationCount : userNotifications.length} Notifications
                        </span>
                        {unreadNotificationCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FFF4ED] text-[#F4511E] border border-[#FFD7C2]">
                            {unreadNotificationCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {unreadNotificationCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-[#F4511E] hover:underline font-bold cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotifOpen(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-600 text-xs font-bold px-1.5 py-0.5 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="overflow-y-auto divide-y divide-[#E5E7EB] flex-1">
                      {userNotifications.length === 0 ? (
                        <div className="p-8 text-center text-xs text-[#666666] space-y-1">
                          <Bell className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                          <p className="font-bold text-[#171717]">No notifications recorded</p>
                          <p className="text-[11px] text-gray-500">Live task rewards and balance updates will appear here.</p>
                        </div>
                      ) : (
                        userNotifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) setCurrentView(n.link as ViewType);
                              setIsNotifOpen(false);
                            }}
                            className={`p-3.5 hover:bg-[#FFF8F4] cursor-pointer transition-colors text-left flex items-start gap-3 ${
                              !n.read ? 'bg-[#FFF4ED]/40 border-l-3 border-[#F4511E]' : ''
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              <span
                                className={`w-2 h-2 rounded-full inline-block ${
                                  !n.read ? 'bg-[#F4511E]' : 'bg-gray-300'
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs font-bold leading-tight ${!n.read ? 'text-[#171717]' : 'text-gray-600'}`}>
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-gray-400 font-mono tabular-nums shrink-0">
                                  {n.createdAt}
                                </span>
                              </div>
                              <p className="text-xs text-[#444444] mt-1 leading-relaxed">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 pt-2.5 border-t border-[#E5E7EB] text-center shrink-0">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setIsNotifOpen(false);
                        }}
                        className="text-xs text-[#F4511E] hover:underline font-bold cursor-pointer"
                      >
                        View Account Assets & Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Shopping Cart Button with count */}
              <button
                onClick={onOpenCart}
                className="relative p-1.5 sm:p-2 text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] rounded-xl transition-colors cursor-pointer"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#F4511E] text-white text-[9px] font-bold flex items-center justify-center font-mono ring-2 ring-white">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* 4. Profile Photo / Avatar with Tap Dropdown Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Open Account Menu"
                >
                  {currentUser ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#FFD7C2]"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-[#666666] hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                          <p className="font-bold text-[#171717] truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-[#666666] truncate font-mono">{currentUser.email}</p>
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#F4511E] font-bold">
                            <span>{currentUser.countryFlag} {currentUser.country}</span>
                            <span>·</span>
                            <span>Level {currentUser.level}</span>
                          </div>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              setCurrentView('profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span>Profile & Assets</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('plans');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-[#F4511E]" />
                            <span>Deposit & Tier Plans</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsLicenseModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>Inspect eBay License</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('company_docs');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Building2 className="w-4 h-4 text-[#F4511E]" />
                            <span>Company Registrations</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('privacy_policy');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <FileCheck2 className="w-4 h-4" />
                            <span>Privacy Policy & Legal</span>
                          </button>
                        </div>

                        <div className="border-t border-[#E5E7EB] pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                          <p className="font-bold text-[#171717]">Guest Account</p>
                          <p className="text-[11px] text-[#666666]">Sign in to access tasks & earnings</p>
                        </div>

                        <div className="p-2 space-y-1.5">
                          <button
                            onClick={() => {
                              onOpenAuth('login');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full py-2 px-3 text-center text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-colors cursor-pointer"
                          >
                            Sign In to Account
                          </button>
                          <button
                            onClick={() => {
                              onOpenAuth('register');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full py-1.5 px-3 text-center text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                          >
                            Register New Account
                          </button>
                        </div>

                        <div className="border-t border-[#E5E7EB] py-1">
                          <button
                            onClick={() => {
                              setCurrentView('profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span>Profile Overview</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('plans');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-[#F4511E]" />
                            <span>Deposit & Tier Plans</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsLicenseModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>Inspect eBay License</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('company_docs');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Building2 className="w-4 h-4 text-[#F4511E]" />
                            <span>Company Documents</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Desktop Direct Sign In Button (hidden on mobile) */}
              {!currentUser && (
                <div className="hidden lg:flex items-center gap-2 ml-1">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#171717] hover:text-[#F4511E] transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    Apply to Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global eBay License Certificate Modal */}
      <EbayLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </>
  );
};
