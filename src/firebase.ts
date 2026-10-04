import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
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
export const googleProvider = new GoogleAuthProvider();

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
  if (!user || !user.email) return;
  const userId = user.id || auth.currentUser?.uid || `USR-${Date.now()}`;
  const docRef = doc(db, 'users', userId);
  const payload = {
    id: userId,
    name: user.name || 'Merchant Partner',
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
    status: user.status || 'active',
    level: Number(user.level ?? 0),
    country: user.country || 'United States',
    countryCode: user.countryCode || 'US',
    currency: 'USD',
    referralCode: user.referralCode || '',
    referredBy: user.referredBy || null,
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

// Authentication Helpers
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
};
