import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common';
import { Button } from '@/components/ui';
import { useAuth } from '@/contexts';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut, loading } = useAuth();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo />
          <nav className={styles.nav}>
            <Link to="/plans" className={styles.navLink}>
              Planos
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={styles.navLink}>
                Meus Currículos
              </Link>
            )}
            <Button
              size="sm"
              variant={isAuthenticated ? 'ghost' : 'outline'}
              onClick={handleAuthAction}
              loading={loading}
            >
              {isAuthenticated ? (user?.displayName || 'Sair') : 'Entrar'}
            </Button>
            <Button size="sm" onClick={() => navigate('/editor')}>
              Criar Currículo
            </Button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <Logo size="sm" />
            <p className={styles.footerText}>
              Ajudando jovens a conquistar o primeiro emprego.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Produto</h4>
              <Link to="/plans" className={styles.footerLink}>Planos</Link>
              <Link to="/editor" className={styles.footerLink}>Criar Currículo</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Suporte</h4>
              <a href="mailto:contato@primeirocv.com.br" className={styles.footerLink}>
                Contato
              </a>
              <Link to="/terms" className={styles.footerLink}>Termos de Uso</Link>
              <Link to="/privacy" className={styles.footerLink}>Privacidade</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} PrimeiroCV. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
