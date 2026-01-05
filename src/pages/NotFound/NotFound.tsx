import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import styles from './NotFound.module.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.message}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button onClick={() => navigate('/')}>Voltar ao início</Button>
      </div>
    </div>
  );
}
