export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  city?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  level: number; // 0 (Basic Trial) to 10
  referralCode: string;
  referredBy?: string;
  avatar: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  lastLoginAt: string;
  createdAt: string;
  city?: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  currency: 'USD';
  currencySymbol: '$';
  currencyName?: string;
  authProvider?: 'email' | 'google';
  trialCompleted?: boolean;
}

export interface UserLevel {
  level: number;
  name: string;
  requiredDeposit: number;
  dailyProductTasks: number;
  earningPerProduct: number;
  dailyTotalEarning: number;
  canWithdraw: boolean;
  requiredOrderVolume: number;
  minCompletedOrders: number;
  commissionRatePercent: number;
  maxDailyOrders: number;
  maxDailyWithdrawal: number;
  benefits: string[];
}

export interface ProductTask {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  rewardEarned: number;
  levelAtCompletion: number;
  completedAt: string;
  status: 'completed' | 'processing';
}

export interface RankingUser {
  rank: number;
  id: string;
  name: string;
  city: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  level: number;
  levelName: string;
  totalWithdrawn: number;
  tasksCompleted: number;
  avatar: string;
  withdrawalMethod: string;
  recentWithdrawalAmount: number;
  timeAgo: string;
}

export interface RealEstateDetails {
  propertyType?: string;
  location?: string;
  landArea?: string;
  buildingArea?: string;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  propertyStatus?: string;
  additionalDocuments?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number; // USD price
  baseValue?: number; // USD valuation
  baseCurrency?: 'USD';
  minLevel?: number; // Minimum required level (0 to 10)
  maxLevel?: number;
  requiredLevel?: number;
  inventory: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  imageUrl?: string;
  additionalImages?: string[];
  commissionType: 'percentage' | 'fixed';
  commissionRate: number;
  isFeatured: boolean;
  isAvailable: boolean;
  status?: 'active' | 'inactive' | 'draft';
  location?: string;
  propertyDetails?: RealEstateDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
  estimatedCommission: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  commissionAmount: number;
  image: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  totalCommission: number;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  paymentMethod: 'wallet_balance' | 'corporate_invoice';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalCommission: number;
  currencyCode?: 'USD';
  currencySymbol?: '$';
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'order_payment'
  | 'commission'
  | 'refund'
  | 'adjustment';

export type TransactionDirection = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currencyCode?: 'USD';
  previousBalance: number;
  newBalance: number;
  status: TransactionStatus;
  reference: string;
  description: string;
  paymentMethod?: 'binance' | 'crypto' | 'wallet_balance' | 'system' | 'bank_transfer';
  createdAt: string;
  createdBy: 'system' | 'admin' | 'user';
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';
export type DepositMethod = 'binance' | 'crypto';

export interface Deposit {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency?: 'USD';
  paymentMethod: DepositMethod;
  referenceNumber: string;
  proofDocumentName?: string;
  status: DepositStatus;
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
  cryptoNetwork?: string;
  cryptoTxHash?: string;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'failed';
export type WithdrawalMethod = 'binance' | 'crypto' | 'bank_transfer';

export interface Withdrawal {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency?: 'USD';
  fee: number;
  netAmount: number;
  method: WithdrawalMethod;
  accountInfo: {
    accountTitle?: string;
    cryptoNetwork?: string;
    walletAddress?: string;
    memoOrTag?: string;
  };
  status: WithdrawalStatus;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  txHash?: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'category' | 'level_tier' | 'promotional';
  targetCategory?: string;
  targetLevel?: number;
  value: number;
  isActive: boolean;
  description: string;
}

export interface CommissionRecord {
  id: string;
  userId: string;
  orderId: string;
  productName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'credited' | 'cancelled';
  ruleApplied: string;
  creditedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'commission' | 'deposit' | 'withdrawal' | 'level' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'order' | 'deposit' | 'withdrawal' | 'product' | 'level' | 'system' | 'document' | 'payment_config' | 'refund';
  targetId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface PlatformSettings {
  minWithdrawal: number;
  withdrawalFeePercent: number;
  fixedWithdrawalFee: number;
  autoApproveOrders: boolean;
  manualDepositProofRequired: boolean;
  defaultCommissionRate: number;
  registrationOpen: boolean;
  companyName: string;
  supportEmail: string;
  currencySymbol: '$';
  currencyCode: 'USD';
}

export interface CompanyDocument {
  id: string;
  title: string;
  issuer: string;
  country: string;
  countryFlag: string;
  registrationNumber: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'verified' | 'certified';
  documentType: 'certificate' | 'license' | 'tax_fbr' | 'secp' | 'fin_cen';
  fileUrl?: string;
  description: string;
}

export interface BrandAmbassador {
  id: string;
  name: string;
  role: string;
  country: string;
  countryFlag: string;
  imageUrl: string;
  bio: string;
  verifiedBadge: boolean;
  partnerSince: string;
  socialHandle?: string;
}

// 1. Verified Activity Model (Country-filtered, real activity records in USD)
export interface VerifiedActivity {
  id: string;
  userId: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  city: string;
  displayName: string;
  activityType: 'withdrawal' | 'deposit' | 'task_completion' | 'plan_upgrade';
  amount: number;
  currency: 'USD';
  currencySymbol: '$';
  status: 'completed' | 'verified';
  verifiedAt: string; // ISO string
}

// 2. Global USD Payment & Binance/Crypto Configuration
export interface GlobalPaymentConfig {
  currencyCode: 'USD';
  currencySymbol: '$';
  binanceDepositAddress: string;
  binanceWithdrawalAddress: string;
  binanceDepositNetwork: string; // e.g. 'TRC20 (USDT)'
  binanceWithdrawalNetwork: string;
  binanceDepositInstructions: string;
  binanceWithdrawalInstructions: string;
  binanceDepositEnabled: boolean;
  binanceWithdrawalEnabled: boolean;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFee: number;
  supportedNetworks: string[];
  cryptoDepositInstructions: string;
  cryptoWithdrawalInstructions: string;
  cryptoEnabled: boolean;
  refundInstructions: string;
  refundEnabled: boolean;
}

// 3. Refund Records (USD Only, Binance / Crypto)
export interface RefundRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  countryCode: string;
  currency: 'USD';
  amount: number;
  paymentMethod: 'binance' | 'crypto';
  network: string;
  destinationDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNote?: string;
  referenceId: string;
  createdAt: string;
  updatedAt: string;
}

// 4. App Download Configuration
export interface AppDownloadConfig {
  apkFileName: string;
  apkVersion: string;
  apkDownloadUrl: string;
  googleDriveUrl: string;
  directDownloadEnabled: boolean;
  googleDriveEnabled: boolean;
  uploadDate: string;
  apkSizeMb: number;
  activeStatus: boolean;
}

// 5. Policy & Legal CMS Document
export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  category: string;
  lastUpdated: string;
  summary: string;
  content: string;
}

// 6. Global Company Location & Document CMS
export interface LocationDocument {
  id: string;
  locationId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'certificate' | 'license';
  uploadedAt: string;
  fileSizeMb?: number;
  isVisible: boolean;
}

export interface CompanyLocation {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  registrationNumber: string;
  companyName: string;
  description: string;
  mapsUrl: string;
  businessHours: string;
  additionalDetails?: string;
  documents: LocationDocument[];
}
