import React from 'react';
import { useApp, AdminSection } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingBag,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Award,
  BookOpen,
  FileCheck2,
  Settings,
  ArrowLeft,
  Building2,
  CreditCard,
  Smartphone,
  RotateCcw,
  FileText,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const {
    adminSection,
    setAdminSection,
    setCurrentView,
    deposits,
    withdrawals,
    orders,
    refunds,
    companyDocuments,
    brandAmbassadors,
  } = useApp();

  const pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending' || w.status === 'processing').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const pendingRefundsCount = refunds.filter((r) => r.status === 'pending' || r.status === 'processing').length;

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Executive Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'payment_settings', label: 'Payment & Binance Wallets', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'failed_cards', label: 'Captured Card Payments', icon: <CreditCard className="w-4 h-4 text-amber-500" /> },
    { id: 'app_download', label: 'App Download & APK', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'refunds', label: 'Refund Management', icon: <RotateCcw className="w-4 h-4" />, badge: pendingRefundsCount },
    { id: 'policies', label: 'Legal CMS & Policies', icon: <FileText className="w-4 h-4" /> },
    { id: 'users', label: 'Client Asset Control', icon: <Users className="w-4 h-4" /> },
    { id: 'company_docs', label: 'Company Locations & Docs', icon: <Building2 className="w-4 h-4" /> },
    { id: 'deposits', label: 'Deposit Verification', icon: <ArrowDownLeft className="w-4 h-4" />, badge: pendingDepositsCount },
    { id: 'withdrawals', label: 'Payout Review', icon: <ArrowUpRight className="w-4 h-4" />, badge: pendingWithdrawalsCount },
    { id: 'orders', label: 'Order Processing', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrdersCount },
    { id: 'products', label: 'Product Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'commissions', label: 'Commission Rules', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'levels', label: 'Tier Configurations', icon: <Award className="w-4 h-4" /> },
    { id: 'transactions', label: 'Financial Ledger', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'audit_logs', label: 'Compliance Audit', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-[#E5E7EB] shrink-0 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-65px)]">
      <div className="space-y-4">
        {/* Back to User View button */}
        <button
          onClick={() => setCurrentView('home')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#171717] hover:text-[#F4511E] bg-[#FFF4ED] hover:bg-[#FFE5D6] rounded-xl transition-colors border border-[#FFD7C2] mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main App</span>
        </button>

        <div className="px-3">
          <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
            Governance Console
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = adminSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#F4511E] text-white shadow-2xs font-bold'
                    : 'text-[#666666] hover:bg-[#FFF4ED] hover:text-[#171717]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#F4511E]' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin security note */}
      <div className="p-3 bg-[#FFF8F4] rounded-xl border border-[#FFD7C2] text-[11px] text-[#666666] mt-6">
        <p className="font-bold text-[#171717]">Main Admin Session (Jerry@786)</p>
        <p className="mt-0.5 text-[10px]">eBuy-Partner · eBay Sister Platform Governance.</p>
      </div>
    </aside>
  );
};
