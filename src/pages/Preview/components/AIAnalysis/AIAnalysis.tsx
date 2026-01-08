import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { analyzeResume, isAIConfigured } from '@/services/ai';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
} from '@/types';
import styles from './AIAnalysis.module.css';

interface AIAnalysisProps {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
}

interface Analysis {
  strengths: string[];
  improvements: string[];
  tips: string[];
  overallFeedback: string;
}

export function AIAnalysis({
  personalData,
  objective,
  education,
  experiences,
  skills,
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!isAIConfigured()) {
      setError('IA não configurada');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeResume({
        personalData,
        objective,
        education,
        experiences,
        skills,
      });
      setAnalysis(result);
    } catch (err) {
      console.error('Erro na análise:', err);
      setError(err instanceof Error ? err.message : 'Erro ao analisar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAIConfigured()) {
    return null;
  }

  return (
    <Card padding="lg" className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>🤖</span>
        <h3 className={styles.title}>Análise por IA</h3>
      </div>

      {!analysis ? (
        <div className={styles.cta}>
          <p className={styles.description}>
            Nossa IA pode analisar seu currículo e dar feedback personalizado.
          </p>
          <Button
            onClick={handleAnalyze}
            loading={isLoading}
            fullWidth
          >
            Analisar currículo
          </Button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      ) : (
        <div className={styles.results}>
          <div className={styles.feedback}>
            <p>{analysis.overallFeedback}</p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>✅</span>
              Pontos fortes
            </h4>
            <ul className={styles.list}>
              {analysis.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📈</span>
              Melhorias sugeridas
            </h4>
            <ul className={styles.list}>
              {analysis.improvements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💡</span>
              Dicas práticas
            </h4>
            <ul className={styles.list}>
              {analysis.tips.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAnalysis(null)}
            className={styles.resetButton}
          >
            Analisar novamente
          </Button>
        </div>
      )}
    </Card>
  );
}
