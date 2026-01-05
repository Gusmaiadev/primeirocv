import {
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import { cn } from '@/utils';
import styles from './Input.module.css';

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  showCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      showCount = false,
      className,
      id,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            styles.input,
            styles.md,
            styles.textarea,
            error && styles.hasError,
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          maxLength={maxLength}
          value={value}
          {...props}
        />

        <div className={styles.footer}>
          {error && (
            <span id={errorId} className={styles.error} role="alert">
              {error}
            </span>
          )}

          {hint && !error && (
            <span id={hintId} className={styles.hint}>
              {hint}
            </span>
          )}

          {showCount && maxLength && (
            <span className={styles.count}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
