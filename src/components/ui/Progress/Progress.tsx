import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';
import styles from './Progress.module.css';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Determine variant based on percentage if not specified
  const autoVariant = (): ProgressProps['variant'] => {
    if (variant !== 'default') return variant;
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'default';
  };

  return (
    <div className={cn(styles.wrapper, className)} {...props}>
      {(showLabel || label) && (
        <div className={styles.labelWrapper}>
          {label && <span className={styles.label}>{label}</span>}
          {showLabel && (
            <span className={styles.percentage}>{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div
        className={cn(styles.track, styles[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(styles.bar, styles[`bar-${autoVariant()}`])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
