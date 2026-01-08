import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import { calculateResumeScore } from '@/utils';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
  AdditionalInfo,
} from '@/types';
import { ResumePreview, ScoreCard, AIAnalysis } from './components';
import styles from './Preview.module.css';

// Tipo do estado salvo no localStorage
interface EditorState {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  additionalInfo: AdditionalInfo[];
}

const STORAGE_KEY = 'primeirocv_draft';

const defaultPersonalData: PersonalData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
};

const defaultObjective: ProfessionalObjective = {
  text: '',
  generatedByAI: false,
};

export function Preview() {
  const navigate = useNavigate();
  const [savedDraft] = useLocalStorage<EditorState | null>(STORAGE_KEY, null);

  // Dados do currículo
  const resumeData = useMemo((): EditorState => {
    if (!savedDraft) {
      return {
        personalData: defaultPersonalData,
        objective: defaultObjective,
        education: [],
        experiences: [],
        skills: [],
        additionalInfo: [],
      };
    }
    return savedDraft;
  }, [savedDraft]);

  // Calcular pontuação
  const score = useMemo(() => {
    return calculateResumeScore({
      personalData: resumeData.personalData,
      objective: resumeData.objective,
      education: resumeData.education,
      experiences: resumeData.experiences,
      skills: resumeData.skills,
      additionalInfo: resumeData.additionalInfo,
    });
  }, [resumeData]);

  const handleEdit = () => {
    navigate('/editor');
  };

  const handleDownload = () => {
    // Será implementado na etapa de PDF
    alert('Download em PDF será implementado na próxima etapa!');
  };

  const handleImprove = () => {
    // Navegar para primeira seção com sugestão
    navigate('/editor');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" onClick={() => navigate('/editor')}>
            ← Voltar ao editor
          </Button>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>Preview do Currículo</h1>
        </div>
        <div className={styles.headerRight}>
          <Button variant="outline" onClick={handleEdit}>
            Editar
          </Button>
          <Button onClick={handleDownload}>
            Baixar PDF
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <main className={styles.previewArea}>
          <ResumePreview
            personalData={resumeData.personalData}
            objective={resumeData.objective}
            education={resumeData.education}
            experiences={resumeData.experiences}
            skills={resumeData.skills}
            additionalInfo={resumeData.additionalInfo}
          />
        </main>

        <aside className={styles.sidebar}>
          <ScoreCard score={score} onImprove={handleImprove} />
          <AIAnalysis
            personalData={resumeData.personalData}
            objective={resumeData.objective}
            education={resumeData.education}
            experiences={resumeData.experiences}
            skills={resumeData.skills}
          />
        </aside>
      </div>
    </div>
  );
}
