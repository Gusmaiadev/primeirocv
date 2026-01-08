import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import styles from './QuickActions.module.css';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card padding="lg" className={styles.card}>
      <h3 className={styles.title}>Ações Rápidas</h3>
      
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => navigate('/editor')}
        >
          <span className={styles.actionIcon}>✏️</span>
          <span className={styles.actionLabel}>Editar Currículo Base</span>
        </button>

        <button
          type="button"
          className={styles.actionButton}
          onClick={() => navigate('/editor/preview')}
        >
          <span className={styles.actionIcon}>👁️</span>
          <span className={styles.actionLabel}>Ver Preview</span>
        </button>

        <button
          type="button"
          className={styles.actionButton}
          onClick={() => alert('Disponível em breve!')}
        >
          <span className={styles.actionIcon}>📥</span>
          <span className={styles.actionLabel}>Baixar PDF</span>
        </button>

        <button
          type="button"
          className={styles.actionButton}
          onClick={() => navigate('/plans')}
        >
          <span className={styles.actionIcon}>⭐</span>
          <span className={styles.actionLabel}>Ver Planos</span>
        </button>
      </div>
    </Card>
  );
}
