import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/common';
import { Button, Progress } from '@/components/ui';
import { EditorProvider } from '@/contexts';
import styles from './EditorLayout.module.css';

function EditorLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Se está na preview, mostrar progresso completo
  const isPreview = location.pathname.includes('/preview');
  
  // Por enquanto, mostrar progresso baseado na rota
  // O componente Editor vai gerenciar o step real internamente
  const progress = isPreview ? 100 : 0;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Sair
          </Button>
        </div>
        {!isPreview && (
          <div className={styles.progress}>
            <Progress value={progress} size="sm" />
            <span className={styles.progressText}>
              Editor de Currículo
            </span>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export function EditorLayout() {
  return (
    <EditorProvider>
      <EditorLayoutContent />
    </EditorProvider>
  );
}
