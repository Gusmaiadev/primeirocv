import { Outlet, Link } from 'react-router-dom';
import { Logo } from '@/components/common';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Logo size="lg" linkTo="/" />
        </div>

        <div className={styles.content}>
          <Outlet />
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Ao continuar, você concorda com nossos{' '}
            <Link to="/terms" className={styles.link}>
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className={styles.link}>
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
