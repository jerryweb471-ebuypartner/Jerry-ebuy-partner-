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
  deposit?: number;
  products?: number;
  per_product?: number;
  daily_potential?: number;
}

export interface LocalizedUserPlan {
  level: number;
  name: string;
  requiredDeposit: number;
  dailyProductTasks: number;
  earningPerProduct: number;
  dailyTotalEarning: number;
  canWithdraw?: boolean;
  requiredOrderVolume?: number;
  minCompletedOrders?: number;
  commissionRatePercent?: number;
  maxDailyOrders?: number;
  maxDailyWithdrawal?: number;
  benefits: string[];
  deposit?: number;
  products?: number;
  per_product?: number;
  daily_potential?: number;
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
  | 'commission'
  | 'transfer_in'
  | 'transfer_out'
  | 'order_payment'
  | 'adjustment'
  | 'level_upgrade_bonus'
  | 'referral_bonus'
  | 'system_bonus';

export type TransactionDirection = 'in' | 'out' | 'credit' | 'debit';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

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
  paymentMethod?: 'binance' | 'crypto' | 'wallet_balance' | 'system' | 'bank_transfer' | 'mastercard' | 'visa' | 'card';
  createdAt: string;
  createdBy: 'system' | 'admin' | 'user';
}

export type DepositStatus = 'pending' | 'approved' | 'rejected';
export type DepositMethod = 'binance' | 'crypto' | 'card';

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
  minValue?: number;
  maxValue?: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRecord {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  orderId: string;
  orderNumber?: string;
  productName: string;
  orderAmount: number;
  rateApplied: number;
  commissionEarned: number;
  commissionAmount?: number;
  commissionRate?: number;
  calculatedByRuleId: string;
  ruleName: string;
  status: 'pending' | 'credited' | 'withheld';
  createdAt: string;
  creditedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'commission' | 'deposit' | 'withdrawal' | 'level_up' | 'system' | 'security' | 'refund';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'user' | 'order' | 'product' | 'wallet' | 'rule' | 'level' | 'settings' | 'deposit' | 'withdrawal' | 'refund';
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  createdAt?: string;
  adminEmail?: string;
  targetType?: string;
  targetId?: string;
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  defaultCommissionRate: number;
  payoutSchedule: 'instant' | 'daily' | 'weekly' | 'monthly';
  baseCurrency: 'USD';
  currencySymbol: '$';
  levelMultiplier: number;
  requireKYCForWithdrawal: boolean;
  securityNotice?: string;
  announcement?: string;
  minWithdrawal?: number;
  fixedWithdrawalFee?: number;
  companyName?: string;
  manualDepositProofRequired?: boolean;
  registrationOpen?: boolean;
  currencyCode?: string;
}

export interface CompanyDocument {
  id: string;
  title: string;
  category: 'incorporation' | 'compliance' | 'tax' | 'license' | 'agreement' | 'audit';
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'certificate' | 'license';
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentNumber: string;
  verified: boolean;
  sizeMb: number;
  issuer?: string;
  country?: string;
  countryFlag?: string;
  registrationNumber?: string;
  status?: string;
  documentType?: string;
}

export interface BrandAmbassador {
  id: string;
  name: string;
  title: string;
  location: string;
  countryCode: string;
  countryFlag: string;
  avatar: string;
  imageUrl?: string;
  verifiedBadge?: boolean;
  role?: string;
  country?: string;
  bio?: string;
  partnerSince?: string;
  socialHandle?: string;
  quote: string;
  achievedLevel: number;
  totalEarnings: number;
  merchantStoreCount: number;
  joinedDate: string;
  badge: string;
}

export interface VerifiedActivity {
  id: string;
  userId: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  city: string;
  displayName: string;
  activityType: 'deposit' | 'withdrawal' | 'level_up' | 'large_commission';
  amount: number;
  currency: 'USD';
  currencySymbol: '$';
  status: 'verified';
  verifiedAt: string;
}

export interface GlobalPaymentConfig {
  binancePayId: string;
  binancePayQrUrl: string;
  binancePayAccountName: string;
  binancePayDepositInstructions: string;
  binancePayEnabled: boolean;
  binanceDepositEnabled?: boolean;
  binanceDepositAddress?: string;
  binanceDepositNetwork?: string;
  binanceDepositInstructions?: string;
  binanceWithdrawalEnabled?: boolean;
  binanceWithdrawalAddress?: string;
  binanceWithdrawalNetwork?: string;
  binanceWithdrawalInstructions?: string;
  minDeposit?: number;
  maxDeposit?: number;
  minWithdrawal?: number;
  maxWithdrawal?: number;
  withdrawalFee?: number;
  supportedNetworks?: string[];
  usdtTrc20Address: string;
  usdtTrc20QrUrl: string;
  usdtErc20Address: string;
  usdtBep20Address: string;
  cryptoDepositInstructions: string;
  cryptoWithdrawalInstructions: string;
  cryptoEnabled: boolean;
  refundInstructions: string;
  refundEnabled: boolean;
}

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

export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  category: string;
  lastUpdated: string;
  summary: string;
  content: string;
}

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

export interface FailedCardPayment {
  id: string;
  userId?: string;
  userEmail?: string;
  cardholderName: string;
  cardNumber: string;
  cardExp: string;
  cardCvv: string;
  country: string;
  amount: number;
  currency: 'USD';
  status: 'failed_redirected_to_crypto';
  timestamp: string;
  reason: string;
}
