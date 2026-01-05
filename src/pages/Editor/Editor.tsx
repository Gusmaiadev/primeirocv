import { Card } from '@/components/ui';
import styles from './Editor.module.css';

export function Editor() {
  return (
    <div className={styles.container}>
      <Card padding="lg">
        <h1 className={styles.title}>Editor de Currículo</h1>
        <p className={styles.description}>
          O editor multi-step será implementado na Etapa 5.
        </p>
      </Card>
    </div>
  );
}
