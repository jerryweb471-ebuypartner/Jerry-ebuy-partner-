import React from 'react';
import { useApp } from '../../context/AppContext';
import { EBuyPartnerLogo } from '../common/EBuyPartnerLogo';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminDeposits } from './AdminDeposits';
import { AdminWithdrawals } from './AdminWithdrawals';
import { AdminUsers } from './AdminUsers';
import { AdminProducts } from './AdminProducts';
import { AdminCommissionRules } from './AdminCommissionRules';
import { AdminLevels } from './AdminLevels';
import { AdminLedger } from './AdminLedger';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminSettings } from './AdminSettings';
import { AdminCompanyDocs } from './AdminCompanyDocs';
import { AdminPaymentSettings } from './AdminPaymentSettings';
import { AdminAppDownload } from './AdminAppDownload';
import { AdminRefunds } from './AdminRefunds';
import { AdminPolicies } from './AdminPolicies';
import { ShieldCheck, LogOut, ArrowLeft, Activity, Lock, Award } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminSection, setCurrentView, currentUser, logout } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#171717] flex flex-col font-sans">
      {/* Dedicated Admin Portal Top Bar */}
      <header className="sticky top-0 z-40 bg-[#171717] text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <EBuyPartnerLogo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  eBuy-Partner
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#F4511E] text-white text-[10px] font-bold uppercase tracking-wider">
                  Governance
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  eBay Sister Network
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                USD Financial Infrastructure · Main Admin: Jerry@786
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Server Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Storage Persistent</span>
            </div>

            {/* Admin identity badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-[#F4511E]" />
              <span className="font-bold">{currentUser?.name || 'Jerry (Main Admin)'}</span>
            </div>

            {/* Exit to Client App button */}
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10"
              title="Return to Client View"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to App</span>
            </button>

            {/* Admin Sign Out button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors border border-rose-500/30"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {adminSection === 'dashboard' && <AdminDashboard />}
          {adminSection === 'payment_settings' && <AdminPaymentSettings />}
          {adminSection === 'app_download' && <AdminAppDownload />}
          {adminSection === 'refunds' && <AdminRefunds />}
          {adminSection === 'policies' && <AdminPolicies />}
          {adminSection === 'users' && <AdminUsers />}
          {adminSection === 'company_docs' && <AdminCompanyDocs />}
          {adminSection === 'deposits' && <AdminDeposits />}
          {adminSection === 'withdrawals' && <AdminWithdrawals />}
          {adminSection === 'orders' && <AdminOrders />}
          {adminSection === 'products' && <AdminProducts />}
          {adminSection === 'commissions' && <AdminCommissionRules />}
          {adminSection === 'levels' && <AdminLevels />}
          {adminSection === 'transactions' && <AdminLedger />}
          {adminSection === 'audit_logs' && <AdminAuditLogs />}
          {adminSection === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
