import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import type { Resume } from '@/types';
import styles from './ResumeList.module.css';

interface ResumeListProps {
  resumes: Resume[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

export function ResumeList({ resumes, onDelete, isDeleting }: ResumeListProps) {
  const navigate = useNavigate();

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' | 'default' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'default';
    return 'error';
  };

  if (resumes.length === 0) {
    return (
      <Card padding="lg" className={styles.emptyCard}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📄</span>
          <h3 className={styles.emptyTitle}>Nenhum currículo ainda</h3>
          <p className={styles.emptyText}>
            Crie seu primeiro currículo e comece a se candidatar às vagas!
          </p>
          <Button onClick={() => navigate('/editor')}>
            Criar meu currículo
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Meus Currículos</h3>
      </div>

      <div className={styles.list}>
        {resumes.map((resume) => (
          <Card key={resume.id} padding="md" className={styles.resumeCard}>
            <div className={styles.resumeContent}>
              <div className={styles.resumeInfo}>
                <div className={styles.resumeHeader}>
                  <h4 className={styles.resumeName}>
                    {resume.personalData.fullName || 'Sem nome'}
                    {resume.isBase && (
                      <Badge variant="primary" size="sm">Base</Badge>
                    )}
                  </h4>
                  <Badge variant={getScoreColor(resume.score)} size="sm">
                    {resume.score}%
                  </Badge>
                </div>
                
                <p className={styles.resumeMeta}>
                  {resume.objective.targetPosition || 'Objetivo não definido'}
                </p>
                
                <p className={styles.resumeDate}>
                  Atualizado em {formatDate(resume.updatedAt)}
                </p>
              </div>

              <div className={styles.resumeActions}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/editor')}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/editor/preview')}
                >
                  Preview
                </Button>
                {!resume.isBase && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(resume.id)}
                    loading={isDeleting === resume.id}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
