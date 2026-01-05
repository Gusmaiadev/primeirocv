import { cn } from '@/utils';
import './Loading.styles.css';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots';
  fullScreen?: boolean;
  text?: string;
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  text,
}: LoadingProps) {
  const content = (
    <div className={cn('loading', `loading--${size}`)}>
      {variant === 'spinner' ? (
        <div className="loading-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="loading-spinner-track"
            />
            <path
              d="M12 2C6.477 2 2 6.477 2 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="loading-spinner-head"
            />
          </svg>
        </div>
      ) : (
        <div className="loading-dots" aria-hidden="true">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      )}

      {text && <p className="loading-text">{text}</p>}

      <span className="sr-only">Carregando...</span>
    </div>
  );

  if (fullScreen) {
    return <div className="loading-overlay">{content}</div>;
  }

  return content;
}
