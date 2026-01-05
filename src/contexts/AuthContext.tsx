// ============================================
// PRIMEIROCV - CONTEXTO DE AUTENTICAÇÃO
// ============================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  onAuthChange,
  signInWithGoogle,
  sendEmailLink,
  completeEmailLinkSignIn,
  isEmailSignInLink,
  signOut as firebaseSignOut,
  getUserData,
} from '@/services/firebase';
import { isFirebaseConfigured } from '@/config';
import type { User } from '@/types';

// ============================================
// TIPOS
// ============================================

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

// ============================================
// CONTEXTO
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    loading: true,
    error: null,
  });

  const isConfigured = isFirebaseConfigured();

  // Observer de estado de autenticação
  useEffect(() => {
    if (!isConfigured) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          setState({
            firebaseUser,
            user: userData,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error('Erro ao carregar dados do usuário:', err);
          setState({
            firebaseUser,
            user: null,
            loading: false,
            error: 'Erro ao carregar dados do usuário',
          });
        }
      } else {
        setState({
          firebaseUser: null,
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, [isConfigured]);

  // Verificar Email Link ao carregar
  useEffect(() => {
    if (!isConfigured) return;

    const url = window.location.href;
    if (isEmailSignInLink(url)) {
      completeEmailLinkSignIn(url)
        .then(() => {
          // Limpar URL
          window.history.replaceState(null, '', window.location.pathname);
        })
        .catch((err: Error) => {
          setState((prev) => ({
            ...prev,
            error: err.message || 'Erro ao completar login',
          }));
        });
    }
  }, [isConfigured]);

  // Handlers
  const handleSignInWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      setState((prev) => ({ ...prev, error: 'Firebase não configurado' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithGoogle();
    } catch (err) {
      const error = err as Error;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao fazer login com Google',
      }));
    }
  }, [isConfigured]);

  const handleSendEmailLink = useCallback(async (email: string) => {
    if (!isConfigured) {
      setState((prev) => ({ ...prev, error: 'Firebase não configurado' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await sendEmailLink(email);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      const error = err as Error;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao enviar link de login',
      }));
    }
  }, [isConfigured]);

  const handleCompleteEmailSignIn = useCallback(async () => {
    if (!isConfigured) return;

    const url = window.location.href;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await completeEmailLinkSignIn(url);
      window.history.replaceState(null, '', window.location.pathname);
    } catch (err) {
      const error = err as Error;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao completar login',
      }));
    }
  }, [isConfigured]);

  const handleSignOut = useCallback(async () => {
    if (!isConfigured) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await firebaseSignOut();
    } catch (err) {
      const error = err as Error;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao sair',
      }));
    }
  }, [isConfigured]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    signInWithGoogle: handleSignInWithGoogle,
    sendEmailLink: handleSendEmailLink,
    completeEmailSignIn: handleCompleteEmailSignIn,
    signOut: handleSignOut,
    clearError,
    isAuthenticated: !!state.firebaseUser,
    isConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
