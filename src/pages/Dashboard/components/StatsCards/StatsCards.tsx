import { Card } from '@/components/ui';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
  totalResumes: number;
  averageScore: number;
  lastUpdated: Date | null;
}

export function StatsCards({ totalResumes, averageScore, lastUpdated }: StatsCardsProps) {
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Nunca';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.container}>
      <Card padding="md" className={styles.card}>
        <div className={styles.cardIcon}>📄</div>
        <div className={styles.cardContent}>
          <span className={styles.cardValue}>{totalResumes}</span>
          <span className={styles.cardLabel}>Currículos</span>
        </div>
      </Card>

      <Card padding="md" className={styles.card}>
        <div className={styles.cardIcon}>⭐</div>
        <div className={styles.cardContent}>
          <span className={styles.cardValue}>{averageScore}%</span>
          <span className={styles.cardLabel}>Score Médio</span>
        </div>
      </Card>

      <Card padding="md" className={styles.card}>
        <div className={styles.cardIcon}>🕐</div>
        <div className={styles.cardContent}>
          <span className={styles.cardValue}>{formatDate(lastUpdated)}</span>
          <span className={styles.cardLabel}>Última edição</span>
        </div>
      </Card>
    </div>
  );
}
