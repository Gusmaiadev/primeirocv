import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Em produção, enviar para serviço de monitoramento
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <span className={styles.icon}>⚠️</span>
            <h2 className={styles.title}>Algo deu errado</h2>
            <p className={styles.message}>
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            <div className={styles.actions}>
              <Button onClick={this.handleReset}>Tentar novamente</Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
              >
                Voltar ao início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
