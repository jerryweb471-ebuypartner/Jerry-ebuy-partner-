import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  User,
  Product,
  Order,
  Wallet,
  Transaction,
  Deposit,
  Withdrawal,
  CommissionRule,
  CommissionRecord,
  Notification,
  AuditLog,
  PlatformSettings,
  RankingUser,
  UserLevel,
  CartItem,
  OrderStatus,
  ProductTask,
  CountryConfig,
  CompanyDocument,
  BrandAmbassador,
  VerifiedActivity,
  GlobalPaymentConfig,
  RefundRecord,
  AppDownloadConfig,
  PolicyDocument,
  CompanyLocation,
  LocationDocument,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_DEPOSITS,
  INITIAL_WITHDRAWALS,
  INITIAL_COMMISSION_RULES,
  INITIAL_COMMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_RANKING_USERS,
  INITIAL_COMPANY_DOCUMENTS,
  INITIAL_BRAND_AMBASSADORS,
  MASTER_PLANS_USD,
  INITIAL_VERIFIED_ACTIVITIES,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_REFUNDS,
  INITIAL_APP_DOWNLOAD_CONFIG,
  INITIAL_POLICIES,
  INITIAL_COMPANY_LOCATIONS,
  COUNTRIES_LIST,
} from '../data/initialData';

export type ViewType =
  | 'home'
  | 'products'
  | 'ranking'
  | 'tasks'
  | 'profile'
  | 'plans'
  | 'company_docs'
  | 'privacy_policy'
  | 'policies'
  | 'landing'
  | 'dashboard'
  | 'marketplace'
  | 'cart'
  | 'orders'
  | 'wallet'
  | 'commissions'
  | 'levels'
  | 'notifications'
  | 'admin';

export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'products'
  | 'categories'
  | 'orders'
  | 'wallet'
  | 'deposits'
  | 'withdrawals'
  | 'commissions'
  | 'levels'
  | 'transactions'
  | 'audit_logs'
  | 'settings'
  | 'company_docs'
  | 'payment_settings'
  | 'app_download'
  | 'refunds'
  | 'policies';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface LocalizedUserPlan {
  level: number;
  name: string;
  deposit: number;
  per_product: number;
  daily_potential: number;
  products: number;
  benefits: string[];
}

interface AppContextType {
  currentUser: User | null;
  currentView: ViewType;
  adminSection: AdminSection;
  formatCurrency: (amount: number) => string;
  userPlans: UserLevel[];
  getUserPlans: () => LocalizedUserPlan[];
  currentUserPlan: UserLevel;
  paymentConfig: GlobalPaymentConfig;
  updatePaymentConfig: (config: Partial<GlobalPaymentConfig>) => void;
  setCurrentView: (view: ViewType) => void;
  setAdminSection: (section: AdminSection) => void;

