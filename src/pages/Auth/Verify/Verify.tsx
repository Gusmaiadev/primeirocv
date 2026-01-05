import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Button } from '@/components/ui';
import { useAuth } from '@/contexts';
import styles from './Verify.module.css';

export function Verify() {
  const navigate = useNavigate();
  const { completeEmailSignIn, isAuthenticated, error } = useAuth();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        await completeEmailSignIn();
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [completeEmailSignIn]);

  useEffect(() => {
    if (isAuthenticated && !verifying) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, verifying, navigate]);

  if (verifying) {
    return (
      <div className={styles.container}>
        <Spinner size="lg" />
        <p className={styles.message}>Verificando seu acesso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <span className={styles.icon}>❌</span>
        <h2 className={styles.title}>Erro na verificação</h2>
        <p className={styles.message}>{error}</p>
        <Button onClick={() => navigate('/auth')}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.icon}>✅</span>
      <h2 className={styles.title}>Verificado com sucesso!</h2>
      <p className={styles.message}>Redirecionando...</p>
    </div>
  );
}
