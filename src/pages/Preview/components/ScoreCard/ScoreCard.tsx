import { Progress, Card } from '@/components/ui';
import { getScoreClassification } from '@/utils';
import type { ScoreDetails } from '@/types';
import styles from './ScoreCard.module.css';

interface ScoreCardProps {
  score: ScoreDetails;
  onImprove?: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  personalData: 'Dados Pessoais',
  objective: 'Objetivo',
  education: 'Formação',
  experience: 'Experiências',
  skills: 'Habilidades',
  additionalInfo: 'Info. Adicionais',
};

const SECTION_MAX: Record<string, number> = {
  personalData: 20,
  objective: 15,
  education: 20,
  experience: 20,
  skills: 15,
  additionalInfo: 10,
};

export function ScoreCard({ score, onImprove }: ScoreCardProps) {
  const classification = getScoreClassification(score.total);

  return (
    <Card padding="lg" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Pontuação do Currículo</h3>
      </div>

      <div className={styles.scoreCircle}>
        <svg viewBox="0 0 100 100" className={styles.circleSvg}>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--color-gray-200)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`var(--color-${classification.color})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score.total / 100) * 283} 283`}
            transform="rotate(-90 50 50)"
            className={styles.progressCircle}
          />
        </svg>
        <div className={styles.scoreValue}>
          <span className={styles.scoreNumber}>{score.total}</span>
          <span className={styles.scoreMax}>/100</span>
        </div>
      </div>

      <div className={styles.classification}>
        <span
          className={styles.classificationLabel}
          style={{ color: `var(--color-${classification.color})` }}
        >
          {classification.label}
        </span>
        <p className={styles.classificationDescription}>
          {classification.description}
        </p>
      </div>

      <div className={styles.breakdown}>
        <h4 className={styles.breakdownTitle}>Detalhamento</h4>
        {Object.entries(score.breakdown).map(([key, value]) => (
          <div key={key} className={styles.breakdownItem}>
            <div className={styles.breakdownHeader}>
              <span className={styles.breakdownLabel}>{SECTION_LABELS[key]}</span>
              <span className={styles.breakdownValue}>
                {Math.round(value)}/{SECTION_MAX[key]}
              </span>
            </div>
            <Progress
              value={(value / SECTION_MAX[key]) * 100}
              size="sm"
            />
          </div>
        ))}
      </div>

      {score.suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <h4 className={styles.suggestionsTitle}>💡 Sugestões de melhoria</h4>
          <ul className={styles.suggestionsList}>
            {score.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
          {onImprove && (
            <button
              type="button"
              className={styles.improveButton}
              onClick={onImprove}
            >
              Melhorar agora →
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