  // Data
  users: User[];
  products: Product[];
  orders: Order[];
  wallets: Record<string, Wallet>;
  transactions: Transaction[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  commissionRules: CommissionRule[];
  commissionRecords: CommissionRecord[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  userLevels: UserLevel[];
  cart: CartItem[];
  toasts: Toast[];

  // Verified Activities (Country-filtered, USD only)
  verifiedActivities: VerifiedActivity[];
  userVerifiedActivities: VerifiedActivity[];
  addVerifiedActivity: (act: VerifiedActivity) => void;

  // Refunds (USD only, Binance / Crypto)
  refunds: RefundRecord[];
  submitRefundRequest: (refund: Omit<RefundRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateRefundStatus: (refundId: string, status: RefundRecord['status'], adminNote?: string) => void;

  // App Download Settings
  appDownloadConfig: AppDownloadConfig;
  updateAppDownloadConfig: (config: Partial<AppDownloadConfig>) => void;

  // Legal CMS Policies
  policies: PolicyDocument[];
  updatePolicy: (id: string, updated: Partial<PolicyDocument>) => void;

  // Documents & Ambassadors
  companyDocuments: CompanyDocument[];
  brandAmbassadors: BrandAmbassador[];
  addCompanyDocument: (doc: CompanyDocument) => void;
  updateCompanyDocument: (id: string, doc: Partial<CompanyDocument>) => void;
  deleteCompanyDocument: (id: string) => void;
  addBrandAmbassador: (amb: BrandAmbassador) => void;
  updateBrandAmbassador: (id: string, amb: Partial<BrandAmbassador>) => void;
  deleteBrandAmbassador: (id: string) => void;

  // Global Company Locations & Document CMS
  companyLocations: CompanyLocation[];
  addCompanyLocation: (loc: CompanyLocation) => void;
  updateCompanyLocation: (id: string, loc: Partial<CompanyLocation>) => void;
  deleteCompanyLocation: (id: string) => void;
  addLocationDocument: (locationId: string, doc: LocationDocument) => void;
  deleteLocationDocument: (locationId: string, docId: string) => void;

  // Task & Ranking Data
  rankingUsers: RankingUser[];
  productTasks: ProductTask[];
  completedTasksToday: ProductTask[];
  currentLevelConfig: UserLevel;
  levelAlert: {
    isOpen: boolean;
    earnedAmount: number;
    title: string;
    message: string;
    type: 'quota_reached' | 'withdrawal_locked';
    targetLevel?: number;
  } | null;
  selectedLevelForModal: UserLevel | null;

  // Helpers
  userWallet: Wallet;
  userOrders: Order[];
  userTransactions: Transaction[];
  userCommissions: CommissionRecord[];
  userNotifications: Notification[];
  unreadNotificationCount: number;

  // Actions
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  login: (email: string, pass?: string) => boolean;
  register: (
    name: string,
    email: string,
    phone: string,
    pass: string,
    referralCode?: string,
    countryConfig?: CountryConfig
  ) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  userLevelSwitcher: (levelNumber: number) => void;

  // Tasks Actions
  executeProductTask: (product: Product) => { success: boolean; earnedAmount: number; isCompletedLevelQuota: boolean };
  setLevelAlert: (alert: {
    isOpen: boolean;
    earnedAmount: number;
    title: string;
    message: string;
    type: 'quota_reached' | 'withdrawal_locked';
    targetLevel?: number;
  } | null) => void;
  upgradeUserToLevel: (levelNumber: number) => void;
  setSelectedLevelForModal: (level: UserLevel | null) => void;

  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalAmount: number;
  cartEstimatedCommission: number;
  checkoutCart: (paymentMethod: 'wallet_balance' | 'corporate_invoice') => Promise<{ success: boolean; orderId?: string; error?: string }>;

  // Financial
  submitDeposit: (
    amount: number,
    method: Deposit['paymentMethod'],
    reference: string,
    proofName?: string,
    cryptoNetwork?: string,
    cryptoTxHash?: string
  ) => void;
  approveDeposit: (depositId: string, adminNote?: string) => void;
  rejectDeposit: (depositId: string, reason?: string) => void;
  submitWithdrawal: (
    amount: number,
    method: Withdrawal['method'],
    accountInfo: Withdrawal['accountInfo']
  ) => Promise<{ success: boolean; error?: string }>;
  updateWithdrawalStatus: (
    withdrawalId: string,
    status: Withdrawal['status'],
    reason?: string
  ) => void;

  // Admin CRUD
  adminUpdateUserAssets: (
    userId: string,
    data: {
      availableBalance?: number;
      level?: number;
      status?: User['status'];
      newPassword?: string;
      auditNote?: string;
    }
  ) => void;
  saveProduct: (product: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  saveCommissionRule: (rule: CommissionRule) => void;
  deleteCommissionRule: (id: string) => void;
  saveUserLevel: (level: UserLevel) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  updateUserLevel: (userId: string, level: number) => void;
  updateUserProfile: (data: Partial<User>) => void;
  updateSettings: (settings: PlatformSettings) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNote?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  exportDataBackup: () => string;
  importDataBackup: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentViewState, setCurrentViewState] = useState<ViewType>('home');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');

  // Active User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexora_usd_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return { ...u, currency: 'USD', currencySymbol: '$' };
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Default Hamza Malik
  });

  // Modal / Alert States
  const [selectedLevelForModal, setSelectedLevelForModal] = useState<UserLevel | null>(null);
  const [levelAlert, setLevelAlert] = useState<{
    isOpen: boolean;
    earnedAmount: number;
    title: string;
    message: string;
    type: 'quota_reached' | 'withdrawal_locked';
    targetLevel?: number;
  } | null>(null);

  // Core Data States with smart merging so custom users & wallets are never erased
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexora_usd_users');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()));
        const missingInitials = INITIAL_USERS.filter((u) => !existingEmails.has(u.email.toLowerCase()));
        return [...parsed, ...missingInitials];
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexora_usd_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexora_usd_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem('nexora_usd_wallets');
    if (saved) {
      try {
        const parsed: Record<string, Wallet> = JSON.parse(saved);
        return { ...INITIAL_WALLETS, ...parsed };
      } catch {
        return INITIAL_WALLETS;
      }
    }
    return INITIAL_WALLETS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexora_usd_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
    const saved = localStorage.getItem('nexora_usd_deposits');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSITS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem('nexora_usd_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(() => {
    const saved = localStorage.getItem('nexora_usd_commission_rules');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION_RULES;
  });

  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>(() => {
    const saved = localStorage.getItem('nexora_usd_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('nexora_usd_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nexora_usd_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('nexora_usd_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [userLevels, setUserLevels] = useState<UserLevel[]>(() => {
    const saved = localStorage.getItem('nexora_usd_levels');
    return saved ? JSON.parse(saved) : MASTER_PLANS_USD;
  });

  const [rankingUsers, setRankingUsers] = useState<RankingUser[]>(() => {
    const saved = localStorage.getItem('nexora_usd_rankings');
    return saved ? JSON.parse(saved) : INITIAL_RANKING_USERS;
  });

  const [productTasks, setProductTasks] = useState<ProductTask[]>(() => {
    const saved = localStorage.getItem('nexora_usd_product_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [companyDocuments, setCompanyDocuments] = useState<CompanyDocument[]>(() => {
    const saved = localStorage.getItem('nexora_usd_company_docs');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_DOCUMENTS;
  });

  const [brandAmbassadors, setBrandAmbassadors] = useState<BrandAmbassador[]>(() => {
    const saved = localStorage.getItem('nexora_usd_brand_ambassadors');
    return saved ? JSON.parse(saved) : INITIAL_BRAND_AMBASSADORS;
  });

  const [companyLocations, setCompanyLocations] = useState<CompanyLocation[]>(() => {
    const saved = localStorage.getItem('nexora_usd_company_locations');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_LOCATIONS;
  });

  const [verifiedActivities, setVerifiedActivities] = useState<VerifiedActivity[]>(() => {
    const saved = localStorage.getItem('nexora_usd_verified_activities');
    return saved ? JSON.parse(saved) : INITIAL_VERIFIED_ACTIVITIES;
  });

  const [paymentConfig, setPaymentConfig] = useState<GlobalPaymentConfig>(() => {
    const saved = localStorage.getItem('nexora_usd_payment_config');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
  });

  const [refunds, setRefunds] = useState<RefundRecord[]>(() => {
    const saved = localStorage.getItem('nexora_usd_refunds');
    return saved ? JSON.parse(saved) : INITIAL_REFUNDS;
  });

  const [appDownloadConfig, setAppDownloadConfig] = useState<AppDownloadConfig>(() => {
    const saved = localStorage.getItem('nexora_usd_app_download');
    return saved ? JSON.parse(saved) : INITIAL_APP_DOWNLOAD_CONFIG;
  });

  const [policies, setPolicies] = useState<PolicyDocument[]>(() => {
    const saved = localStorage.getItem('nexora_usd_policies');
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexora_usd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistence Effects - LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexora_usd_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexora_usd_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_levels', JSON.stringify(userLevels));
  }, [userLevels]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_product_tasks', JSON.stringify(productTasks));
  }, [productTasks]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_verified_activities', JSON.stringify(verifiedActivities));
  }, [verifiedActivities]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_refunds', JSON.stringify(refunds));
  }, [refunds]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_app_download', JSON.stringify(appDownloadConfig));
  }, [appDownloadConfig]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_company_locations', JSON.stringify(companyLocations));
  }, [companyLocations]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_company_docs', JSON.stringify(companyDocuments));
  }, [companyDocuments]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_brand_ambassadors', JSON.stringify(brandAmbassadors));
  }, [brandAmbassadors]);

  useEffect(() => {
    localStorage.setItem('nexora_usd_cart', JSON.stringify(cart));
  }, [cart]);

  // Backend Persistent Storage Hydration (Load on launch)
  useEffect(() => {
    let isMounted = true;
    const fetchBackendStorage = async () => {
      try {
        const res = await fetch('/api/storage');
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          const d = json.data;
          if (d.users && Array.isArray(d.users) && d.users.length > 0) setUsers(d.users);
          if (d.products && Array.isArray(d.products) && d.products.length > 0) setProducts(d.products);
          if (d.orders && Array.isArray(d.orders)) setOrders(d.orders);
          if (d.wallets && typeof d.wallets === 'object') setWallets(d.wallets);
          if (d.transactions && Array.isArray(d.transactions)) setTransactions(d.transactions);
          if (d.deposits && Array.isArray(d.deposits)) setDeposits(d.deposits);
          if (d.withdrawals && Array.isArray(d.withdrawals)) setWithdrawals(d.withdrawals);
          if (d.userLevels && Array.isArray(d.userLevels)) setUserLevels(d.userLevels);
          if (d.productTasks && Array.isArray(d.productTasks)) setProductTasks(d.productTasks);
          if (d.verifiedActivities && Array.isArray(d.verifiedActivities)) setVerifiedActivities(d.verifiedActivities);
          if (d.paymentConfig && typeof d.paymentConfig === 'object') setPaymentConfig(d.paymentConfig);
          if (d.refunds && Array.isArray(d.refunds)) setRefunds(d.refunds);
          if (d.appDownloadConfig && typeof d.appDownloadConfig === 'object') setAppDownloadConfig(d.appDownloadConfig);
          if (d.policies && Array.isArray(d.policies)) setPolicies(d.policies);
          if (d.companyLocations && Array.isArray(d.companyLocations)) setCompanyLocations(d.companyLocations);
          if (d.companyDocuments && Array.isArray(d.companyDocuments)) setCompanyDocuments(d.companyDocuments);
          if (d.brandAmbassadors && Array.isArray(d.brandAmbassadors)) setBrandAmbassadors(d.brandAmbassadors);
          if (d.rankingUsers && Array.isArray(d.rankingUsers)) setRankingUsers(d.rankingUsers);
          if (d.settings && typeof d.settings === 'object') setSettings(d.settings);
        }
      } catch (e) {
        // Fallback silently to localStorage
      }
    };
    fetchBackendStorage();
    return () => {
      isMounted = false;
    };
  }, []);

  // Backend Persistent Storage Sync (Debounced Auto-Save to server file)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      const payload = {
        users,
        products,
        orders,
        wallets,
        transactions,
        deposits,
        withdrawals,
        userLevels,
        productTasks,
        verifiedActivities,
        paymentConfig,
        refunds,
        appDownloadConfig,
        policies,
        companyLocations,
        companyDocuments,
        brandAmbassadors,
        rankingUsers,
        settings,
      };
      fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Backend save fallback
      });
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    users,
    products,
    orders,
    wallets,
    transactions,
    deposits,
    withdrawals,
    userLevels,
    productTasks,
    verifiedActivities,
    paymentConfig,
    refunds,
    appDownloadConfig,
    policies,
    companyLocations,
    companyDocuments,
    brandAmbassadors,
    rankingUsers,
    settings,
  ]);

  // Toast Notification System (Compact Top Pops auto-dismissed after 5 seconds)
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Strict View Router: Clients (role !== 'admin') can NEVER access 'admin' view
  const currentView = currentViewState;
  const setCurrentView = useCallback((view: ViewType) => {
    if (view === 'admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        showToast('Access restricted: Only verified administrators can access the admin portal.', 'error');
        setCurrentViewState('home');
        return;
      }
    }
    setCurrentViewState(view);
  }, [currentUser, showToast]);

  // If user is ever demoted or logged out while on admin view, bounce them back to home
  useEffect(() => {
    if (currentViewState === 'admin' && currentUser?.role !== 'admin') {
      setCurrentViewState('home');
    }
  }, [currentViewState, currentUser]);

  // USD ONLY Currency Formatter ($)
  const formatCurrency = useCallback((amount: number): string => {
    const val = Number(amount) || 0;
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  // Verified activities filtered by user's country if logged in (amount strictly in USD)
  const userVerifiedActivities: VerifiedActivity[] = useMemo(() => {
    if (!currentUser) return verifiedActivities;
    const targetCode = (currentUser.countryCode || 'PK').toUpperCase();
    const filtered = verifiedActivities.filter((a) => a.countryCode.toUpperCase() === targetCode);
    return filtered.length > 0 ? filtered : verifiedActivities;
  }, [verifiedActivities, currentUser]);

  // Master USD Plans
  const userPlans: UserLevel[] = MASTER_PLANS_USD;
  const getUserPlans = useCallback((): LocalizedUserPlan[] => {
    return userLevels.map((lvl) => ({
      level: lvl.level,
      name: lvl.name,
      deposit: lvl.requiredDeposit,
      per_product: lvl.earningPerProduct,
      daily_potential: lvl.dailyTotalEarning,
      products: lvl.dailyProductTasks,
      benefits: lvl.benefits,
    }));
  }, [userLevels]);

  const currentLevelNum = currentUser?.level ?? 0;
  const currentUserPlan: UserLevel = useMemo(() => {
    return userPlans.find((p) => p.level === currentLevelNum) || userPlans[0];
  }, [userPlans, currentLevelNum]);

  const userWallet: Wallet = currentUser ? wallets[currentUser.id] || {
    userId: currentUser.id,
    availableBalance: 0,
    pendingBalance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalCommission: 0,
    currencyCode: 'USD',
    currencySymbol: '$',
  } : {
    userId: '',
    availableBalance: 0,
    pendingBalance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalCommission: 0,
    currencyCode: 'USD',
    currencySymbol: '$',
  };

  const userOrders = orders.filter((o) => currentUser && o.userId === currentUser.id);
  const userTransactions = transactions.filter((t) => currentUser && t.userId === currentUser.id);
  const userCommissions = commissionRecords.filter((c) => currentUser && c.userId === currentUser.id);
  const userNotifications = notifications.filter((n) => currentUser && n.userId === currentUser.id);
  const unreadNotificationCount = userNotifications.filter((n) => !n.read).length;

  const currentLevelConfig: UserLevel =
    userLevels.find((l) => l.level === (currentUser?.level ?? 0)) || userLevels[0];

  const completedTasksToday = productTasks.filter(
    (t) => currentUser && t.userId === currentUser.id
  );

  const calculateItemCommission = (
    product: Product,
    quantity: number,
    _userLevel: number = 0
  ): number => {
    const effectiveRate = product.commissionRate || currentLevelConfig.commissionRatePercent || 5.0;
    return Number(((product.price * quantity * effectiveRate) / 100).toFixed(2));
  };

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartEstimatedCommission = cart.reduce((sum, item) => sum + item.estimatedCommission, 0);

  // Cart Management & Trial / Level Limits
  const addToCart = (product: Product, quantity = 1) => {
    if (!currentUser) {
      showToast('Please log in to add products.', 'error');
      return;
    }

    const currentLvl = currentUser.level ?? 0;
    const currentTasksCount = completedTasksToday.length + cart.length;

    // LEVEL 0 (BASIC TRIAL): Max 4 products
    if (currentLvl === 0 && currentTasksCount >= 4) {
      setLevelAlert({
        isOpen: true,
        earnedAmount: currentUserPlan.dailyTotalEarning,
        title: 'Trial Limit Reached (Basic Plan)',
        message:
          'You have reached the maximum limit of 4 products for the Basic Trial ($80 total reward). Upgrade to Level 1 to unlock daily earning tasks and withdrawals!',
        type: 'quota_reached',
        targetLevel: 1,
      });
      return;
    }

    // LEVEL 1 RESTRICTION: Max 3 products/tasks
    if (currentLvl === 1 && currentTasksCount >= 3) {
      setLevelAlert({
        isOpen: true,
        earnedAmount: currentUserPlan.dailyTotalEarning,
        title: 'Daily Limit Reached (Level 1)',
        message:
          'You have reached the maximum daily limit of 3 products for Level 1 ($180 daily potential). Upgrade to Plan 2 or higher to unlock expanded daily product tasks!',
        type: 'quota_reached',
        targetLevel: 2,
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: nextQty,
                estimatedCommission: calculateItemCommission(product, nextQty, currentLvl),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity,
          product,
          estimatedCommission: calculateItemCommission(product, quantity, currentLvl),
        },
      ];
    });

    showToast(`Added "${product.name}" to cart.`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              estimatedCommission: calculateItemCommission(
                item.product,
                quantity,
                currentUser?.level || 0
              ),
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkoutCart = async (
    paymentMethod: 'wallet_balance' | 'corporate_invoice'
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!currentUser) {
      showToast('Please sign in to place an order.', 'error');
      return { success: false, error: 'User not authenticated' };
    }

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return { success: false, error: 'Empty cart' };
    }

    if (paymentMethod === 'wallet_balance' && userWallet.availableBalance < cartTotalAmount) {
      const errorMsg = `Insufficient available balance. Please deposit funds or choose a tier plan.`;
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      commissionAmount: calculateItemCommission(item.product, item.quantity, currentUser.level),
      image: item.product.images[0] || '',
    }));

    const totalOrderCommission = orderItems.reduce((acc, it) => acc + it.commissionAmount, 0);

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: orderItems,
      totalAmount: cartTotalAmount,
      totalCommission: Number(totalOrderCommission.toFixed(2)),
      status: paymentMethod === 'wallet_balance' ? 'processing' : 'pending',
      timeline: [
        {
          status: 'pending',
          timestamp: now,
          note: `Order submitted via ${paymentMethod === 'wallet_balance' ? 'Wallet Balance' : 'Corporate Invoice'}.`,
        },
      ],
      paymentMethod,
      createdAt: now,
      updatedAt: now,
    };

    if (paymentMethod === 'wallet_balance') {
      const prevBal = userWallet.availableBalance;
      const nextBal = prevBal - cartTotalAmount;

      const newTxn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        type: 'order_payment',
        direction: 'debit',
        amount: cartTotalAmount,
        currencyCode: 'USD',
        previousBalance: Number(prevBal.toFixed(2)),
        newBalance: Number(nextBal.toFixed(2)),
        status: 'completed',
        reference: orderId,
        description: `Order payment for ${cart.length} item(s) (${orderId})`,
        createdAt: now,
        createdBy: 'user',
      };

      setWallets((prev) => ({
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id],
          availableBalance: Number(nextBal.toFixed(2)),
        },
      }));

      setTransactions((prev) => [newTxn, ...prev]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      userId: currentUser.id,
      title: 'Order Placed Successfully',
      message: `Your order #${orderId} for ${formatCurrency(cartTotalAmount)} has been placed.`,
      type: 'order',
      read: false,
      createdAt: now,
      link: 'orders',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Order #${orderId} placed successfully!`, 'success');
    return { success: true, orderId };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, adminNote?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const previousStatus = order.status;
    if (previousStatus === newStatus) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedTimeline = [
      ...order.timeline,
      {
        status: newStatus,
        timestamp: now,
        note: adminNote || `Status updated from ${previousStatus} to ${newStatus}.`,
      },
    ];

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline,
      updatedAt: now,
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    if (newStatus === 'completed' && previousStatus !== 'completed') {
      const targetWallet = wallets[order.userId] || {
        userId: order.userId,
        availableBalance: 0,
        pendingBalance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalCommission: 0,
        currencyCode: 'USD',
        currencySymbol: '$',
      };

      const commissionCredited = order.totalCommission;
      const prevBal = targetWallet.availableBalance;
      const nextBal = prevBal + commissionCredited;

      const commissionTxn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: order.userId,
        userEmail: order.userEmail,
        type: 'commission',
        direction: 'credit',
        amount: commissionCredited,
        currencyCode: 'USD',
        previousBalance: Number(prevBal.toFixed(2)),
        newBalance: Number(nextBal.toFixed(2)),
        status: 'completed',
        reference: order.id,
        description: `Reward earned for completed order ${order.id}`,
        createdAt: now,
        createdBy: 'system',
      };
      setTransactions((prev) => [commissionTxn, ...prev]);

      setWallets((prev) => ({
        ...prev,
        [order.userId]: {
          ...targetWallet,
          availableBalance: Number(nextBal.toFixed(2)),
          totalCommission: Number((targetWallet.totalCommission + commissionCredited).toFixed(2)),
        },
      }));
    }

    showToast(`Order ${order.id} marked as ${newStatus}.`, 'success');
  };

  const submitDeposit = (
    amount: number,
    method: Deposit['paymentMethod'] = 'binance',
    reference: string,
    proofName?: string,
    cryptoNetwork?: string,
    cryptoTxHash?: string
  ) => {
    if (!currentUser) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const depId = `DEP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newDep: Deposit = {
      id: depId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      amount,
      currency: 'USD',
      paymentMethod: method,
      referenceNumber: reference,
      proofDocumentName: proofName || 'binance_payment_receipt.pdf',
      cryptoNetwork: cryptoNetwork || paymentConfig.binanceDepositNetwork,
      cryptoTxHash: cryptoTxHash || `tx_${Math.random().toString(36).substring(2, 12)}`,
      status: 'pending',
      createdAt: now,
    };

    setDeposits((prev) => [newDep, ...prev]);

    const notif: Notification = {
      id: `NOTIF-${Date.now()}`,
      userId: currentUser.id,
      title: 'Binance / Crypto Deposit Submitted',
      message: `Deposit request of ${formatCurrency(amount)} (${depId}) via ${method.toUpperCase()} (${cryptoNetwork || 'TRC20'}) received for review.`,
      type: 'deposit',
      read: false,
      createdAt: now,
      link: 'wallet',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Deposit ${depId} submitted. Awaiting blockchain verification.`, 'info');
  };

  const approveDeposit = (depositId: string, adminNote?: string) => {
    const deposit = deposits.find((d) => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDeposits((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? {
              ...d,
              status: 'approved',
              adminNote: adminNote || 'Binance payment verified by administrator.',
              reviewedAt: now,
            }
          : d
      )
    );

    const targetWallet = wallets[deposit.userId] || {
      userId: deposit.userId,
      availableBalance: 0,
      pendingBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalCommission: 0,
      currencyCode: 'USD',
      currencySymbol: '$',
    };

    const prevBal = targetWallet.availableBalance;
    const nextBal = prevBal + deposit.amount;

    const txn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: deposit.userId,
      userEmail: deposit.userEmail,
      type: 'deposit',
      direction: 'credit',
      amount: deposit.amount,
      currencyCode: 'USD',
      previousBalance: Number(prevBal.toFixed(2)),
      newBalance: Number(nextBal.toFixed(2)),
      status: 'completed',
      reference: deposit.id,
      description: `Binance Deposit via ${deposit.cryptoNetwork || 'TRC20'} approved by administrator.`,
      paymentMethod: deposit.paymentMethod,
      createdAt: now,
      createdBy: 'admin',
    };

    setTransactions((prev) => [txn, ...prev]);

    setWallets((prev) => ({
      ...prev,
      [deposit.userId]: {
        ...targetWallet,
        availableBalance: Number(nextBal.toFixed(2)),
        totalDeposited: Number((targetWallet.totalDeposited + deposit.amount).toFixed(2)),
      },
    }));

    showToast(`Deposit ${deposit.id} approved. Funds credited to user wallet in USD.`, 'success');
  };

  const rejectDeposit = (depositId: string, reason?: string) => {
    const deposit = deposits.find((d) => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDeposits((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? {
              ...d,
              status: 'rejected',
              adminNote: reason || 'Deposit rejected by compliance.',
              reviewedAt: now,
            }
          : d
      )
    );

    showToast(`Deposit ${deposit.id} rejected.`, 'info');
  };

  const submitWithdrawal = async (
    amount: number,
    method: Withdrawal['method'] = 'binance',
    accountInfo: Withdrawal['accountInfo']
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };

    // STRICT LEVEL 0 CHECK: Must achieve Level 1 first
    if ((currentUser.level ?? 0) === 0) {
      const err = 'Withdrawal unavailable. You must achieve Level 1 first.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const minW = paymentConfig.minWithdrawal || 10;
    if (amount < minW) {
      const err = `Minimum withdrawal amount is ${formatCurrency(minW)}.`;
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const availBal = userWallet?.availableBalance ?? 0;
    if (availBal < amount) {
      const err = `Requested withdrawal exceeds available balance.`;
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const fee = paymentConfig.withdrawalFee || 0;
    const netAmount = amount - fee;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const withId = `WTH-${Math.floor(10000 + Math.random() * 90000)}`;

    const prevBal = userWallet.availableBalance;
    const nextBal = prevBal - amount;

    setWallets((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        availableBalance: Number(nextBal.toFixed(2)),
        pendingBalance: Number((prev[currentUser.id].pendingBalance + amount).toFixed(2)),
      },
    }));

    const newWithdrawal: Withdrawal = {
      id: withId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      amount,
      currency: 'USD',
      fee,
      netAmount,
      method,
      accountInfo,
      status: 'pending',
      createdAt: now,
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    // Record verified activity record in USD
    const newActivity: VerifiedActivity = {
      id: `ACT-${Date.now()}`,
      userId: currentUser.id,
      countryCode: currentUser.countryCode || 'PK',
      countryName: currentUser.country || 'Pakistan',
      countryFlag: currentUser.countryFlag || '🇵🇰',
      city: currentUser.city || 'Islamabad',
      displayName: currentUser.name,
      activityType: 'withdrawal',
      amount,
      currency: 'USD',
      currencySymbol: '$',
      status: 'verified',
      verifiedAt: new Date().toISOString(),
    };
    setVerifiedActivities((prev) => [newActivity, ...prev]);

    showToast(`Withdrawal request of ${formatCurrency(amount)} submitted via ${method.toUpperCase()} (${accountInfo.cryptoNetwork || 'TRC20'}).`, 'success');
    return { success: true };
  };

  const updateWithdrawalStatus = (
    withdrawalId: string,
    status: Withdrawal['status'],
    reason?: string
  ) => {
    const withItem = withdrawals.find((w) => w.id === withdrawalId);
    if (!withItem) return;

    const previousStatus = withItem.status;
    if (previousStatus === status) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status,
              rejectionReason: reason || w.rejectionReason,
              reviewedAt: now,
            }
          : w
      )
    );

    const targetWallet = wallets[withItem.userId];

    if (status === 'completed' && previousStatus !== 'completed') {
      const txn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: withItem.userId,
        userEmail: withItem.userEmail,
        type: 'withdrawal',
        direction: 'debit',
        amount: withItem.amount,
        currencyCode: 'USD',
        previousBalance: Number((targetWallet.availableBalance + withItem.amount).toFixed(2)),
        newBalance: Number(targetWallet.availableBalance.toFixed(2)),
        status: 'completed',
        reference: withItem.id,
        description: `Disbursement via ${withItem.method.toUpperCase()} (${withItem.accountInfo.cryptoNetwork || 'TRC20'}) completed. Net: ${formatCurrency(withItem.netAmount)}`,
        paymentMethod: withItem.method,
        createdAt: now,
        createdBy: 'admin',
      };
      setTransactions((prev) => [txn, ...prev]);

      setWallets((prev) => ({
        ...prev,
        [withItem.userId]: {
          ...targetWallet,
          pendingBalance: Math.max(0, targetWallet.pendingBalance - withItem.amount),
          totalWithdrawn: Number((targetWallet.totalWithdrawn + withItem.amount).toFixed(2)),
        },
      }));
      showToast(`Payout ${withItem.id} approved and sent to ${withItem.accountInfo.walletAddress}!`, 'success');
    } else if (status === 'rejected' && previousStatus !== 'rejected') {
      setWallets((prev) => ({
        ...prev,
        [withItem.userId]: {
          ...targetWallet,
          availableBalance: Number((targetWallet.availableBalance + withItem.amount).toFixed(2)),
          pendingBalance: Math.max(0, targetWallet.pendingBalance - withItem.amount),
        },
      }));
      showToast(`Payout ${withItem.id} rejected and funds restored to wallet.`, 'info');
    }
  };

  // Payment Config Updates (USD Only)
  const updatePaymentConfig = (config: Partial<GlobalPaymentConfig>) => {
    setPaymentConfig((prev) => ({
      ...prev,
      ...config,
      currencyCode: 'USD',
      currencySymbol: '$',
    }));
    showToast(`USD Binance & Crypto Payment Settings saved successfully.`, 'success');
  };

  // Refund Management
  const submitRefundRequest = (refundData: Omit<RefundRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const refId = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newRefund: RefundRecord = {
      ...refundData,
      id: refId,
      currency: 'USD',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setRefunds((prev) => [newRefund, ...prev]);
    showToast(`Refund request ${refId} for ${formatCurrency(refundData.amount)} submitted for review.`, 'info');
  };

  const updateRefundStatus = (refundId: string, status: RefundRecord['status'], adminNote?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setRefunds((prev) =>
      prev.map((r) => (r.id === refundId ? { ...r, status, adminNote: adminNote || r.adminNote, updatedAt: now } : r))
    );
    showToast(`Refund ${refundId} marked as ${status}.`, 'success');
  };

  // App Download Config Updates
  const updateAppDownloadConfig = (config: Partial<AppDownloadConfig>) => {
    setAppDownloadConfig((prev) => ({ ...prev, ...config }));
    showToast('App Download settings updated.', 'success');
  };

  // Policy CMS Updates
  const updatePolicy = (id: string, updated: Partial<PolicyDocument>) => {
    const now = new Date().toISOString().split('T')[0];
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, lastUpdated: now } : p))
    );
    showToast('Policy document saved.', 'success');
  };

  // Verified Activity Action
  const addVerifiedActivity = (act: VerifiedActivity) => {
    setVerifiedActivities((prev) => [{ ...act, currency: 'USD', currencySymbol: '$' }, ...prev]);
  };

  const addCompanyDocument = (doc: CompanyDocument) => {
    setCompanyDocuments((prev) => [doc, ...prev]);
  };

  const updateCompanyDocument = (id: string, updated: Partial<CompanyDocument>) => {
    setCompanyDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const deleteCompanyDocument = (id: string) => {
    setCompanyDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addBrandAmbassador = (amb: BrandAmbassador) => {
    setBrandAmbassadors((prev) => [amb, ...prev]);
  };

  const updateBrandAmbassador = (id: string, updated: Partial<BrandAmbassador>) => {
    setBrandAmbassadors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteBrandAmbassador = (id: string) => {
    setBrandAmbassadors((prev) => prev.filter((a) => a.id !== id));
  };

  // Global Company Locations Management
  const addCompanyLocation = (loc: CompanyLocation) => {
    setCompanyLocations((prev) => [loc, ...prev]);
    showToast(`Added location for ${loc.countryName}`, 'success');
  };

  const updateCompanyLocation = (id: string, updated: Partial<CompanyLocation>) => {
    setCompanyLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
    showToast('Company location updated.', 'success');
  };

  const deleteCompanyLocation = (id: string) => {
    setCompanyLocations((prev) => prev.filter((l) => l.id !== id));
    showToast('Company location removed.', 'info');
  };

  const addLocationDocument = (locationId: string, doc: LocationDocument) => {
    setCompanyLocations((prev) =>
      prev.map((l) =>
        l.id === locationId
          ? { ...l, documents: [doc, ...(l.documents || [])] }
          : l
      )
    );
    showToast(`Document "${doc.title}" uploaded to location.`, 'success');
  };

  const deleteLocationDocument = (locationId: string, docId: string) => {
    setCompanyLocations((prev) =>
      prev.map((l) =>
        l.id === locationId
          ? { ...l, documents: (l.documents || []).filter((d) => d.id !== docId) }
          : l
      )
    );
    showToast('Document removed from location.', 'info');
  };

  const adminUpdateUserAssets = (
    userId: string,
    data: {
      availableBalance?: number;
      level?: number;
      status?: User['status'];
      newPassword?: string;
      auditNote?: string;
    }
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            level: data.level !== undefined ? data.level : u.level,
            status: data.status !== undefined ? data.status : u.status,
            currency: 'USD',
            currencySymbol: '$',
          };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              level: data.level !== undefined ? data.level : prev.level,
              status: data.status !== undefined ? data.status : prev.status,
              currency: 'USD',
              currencySymbol: '$',
            }
          : null
      );
    }

    if (data.availableBalance !== undefined) {
      const userTargetWallet = wallets[userId] || {
        userId,
        availableBalance: 0,
        pendingBalance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalCommission: 0,
        currencyCode: 'USD',
        currencySymbol: '$',
      };

      const prevBal = userTargetWallet.availableBalance;
      const newBal = data.availableBalance;

      setWallets((prev) => ({
        ...prev,
        [userId]: {
          ...userTargetWallet,
          availableBalance: Number(newBal.toFixed(2)),
          currencyCode: 'USD',
          currencySymbol: '$',
        },
      }));

      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const txn: Transaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        userEmail: users.find((u) => u.id === userId)?.email || 'client@ebuy-partner.com',
        type: 'adjustment',
        direction: newBal >= prevBal ? 'credit' : 'debit',
        amount: Math.abs(newBal - prevBal),
        currencyCode: 'USD',
        previousBalance: Number(prevBal.toFixed(2)),
        newBalance: Number(newBal.toFixed(2)),
        status: 'completed',
        reference: 'ADMIN_ASSET_CONTROL',
        description: data.auditNote || 'Manual ledger balance adjustment by administrator.',
        createdAt: now,
        createdBy: 'admin',
      };
      setTransactions((prev) => [txn, ...prev]);
    }
  };

  const saveProduct = (productData: Partial<Product>) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? ({ ...p, ...productData, baseCurrency: 'USD' } as Product) : p))
      );
      showToast(`Product "${productData.name}" updated in USD.`, 'success');
    } else {
      const newProd: Product = {
        id: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
        name: productData.name || 'Untitled Product',
        slug: (productData.name || 'product').toLowerCase().replace(/\s+/g, '-'),
        category: productData.category || 'Studio Audio & Electronics',
        price: productData.price || 99,
        baseValue: productData.price || 99,
        baseCurrency: 'USD',
        inventory: productData.inventory || 20,
        sku: productData.sku || `SKU-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 1,
        description: productData.description || 'Premium commercial merchandise.',
        specifications: productData.specifications || {},
        images: productData.images && productData.images.length > 0 ? productData.images : [INITIAL_PRODUCTS[0].images[0]],
        commissionType: 'percentage',
        commissionRate: productData.commissionRate || 6.5,
        isFeatured: Boolean(productData.isFeatured),
        isAvailable: true,
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Product "${newProd.name}" created with value ${formatCurrency(newProd.price)}.`, 'success');
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog.', 'info');
  };

  const saveCommissionRule = (rule: CommissionRule) => {
    setCommissionRules((prev) => {
      const exists = prev.find((r) => r.id === rule.id);
      if (exists) {
        return prev.map((r) => (r.id === rule.id ? rule : r));
      }
      return [...prev, rule];
    });
    showToast(`Commission rule "${rule.name}" saved.`, 'success');
  };

  const deleteCommissionRule = (id: string) => {
    setCommissionRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Commission rule removed.', 'info');
  };

  const saveUserLevel = (level: UserLevel) => {
    setUserLevels((prev) =>
      prev.map((l) => (l.level === level.level ? level : l))
    );
    showToast(`Tier Level ${level.level} ($ USD) configuration updated.`, 'success');
  };

  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    showToast(`User status set to ${status}.`, 'info');
  };

  const updateUserLevel = (userId: string, level: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, level } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, level } : null));
    }
    showToast(`User level assigned to Level ${level}.`, 'success');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data, currency: 'USD', currencySymbol: '$' };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully.', 'success');
  };

  const updateSettings = (newSettings: PlatformSettings) => {
    setSettings({ ...newSettings, currencyCode: 'USD', currencySymbol: '$' });
    showToast('System configuration saved.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const login = (emailOrUser: string, _pass?: string): boolean => {
    const cleanInput = (emailOrUser || '').trim().toLowerCase();

    // Master Administrator Authentication (Jerry@786)
    if (
      cleanInput === 'jerry@786' ||
      cleanInput === 'admin@ebuy-partner.com' ||
      cleanInput === 'admin'
    ) {
      let adminUser = users.find((u) => u.email.toLowerCase() === 'jerry@786' || u.role === 'admin');
      if (!adminUser) {
        adminUser = {
          ...INITIAL_USERS[1],
          name: 'Jerry (Super Admin)',
          email: 'Jerry@786',
          role: 'admin',
          currency: 'USD',
          currencySymbol: '$',
        };
      } else {
        adminUser = {
          ...adminUser,
          name: adminUser.name || 'Jerry (Super Admin)',
          email: 'Jerry@786',
          role: 'admin',
          currency: 'USD',
          currencySymbol: '$',
        };
      }
      setCurrentUser(adminUser);
      setCurrentViewState('admin');
      showToast('Authenticated as Main Super Administrator (Jerry@786).', 'success');
      return true;
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === cleanInput || u.name.toLowerCase() === cleanInput
    );
    if (user) {
      if (user.status === 'suspended') {
        showToast('This account has been suspended. Please contact compliance.', 'error');
        return false;
      }
      const guaranteedUsdUser: User = {
        ...user,
        currency: 'USD',
        currencySymbol: '$',
        currencyName: 'United States Dollar',
      };
      setCurrentUser(guaranteedUsdUser);
      setCurrentView(user.role === 'admin' ? 'admin' : 'home');
      showToast(`Welcome back, ${user.name}! Account currency: USD ($)`, 'success');
      return true;
    }

    showToast('Invalid credentials. Please check your username and password.', 'error');
    return false;
  };

  // REGISTRATION: Client automatically receives Basic Trial (Level 0) in USD ($)
  const register = (
    name: string,
    email: string,
    phone: string,
    _pass: string,
    referralCode?: string,
    countryConfig?: CountryConfig
  ): boolean => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      showToast('An account already exists with this email address.', 'error');
      return false;
    }

    const newUserId = `USR-${Math.floor(1020 + Math.random() * 8900)}`;
    const userReferral = name.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.floor(10 + Math.random() * 90);

    const country = countryConfig?.name || 'Pakistan';
    const countryFlag = countryConfig?.flag || '🇵🇰';
    const countryCode = countryConfig?.code || 'PK';
    const city = countryConfig?.city || 'Lahore';

    const newUser: User = {
      id: newUserId,
      name,
      email,
      phone,
      role: 'user',
      status: 'active',
      level: 0, // Automatically lands on FREE BASIC TRIAL (LEVEL 0)
      trialCompleted: false,
      referralCode: userReferral,
      referredBy: referralCode,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      twoFactorEnabled: false,
      activeSessionsCount: 1,
      lastLoginAt: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
      city,
      country,
      countryCode,
      countryFlag,
      currency: 'USD',
      currencySymbol: '$',
      currencyName: 'United States Dollar',
    };

    const newWallet: Wallet = {
      userId: newUserId,
      availableBalance: 0,
      pendingBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalCommission: 0,
      currencyCode: 'USD',
      currencySymbol: '$',
    };

    setUsers((prev) => [newUser, ...prev]);
    setWallets((prev) => ({ ...prev, [newUserId]: newWallet }));
    setCurrentUser(newUser);
    setCurrentView('home');

    showToast(`Welcome ${name}! Your Free Basic Trial is now active. Complete 4 trial tasks to earn your $80 reward.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    showToast('Signed out successfully.', 'info');
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const guaranteedUser: User = { ...user, currency: 'USD', currencySymbol: '$' };
      setCurrentUser(guaranteedUser);
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('home');
      }
      showToast(`Switched active profile to: ${user.name} (Level ${user.level})`, 'info');
    }
  };

  const userLevelSwitcher = (levelNumber: number) => {
    if (!currentUser) return;
    const targetConfig = userLevels.find((l) => l.level === levelNumber) || userLevels[0];
    const updated: User = { ...currentUser, level: levelNumber, currency: 'USD', currencySymbol: '$' };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast(`Switched to Level ${levelNumber} (${targetConfig.name})`, 'info');
  };

  const upgradeUserToLevel = (levelNumber: number) => {
    if (!currentUser) return;
    const targetPlan = userPlans.find((p) => p.level === levelNumber) || userPlans[0];
    const updated: User = { ...currentUser, level: levelNumber, currency: 'USD', currencySymbol: '$' };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setProductTasks((prev) => prev.filter((t) => t.userId !== currentUser.id));
    showToast(
      `🎉 Successfully upgraded to Level ${levelNumber} (${targetPlan.name})! You now have ${targetPlan.dailyProductTasks} daily tasks at ${formatCurrency(targetPlan.earningPerProduct)} each.`,
      'success'
    );
  };

  const executeProductTask = (product: Product) => {
    if (!currentUser) {
      showToast('Please log in to start tasks', 'error');
      return { success: false, earnedAmount: 0, isCompletedLevelQuota: false };
    }

    const levelNum = currentUser.level ?? 0;
    const activePlan = userPlans.find((p) => p.level === levelNum) || userPlans[0];
    const userTasksToday = productTasks.filter((t) => t.userId === currentUser.id);

    if (userTasksToday.length >= activePlan.dailyProductTasks) {
      if (levelNum === 0) {
        showToast(
          `Basic Trial completed (4/4 products)! Total $80 reward earned. Upgrade to Level 1 to unlock balance withdrawals.`,
          'info'
        );
      } else {
        showToast(
          `Daily task quota reached for Level ${levelNum} (${activePlan.dailyProductTasks} tasks). Upgrade your tier to unlock more tasks!`,
          'info'
        );
      }
      return { success: false, earnedAmount: 0, isCompletedLevelQuota: true };
    }

    const rewardEarned = activePlan.earningPerProduct;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newTask: ProductTask = {
      id: `TSK-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      productPrice: product.price,
      rewardEarned,
      levelAtCompletion: levelNum,
      completedAt: now,
      status: 'completed',
    };

    const updatedTasks = [newTask, ...productTasks];
    setProductTasks(updatedTasks);

    const currentWallet = wallets[currentUser.id] || {
      userId: currentUser.id,
      availableBalance: 0,
      pendingBalance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalCommission: 0,
      currencyCode: 'USD',
      currencySymbol: '$',
    };

    const newBal = currentWallet.availableBalance + rewardEarned;
    const newComm = currentWallet.totalCommission + rewardEarned;

    setWallets((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...currentWallet,
        availableBalance: Number(newBal.toFixed(2)),
        totalCommission: Number(newComm.toFixed(2)),
      },
    }));

    const txn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'commission',
      direction: 'credit',
      amount: rewardEarned,
      currencyCode: 'USD',
      previousBalance: currentWallet.availableBalance,
      newBalance: Number(newBal.toFixed(2)),
      status: 'completed',
      reference: newTask.id,
      description: levelNum === 0
        ? `Basic Trial reward ($20.00) for verifying "${product.name}".`
        : `Task reward (${formatCurrency(rewardEarned)}) for adding "${product.name}" to cart (Level ${levelNum}).`,
      paymentMethod: 'system',
      createdAt: now,
      createdBy: 'system',
    };
    setTransactions((prev) => [txn, ...prev]);

    const newTodayCount = userTasksToday.length + 1;
    const taskQuota = activePlan.dailyProductTasks;
    const isCompleted = newTodayCount >= taskQuota;
    const dailyEarning = activePlan.dailyTotalEarning;

    if (levelNum === 0 && isCompleted) {
      const updatedUser: User = { ...currentUser, trialCompleted: true, currency: 'USD', currencySymbol: '$' };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

      showToast(
        `🎉 Basic Trial Completed! Total ${formatCurrency(dailyEarning)} credited to your wallet. Upgrade to Level 1 to unlock balance withdrawals!`,
        'success'
      );
    } else if (isCompleted) {
      showToast(
        `🎉 All ${taskQuota} tasks completed today! Total earned: ${formatCurrency(dailyEarning)}`,
        'success'
      );
    } else {
      showToast(
        `Task ${newTodayCount}/${taskQuota} Completed! +${formatCurrency(rewardEarned)} credited to your USD wallet.`,
        'success'
      );
    }

    return { success: true, earnedAmount: rewardEarned, isCompletedLevelQuota: isCompleted };
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setDeposits(INITIAL_DEPOSITS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setCommissionRules(INITIAL_COMMISSION_RULES);
    setCommissionRecords(INITIAL_COMMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
    setUserLevels(MASTER_PLANS_USD);
    setCompanyDocuments(INITIAL_COMPANY_DOCUMENTS);
    setBrandAmbassadors(INITIAL_BRAND_AMBASSADORS);
    setCompanyLocations(INITIAL_COMPANY_LOCATIONS);
    setVerifiedActivities(INITIAL_VERIFIED_ACTIVITIES);
    setPaymentConfig(INITIAL_PAYMENT_CONFIG);
    setRefunds(INITIAL_REFUNDS);
    setAppDownloadConfig(INITIAL_APP_DOWNLOAD_CONFIG);
    setPolicies(INITIAL_POLICIES);
    setCart([]);
    setProductTasks([]);
    setRankingUsers(INITIAL_RANKING_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentView('home');
    showToast('Platform reset to single USD currency architecture.', 'info');
  };

  const exportDataBackup = (): string => {
    const data = {
      version: '2.0-usd-full',
      exportedAt: new Date().toISOString(),
      users,
      wallets,
      products,
      orders,
      transactions,
      deposits,
      withdrawals,
      userLevels,
      productTasks,
      verifiedActivities,
      paymentConfig,
      refunds,
      appDownloadConfig,
      policies,
      companyLocations,
      companyDocuments,
      brandAmbassadors,
      rankingUsers,
      settings,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataBackup = (jsonString: string): boolean => {
    try {
      const d = JSON.parse(jsonString);
      if (!d || typeof d !== 'object') {
        showToast('Invalid backup file JSON.', 'error');
        return false;
      }
      if (d.users && Array.isArray(d.users)) {
        setUsers(d.users);
        localStorage.setItem('nexora_usd_users', JSON.stringify(d.users));
      }
      if (d.wallets && typeof d.wallets === 'object') {
        setWallets(d.wallets);
        localStorage.setItem('nexora_usd_wallets', JSON.stringify(d.wallets));
      }
      if (d.products && Array.isArray(d.products)) setProducts(d.products);
      if (d.orders && Array.isArray(d.orders)) setOrders(d.orders);
      if (d.transactions && Array.isArray(d.transactions)) setTransactions(d.transactions);
      if (d.deposits && Array.isArray(d.deposits)) setDeposits(d.deposits);
      if (d.withdrawals && Array.isArray(d.withdrawals)) setWithdrawals(d.withdrawals);
      if (d.userLevels && Array.isArray(d.userLevels)) setUserLevels(d.userLevels);
      if (d.productTasks && Array.isArray(d.productTasks)) setProductTasks(d.productTasks);
      if (d.verifiedActivities && Array.isArray(d.verifiedActivities)) setVerifiedActivities(d.verifiedActivities);
      if (d.paymentConfig && typeof d.paymentConfig === 'object') setPaymentConfig(d.paymentConfig);
      if (d.refunds && Array.isArray(d.refunds)) setRefunds(d.refunds);
      if (d.appDownloadConfig && typeof d.appDownloadConfig === 'object') setAppDownloadConfig(d.appDownloadConfig);
      if (d.policies && Array.isArray(d.policies)) setPolicies(d.policies);
      if (d.companyLocations && Array.isArray(d.companyLocations)) setCompanyLocations(d.companyLocations);
      if (d.companyDocuments && Array.isArray(d.companyDocuments)) setCompanyDocuments(d.companyDocuments);
      if (d.brandAmbassadors && Array.isArray(d.brandAmbassadors)) setBrandAmbassadors(d.brandAmbassadors);
      if (d.rankingUsers && Array.isArray(d.rankingUsers)) setRankingUsers(d.rankingUsers);
      if (d.settings && typeof d.settings === 'object') setSettings(d.settings);

      // Save to backend server file directly
      fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      }).catch(() => {});

      showToast('All client accounts, assets, wallets, and plans restored successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to parse backup JSON. Please check file format.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentView,
        adminSection,
        formatCurrency,
        userPlans,
        getUserPlans,
        currentUserPlan,
        paymentConfig,
        updatePaymentConfig,
        setCurrentView,
        setAdminSection,
        users,
        products,
        orders,
        wallets,
        transactions,
        deposits,
        withdrawals,
        commissionRules,
        commissionRecords,
        notifications,
        auditLogs,
        settings,
        userLevels,
        cart,
        toasts,
        verifiedActivities,
        userVerifiedActivities,
        addVerifiedActivity,
        refunds,
        submitRefundRequest,
        updateRefundStatus,
        appDownloadConfig,
        updateAppDownloadConfig,
        policies,
        updatePolicy,
        companyDocuments,
        brandAmbassadors,
        addCompanyDocument,
        updateCompanyDocument,
        deleteCompanyDocument,
        addBrandAmbassador,
        updateBrandAmbassador,
        deleteBrandAmbassador,
        companyLocations,
        addCompanyLocation,
        updateCompanyLocation,
        deleteCompanyLocation,
        addLocationDocument,
        deleteLocationDocument,
        rankingUsers,
        productTasks,
        completedTasksToday,
        currentLevelConfig,
        levelAlert,
        selectedLevelForModal,
        userWallet,
        userOrders,
        userTransactions,
        userCommissions,
        userNotifications,
        unreadNotificationCount,
        showToast,
        dismissToast,
        login,
        register,
        logout,
        switchUser,
        userLevelSwitcher,
        executeProductTask,
        setLevelAlert,
        upgradeUserToLevel,
        setSelectedLevelForModal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalAmount,
        cartEstimatedCommission,
        checkoutCart,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        submitWithdrawal,
        updateWithdrawalStatus,
        adminUpdateUserAssets,
        saveProduct,
        deleteProduct,
        saveCommissionRule,
        deleteCommissionRule,
        saveUserLevel,
        updateUserStatus,
        updateUserLevel,
        updateUserProfile,
        updateSettings,
        updateOrderStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        exportDataBackup,
        importDataBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
