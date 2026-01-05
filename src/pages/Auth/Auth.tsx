import { Button } from '@/components/ui';
import styles from './Auth.module.css';

export function Auth() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entrar</h1>
      <p className={styles.subtitle}>
        Acesse sua conta para continuar
      </p>

      <div className={styles.buttons}>
        <Button variant="outline" fullWidth disabled>
          Continuar com Google (Em breve)
        </Button>
        <Button variant="outline" fullWidth disabled>
          Entrar com Email (Em breve)
        </Button>
      </div>

      <p className={styles.note}>
        Autenticação será implementada na Etapa 4.
      </p>
    </div>
  );
}
