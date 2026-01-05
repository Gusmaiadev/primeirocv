// ============================================
// PRIMEIROCV - INICIALIZAÇÃO FIREBASE
// ============================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { firebaseConfig, appConfig, isFirebaseConfigured } from '@/config';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Inicializa Firebase apenas se configurado
export function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } | null {
  if (!isFirebaseConfigured()) {
    console.warn('⚠️ Firebase não está configurado. Configure as variáveis de ambiente.');
    return null;
  }

  // Evita reinicialização
  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    app = initializeApp(firebaseConfig);
  }

  auth = getAuth(app);
  db = getFirestore(app);

  // Conectar aos emuladores em desenvolvimento (opcional)
  if (appConfig.isDev && import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.info('🔧 Usando emuladores Firebase');
  }

  return { app, auth, db };
}

// Getters seguros
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const result = initializeFirebase();
    if (!result) {
      throw new Error('Firebase não inicializado. Verifique as variáveis de ambiente.');
    }
  }
  return app as FirebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const result = initializeFirebase();
    if (!result) {
      throw new Error('Firebase Auth não inicializado.');
    }
  }
  return auth as Auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    const result = initializeFirebase();
    if (!result) {
      throw new Error('Firestore não inicializado.');
    }
  }
  return db as Firestore;
}

// Inicializa ao importar (side effect controlado)
if (isFirebaseConfigured()) {
  initializeFirebase();
}
