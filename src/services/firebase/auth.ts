// ============================================
// PRIMEIROCV - SERVIÇO DE AUTENTICAÇÃO
// ============================================

import {
  signInWithPopup,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './app';
import { actionCodeSettings } from '@/config';
import type { User as AppUser, UserPlan } from '@/types';

// Provider do Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Chave para salvar email no localStorage (para Email Link)
const EMAIL_FOR_SIGNIN_KEY = 'emailForSignIn';

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

/**
 * Login com Google
 */
export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  
  // Criar/atualizar documento do usuário no Firestore
  await createOrUpdateUser(result.user);
  
  return result.user;
}

/**
 * Enviar link de login por email
 */
export async function sendEmailLink(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  
  // Salvar email para verificação posterior
  window.localStorage.setItem(EMAIL_FOR_SIGNIN_KEY, email);
}

/**
 * Completar login com Email Link
 */
export async function completeEmailLinkSignIn(url: string): Promise<User | null> {
  const auth = getFirebaseAuth();
  
  if (!isSignInWithEmailLink(auth, url)) {
    return null;
  }
  
  // Recuperar email salvo
  let email = window.localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
  
  // Se não tiver email salvo, pedir para o usuário
  if (!email) {
    email = window.prompt('Por favor, confirme seu email para completar o login:');
  }
  
  if (!email) {
    throw new Error('Email é obrigatório para completar o login.');
  }
  
  const result = await signInWithEmailLink(auth, email, url);
  
  // Limpar email salvo
  window.localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY);
  
  // Criar/atualizar documento do usuário
  await createOrUpdateUser(result.user);
  
  return result.user;
}

/**
 * Verificar se URL é um link de login
 */
export function isEmailSignInLink(url: string): boolean {
  const auth = getFirebaseAuth();
  return isSignInWithEmailLink(auth, url);
}

/**
 * Logout
 */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * Observer de estado de autenticação
 */
export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

/**
 * Obter usuário atual
 */
export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth.currentUser;
}

// ============================================
// FUNÇÕES DE USUÁRIO NO FIRESTORE
// ============================================

/**
 * Criar ou atualizar documento do usuário
 */
async function createOrUpdateUser(firebaseUser: User): Promise<void> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Novo usuário
    const newUser = {
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      plan: null,
    };
    
    await setDoc(userRef, newUser);
  } else {
    // Usuário existente - atualizar último login
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
  }
}

/**
 * Obter dados do usuário do Firestore
 */
export async function getUserData(uid: string): Promise<AppUser | null> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }
  
  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as AppUser;
}

/**
 * Atualizar plano do usuário
 * NOTA: Esta função só deve ser chamada pelo backend após confirmação de pagamento
 */
export async function updateUserPlan(uid: string, plan: UserPlan): Promise<void> {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  
  await setDoc(userRef, { plan }, { merge: true });
}
