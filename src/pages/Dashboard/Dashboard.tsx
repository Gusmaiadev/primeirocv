import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts';
import { getUserResumes, deleteResume } from '@/services/firebase';
import { Spinner } from '@/components/ui';
import { StatsCards, QuickActions, ResumeList } from './components';
import type { Resume } from '@/types';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carregar currículos
  useEffect(() => {
    async function loadResumes() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserResumes(user.id);
        setResumes(data);
      } catch (err) {
        console.error('Erro ao carregar currículos:', err);
        setError('Não foi possível carregar seus currículos.');
      } finally {
        setIsLoading(false);
      }
    }

    loadResumes();
  }, [user]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalResumes = resumes.length;
    const averageScore = totalResumes > 0
      ? Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / totalResumes)
      : 0;
    const lastUpdated = resumes.length > 0
      ? new Date(Math.max(...resumes.map(r => r.updatedAt.getTime())))
      : null;

    return { totalResumes, averageScore, lastUpdated };
  }, [resumes]);

  // Deletar currículo
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este currículo?')) return;
    
    try {
      setIsDeleting(id);
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Não foi possível excluir o currículo.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>
            Olá, {user?.displayName?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className={styles.subtitle}>
            Gerencie seus currículos e acompanhe seu progresso.
          </p>
        </div>
      </header>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <section className={styles.stats}>
        <StatsCards
          totalResumes={stats.totalResumes}
          averageScore={stats.averageScore}
          lastUpdated={stats.lastUpdated}
        />
      </section>

      <div className={styles.content}>
        <section className={styles.mainContent}>
          <ResumeList
            resumes={resumes}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </section>

        <aside className={styles.sidebar}>
          <QuickActions />
        </aside>
      </div>
    </div>
  );
}
