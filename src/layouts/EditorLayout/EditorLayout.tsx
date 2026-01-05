import { Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common';
import { Button, Progress } from '@/components/ui';
import styles from './EditorLayout.module.css';

interface EditorLayoutProps {
  currentStep?: number;
  totalSteps?: number;
}

export function EditorLayout({ currentStep = 1, totalSteps = 6 }: EditorLayoutProps) {
  const navigate = useNavigate();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Sair
          </Button>
        </div>
        <div className={styles.progress}>
          <Progress value={progress} size="sm" />
          <span className={styles.progressText}>
            Etapa {currentStep} de {totalSteps}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
