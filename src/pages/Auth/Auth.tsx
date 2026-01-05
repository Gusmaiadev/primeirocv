import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts';
import { isValidEmail } from '@/utils';
import styles from './Auth.module.css';

type AuthMode = 'options' | 'email' | 'email-sent';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, sendEmailLink, loading, error, clearError, isConfigured, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<AuthMode>('options');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Redirecionar se já autenticado
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    clearError();
    await signInWithGoogle();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Digite seu email');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    await sendEmailLink(email);
    setMode('email-sent');
  };

  const handleBackToOptions = () => {
    setMode('options');
    setEmail('');
    setEmailError('');
    clearError();
  };

  if (!isConfigured) {
    return (
      <div className={styles.container}>
        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠️</span>
          <h2 className={styles.title}>Firebase não configurado</h2>
          <p className={styles.subtitle}>
            Configure as variáveis de ambiente do Firebase para habilitar a autenticação.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  // Tela de email enviado
  if (mode === 'email-sent') {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <span className={styles.successIcon}>✉️</span>
          <h2 className={styles.title}>Verifique seu email</h2>
          <p className={styles.subtitle}>
            Enviamos um link de acesso para <strong>{email}</strong>
          </p>
          <p className={styles.hint}>
            Clique no link do email para entrar. O link expira em 1 hora.
          </p>
          <Button variant="ghost" onClick={handleBackToOptions}>
            Usar outro método
          </Button>
        </div>
      </div>
    );
  }

  // Tela de email input
  if (mode === 'email') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Entrar com Email</h1>
        <p className={styles.subtitle}>
          Você receberá um link de acesso no seu email
        </p>

        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            fullWidth
            autoFocus
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth loading={loading}>
            Enviar link de acesso
          </Button>
        </form>

        <button
          type="button"
          className={styles.backLink}
          onClick={handleBackToOptions}
        >
          ← Voltar
        </button>
      </div>
    );
  }

  // Tela principal de opções
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entrar</h1>
      <p className={styles.subtitle}>
        Acesse sua conta para continuar
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignIn}
          loading={loading}
          leftIcon={<GoogleIcon />}
        >
          Continuar com Google
        </Button>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={() => setMode('email')}
          leftIcon={<EmailIcon />}
        >
          Continuar com Email
        </Button>
      </div>

      <p className={styles.note}>
        Não tem conta? Ela será criada automaticamente.
      </p>
    </div>
  );
}

// Ícones inline
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 009.003 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 00.958 4.958L3.965 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  );
}
