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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] pt-3 sm:pt-0 [padding-top:max(0.75rem,env(safe-area-inset-top))] sm:[padding-top:0px] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Zone 1: Wordmark & eBay Partner Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView(currentUser ? 'home' : 'landing')}
                className="flex items-center gap-2.5 text-left group"
              >
                <EBuyPartnerLogo size={36} />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#171717] group-hover:text-[#F4511E] transition-colors leading-none">
                    eBuy<span className="text-[#F4511E]">-Partner</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#666666] tracking-wide mt-0.5">
                    eBay Sister Company
                  </span>
                </div>
              </button>

              {/* License Button */}
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold transition-colors shadow-2xs"
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

            {/* Zone 3: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser ? (
                <>
                  {/* Country Flag & Currency */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-base leading-none">
                      {currentUser.countryFlag || '🌐'}
                    </span>
                    <span className="text-[11px] font-bold text-[#171717] hidden sm:inline">
                      {currentUser.currency || 'USD'}
                    </span>
                  </div>

                  {/* Notifications Bell */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="relative p-2 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] transition-colors"
                      aria-label="View notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotificationCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4511E] ring-2 ring-white" />
                      )}
                    </button>

                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#E5E7EB] py-3 z-50 animate-in fade-in zoom-in-95">
                        <div className="px-4 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                          <span className="text-sm font-bold text-[#171717]">Notifications</span>
                          {unreadNotificationCount > 0 && (
                            <button
                              onClick={markAllNotificationsRead}
                              className="text-xs text-[#F4511E] hover:underline font-semibold"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
                          {userNotifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-[#666666]">
                              No notifications recorded
                            </div>
                          ) : (
                            userNotifications.slice(0, 8).map((n) => (
                              <div
                                key={n.id}
                                onClick={() => {
                                  markNotificationRead(n.id);
                                  if (n.link) setCurrentView(n.link as ViewType);
                                  setIsNotifOpen(false);
                                }}
                                className={`p-3.5 hover:bg-[#FFF8F4] cursor-pointer transition-colors text-left flex items-start gap-3 ${
                                  !n.read ? 'bg-[#FFF4ED]/50' : ''
                                }`}
                              >
                                <div className="shrink-0 mt-0.5">
                                  <span
                                    className={`w-2 h-2 rounded-full inline-block ${
                                      !n.read ? 'bg-[#F4511E]' : 'bg-transparent'
                                    }`}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-[#171717] leading-tight">
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-[#666666] mt-0.5 line-clamp-2">
                                    {n.message}
                                  </p>
                                  <p className="text-[10px] text-[#666666] mt-1 font-mono tabular-nums">
                                    {n.createdAt}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="px-4 pt-2 border-t border-[#E5E7EB] text-center">
                          <button
                            onClick={() => {
                              setCurrentView('notifications');
                              setIsNotifOpen(false);
                            }}
                            className="text-xs text-[#F4511E] hover:underline font-bold"
                          >
                            View all activity logs
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart Icon Button */}
                  <button
                    onClick={onOpenCart}
                    className="relative p-2 text-[#666666] hover:text-[#171717] hover:bg-[#FFF4ED] rounded-xl transition-colors"
                    aria-label="View shopping cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F4511E] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        {totalCartCount}
                      </span>
                    )}
                  </button>

                  {/* User Avatar Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FFD7C2]"
                      />
                      <ChevronDown className="w-3.5 h-3.5 text-[#666666] hidden sm:block" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
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
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span>Profile & Assets</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('plans');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium"
                          >
                            <Sparkles className="w-4 h-4 text-[#F4511E]" />
                            <span>Deposit & Tier Plans</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsLicenseModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-medium"
                          >
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>Inspect eBay License</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('company_docs');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium"
                          >
                            <Building2 className="w-4 h-4 text-[#F4511E]" />
                            <span>Company Registrations</span>
                          </button>
                          <button
                            onClick={() => {
                              setCurrentView('privacy_policy');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-[#171717] hover:bg-[#FFF4ED] hover:text-[#F4511E] flex items-center gap-2 font-medium"
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
                            className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#171717] hover:text-[#F4511E] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#F4511E] hover:bg-[#E5390B] rounded-xl transition-colors shadow-2xs"
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
