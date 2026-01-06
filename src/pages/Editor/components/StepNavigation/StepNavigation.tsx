import { EDITOR_STEPS } from '@/constants';
import { cn } from '@/utils';
import styles from './StepNavigation.module.css';

interface StepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps?: number[];
}

export function StepNavigation({
  currentStep,
  onStepClick,
  completedSteps = [],
}: StepNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Etapas do currículo">
      <ol className={styles.steps}>
        {EDITOR_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isPast = step.id < currentStep;

          return (
            <li key={step.id} className={styles.stepItem}>
              <button
                type="button"
                className={cn(
                  styles.stepButton,
                  isActive && styles.active,
                  (isCompleted || isPast) && styles.completed
                )}
                onClick={() => onStepClick(step.id)}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={styles.stepNumber}>
                  {isCompleted || isPast ? (
                    <CheckIcon />
                  ) : (
                    step.id
                  )}
                </span>
                <span className={styles.stepName}>{step.name}</span>
              </button>
              
              {step.id < EDITOR_STEPS.length && (
                <div
                  className={cn(
                    styles.connector,
                    (isCompleted || isPast) && styles.connectorCompleted
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
