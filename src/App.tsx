import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { DepositModal } from './components/wallet/DepositModal';
import { WithdrawalModal } from './components/wallet/WithdrawalModal';
import { LevelDetailsModal } from './components/levels/LevelDetailsModal';
import { LevelZeroAlertModal } from './components/common/LevelZeroAlertModal';

// Primary Core Views
import { HomePage } from './components/home/HomePage';
import { ProductCatalog } from './components/marketplace/ProductCatalog';
import { TopRankingPage } from './components/ranking/TopRankingPage';
import { TotalTasksPage } from './components/tasks/TotalTasksPage';
import { UserProfilePage } from './components/profile/UserProfilePage';

// Dedicated New Pages
import { PlansPage } from './components/plans/PlansPage';
import { CompanyDocsPage } from './components/documents/CompanyDocsPage';
import { PrivacyPolicyPage } from './components/policy/PrivacyPolicyPage';
import { PoliciesPage } from './components/policy/PoliciesPage';

// Additional Views
import { OrderHistory } from './components/orders/OrderHistory';
import { WalletPage } from './components/wallet/WalletPage';
import { CommissionPage } from './components/commission/CommissionPage';
import { UserLevelsPage } from './components/levels/UserLevelsPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';

// Dedicated Admin Portal
import { AdminLayout } from './components/admin/AdminLayout';

const MainLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    selectedLevelForModal,
    setSelectedLevelForModal,
    levelAlert,
    setLevelAlert,
    upgradeUserToLevel,
    authModalState,
    openAuthModal,
    closeAuthModal,
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositInitialAmount, setDepositInitialAmount] = useState<number>(500);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    openAuthModal(mode);
  };

  const handleOpenDepositWithAmount = (amt: number) => {
    setDepositInitialAmount(amt);
    setIsDepositOpen(true);
  };

  // STRICT ADMIN ACCESS GUARD: When master admin (jerryhun47@gmail.com) is logged in, render EXCLUSIVELY Admin Portal
  const isAdminUser = currentUser?.role === 'admin';

  // If on admin session, render ONLY dedicated Admin Portal Layout (zero client widgets or exit)
  if (isAdminUser) {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
      </>
    );
  }

  // Regular Client View Layout
  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#171717] flex flex-col font-sans pb-20 lg:pb-0">
      {/* 3-Zone Standard Top Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingPage onOpenAuth={handleOpenAuth} />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Primary View 1: Home Page */}
          {(currentView === 'home' || currentView === 'dashboard') && (
            <HomePage
              onOpenDeposit={() => setCurrentView('plans')}
              onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {/* Primary View 2: Plans & Deposit Dedicated Page */}
          {currentView === 'plans' && (
            <PlansPage
              onOpenDepositForPlan={handleOpenDepositWithAmount}
            />
          )}

          {/* Primary View 3: Products Page */}
          {(currentView === 'products' || currentView === 'marketplace') && (
            <ProductCatalog onOpenCart={() => setIsCartOpen(true)} />
          )}

          {/* Primary View 4: Top Ranking Leaderboard */}
          {currentView === 'ranking' && <TopRankingPage />}

          {/* Primary View 5: Total Tasks Hub */}
          {currentView === 'tasks' && <TotalTasksPage />}

          {/* Primary View 6: Profile & Assets */}
          {currentView === 'profile' && (
            <UserProfilePage
              onOpenDeposit={() => setCurrentView('plans')}
              onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            />
          )}

          {/* Primary View 7: Company Registrations & Brand Ambassadors */}
          {currentView === 'company_docs' && <CompanyDocsPage />}

          {/* Primary View 8: Privacy Policy & Compliance */}
          {currentView === 'privacy_policy' && <PrivacyPolicyPage />}

          {/* Primary View 9: Legal CMS Policies */}
          {currentView === 'policies' && <PoliciesPage />}

          {/* Secondary Views */}
          {currentView === 'orders' && (
            <OrderHistory
              initialSelectedOrderId={selectedOrderId}
              onClearInitialOrder={() => setSelectedOrderId(null)}
            />
          )}

          {currentView === 'wallet' && <WalletPage />}

          {currentView === 'commissions' && <CommissionPage />}

          {currentView === 'levels' && <UserLevelsPage />}

          {currentView === 'notifications' && <NotificationsPage />}
        </main>
      )}

      {/* 5-Button Bottom Navigation (Mobile & Tablet) */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenDeposit={() => {
          setIsCartOpen(false);
          setCurrentView('plans');
        }}
      />

      <DepositModal
        isOpen={isDepositOpen}
        initialAmount={depositInitialAmount}
        onClose={() => setIsDepositOpen(false)}
      />

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        onOpenDeposit={() => {
          setIsWithdrawalOpen(false);
          setCurrentView('plans');
        }}
      />

      {/* Level Details Inspection Modal */}
      <LevelDetailsModal
        isOpen={!!selectedLevelForModal}
        level={selectedLevelForModal}
        currentLevel={currentUser?.level ?? 0}
        onClose={() => setSelectedLevelForModal(null)}
        onUpgrade={(lvl) => upgradeUserToLevel(lvl)}
        onOpenDeposit={(amt) => {
          setSelectedLevelForModal(null);
          handleOpenDepositWithAmount(amt);
        }}
      />

      {/* Level 0 / 1 Task Quota Completed / Upgrade Modal */}
      <LevelZeroAlertModal
        isOpen={!!levelAlert?.isOpen}
        earnedAmount={levelAlert?.earnedAmount || 0}
        type={levelAlert?.type || 'quota_reached'}
        onClose={() => setLevelAlert(null)}
        onDepositUpgrade={() => {
          setLevelAlert(null);
          setCurrentView('plans');
        }}
        onViewTasks={() => {
          setLevelAlert(null);
          setCurrentView('tasks');
        }}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={closeAuthModal}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
