import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  ActionCodeSettings,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)' &&
  !firebaseConfig.firestoreDatabaseId.includes('ai-studio')
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ActionCodeSettings for Email Verification and Password Reset
export const getActionCodeSettings = (): ActionCodeSettings => {
  const currentOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ebuy-partner.shop';
  return {
    url: `${currentOrigin}/`,
    handleCodeInApp: true,
  };
};

// Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.warn('Firestore Note:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test
export async function testFirestoreConnection() {
  try {
    await getDoc(doc(db, 'test', 'connection')).catch(() => {});
  } catch {
    // Gracefully handled
  }
}

// User Profile Sync Helper to Firestore
export async function syncUserToFirestore(user: any) {
  if (!user || (!user.email && !user.phone)) return;
  const userId = user.id || auth.currentUser?.uid || `USR-${Date.now()}`;
  const docRef = doc(db, 'users', userId);
  const payload = {
    id: userId,
    name: user.name || 'Merchant Partner',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'user',
    status: user.status || 'active',
    level: Number(user.level ?? 0),
    country: user.country || 'United States',
    countryCode: user.countryCode || 'US',
    countryFlag: user.countryFlag || '🇺🇸',
    city: user.city || 'New York',
    currency: 'USD',
    currencySymbol: '$',
    referralCode: user.referralCode || '',
    referredBy: user.referredBy || null,
    avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    creditScore: Number(user.creditScore ?? 100),
    ipAddress: user.ipAddress || user.registrationIp || '104.28.192.44',
    registrationIp: user.registrationIp || user.ipAddress || '104.28.192.44',
    deviceInfo: user.deviceInfo || 'Chrome on Mobile',
    emailVerified: true,
    isRealClient: true,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
    console.log('✅ User synchronized to Firebase Firestore:', userId);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
  }
}

// Direct fetch for initial users on load (immediate load across new windows/browsers)
export async function fetchInitialUsersFromFirestore(): Promise<any[]> {
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const list: any[] = [];
    snapshot.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (err) {
    console.warn('Error querying initial Firestore users:', err);
    return [];
  }
}

// Real-Time Listener for Firestore Users (Works across GitHub Pages & all worldwide devices)
export function listenToFirestoreUsers(callback: (users: any[]) => void) {
  try {
    const usersCol = collection(db, 'users');
    return onSnapshot(
      usersCol,
      (snapshot) => {
        const usersList: any[] = [];
        snapshot.forEach((d) => {
          usersList.push(d.data());
        });
        callback(usersList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    );
  } catch (err) {
    console.warn('Firestore users listener fallback:', err);
    return () => {};
  }
}

// Real-Time Listener for Firestore Wallets
export function listenToFirestoreWallets(callback: (wallets: Record<string, any>) => void) {
  try {
    const walletsCol = collection(db, 'wallets');
    return onSnapshot(
      walletsCol,
      (snapshot) => {
        const walletsMap: Record<string, any> = {};
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && data.userId) {
            walletsMap[data.userId] = data;
          }
        });
        callback(walletsMap);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'wallets');
      }
    );
  } catch (err) {
    return () => {};
  }
}

// User Wallet Sync Helper to Firestore
export async function syncWalletToFirestore(wallet: any) {
  if (!wallet || !wallet.userId) return;
  const docRef = doc(db, 'wallets', wallet.userId);
  const payload = {
    userId: wallet.userId,
    availableBalance: Number(wallet.availableBalance || 0),
    pendingBalance: Number(wallet.pendingBalance || 0),
    totalDeposited: Number(wallet.totalDeposited || 0),
    totalWithdrawn: Number(wallet.totalWithdrawn || 0),
    totalCommission: Number(wallet.totalCommission || 0),
    currencyCode: 'USD',
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `wallets/${wallet.userId}`);
  }
}

// User Levels / Tier Pricing Sync Helper to Firestore
export async function syncUserLevelsToFirestore(levels: any[]) {
  if (!levels || !Array.isArray(levels)) return;
  const docRef = doc(db, 'platform_config', 'membership_tiers');
  try {
    await setDoc(docRef, { levels, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'platform_config/membership_tiers');
  }
}

// Real-Time Listener for Firestore User Levels / Tier Pricing
export function listenToFirestoreUserLevels(callback: (levels: any[]) => void) {
  try {
    const docRef = doc(db, 'platform_config', 'membership_tiers');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.levels) && data.levels.length > 0) {
            callback(data.levels);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'platform_config/membership_tiers');
      }
    );
  } catch (err) {
    return () => {};
  }
}

// Authentication Helpers
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
};
export type { ConfirmationResult, ActionCodeSettings };
