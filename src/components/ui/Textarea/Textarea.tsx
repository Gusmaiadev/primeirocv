import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils';
import './Textarea.styles.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = Boolean(error);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('textarea-wrapper', fullWidth && 'textarea-wrapper--full-width')}>
        {label && (
          <label htmlFor={textareaId} className="textarea-label">
            {label}
            {props.required && <span className="textarea-required">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn('textarea', hasError && 'textarea--error', className)}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          maxLength={maxLength}
          value={value}
          {...props}
        />

        <div className="textarea-footer">
          {error && (
            <span id={`${textareaId}-error`} className="textarea-error" role="alert">
              {error}
            </span>
          )}

          {hint && !error && (
            <span id={`${textareaId}-hint`} className="textarea-hint">
              {hint}
            </span>
          )}

          {showCount && maxLength && (
            <span className="textarea-count">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
