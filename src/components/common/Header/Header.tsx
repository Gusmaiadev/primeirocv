import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import './Header.styles.css';

export interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={cn('header', `header--${variant}`)}>
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">📄</span>
          <span className="header-logo-text">PrimeiroCV</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            className={cn('header-link', isHome && 'header-link--active')}
          >
            Início
          </Link>
          <Link
            to="/pricing"
            className={cn(
              'header-link',
              location.pathname === '/pricing' && 'header-link--active'
            )}
          >
            Planos
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link to="/editor">
            <Button size="sm">Criar Currículo</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="header-mobile-toggle"
          aria-label="Menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
