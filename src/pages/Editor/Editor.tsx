import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { useResumeEditor } from './hooks';
import {
  StepNavigation,
  PersonalDataStep,
  ObjectiveStep,
  EducationStep,
  ExperienceStep,
  SkillsStep,
  AdditionalInfoStep,
} from './components';
import styles from './Editor.module.css';

export function Editor() {
  const navigate = useNavigate();
  const editor = useResumeEditor();

  const renderStep = () => {
    switch (editor.currentStep) {
      case 1:
        return (
          <PersonalDataStep
            data={editor.personalData}
            onChange={editor.updatePersonalData}
          />
        );
      case 2:
        return (
          <ObjectiveStep
            data={editor.objective}
            onChange={editor.updateObjective}
          />
        );
      case 3:
        return (
          <EducationStep
            data={editor.education}
            onAdd={editor.addEducation}
            onUpdate={editor.updateEducation}
            onRemove={editor.removeEducation}
          />
        );
      case 4:
        return (
          <ExperienceStep
            data={editor.experiences}
            onAdd={editor.addExperience}
            onUpdate={editor.updateExperience}
            onRemove={editor.removeExperience}
          />
        );
      case 5:
        return (
          <SkillsStep
            data={editor.skills}
            onAdd={editor.addSkill}
            onUpdate={editor.updateSkill}
            onRemove={editor.removeSkill}
          />
        );
      case 6:
        return (
          <AdditionalInfoStep
            data={editor.additionalInfo}
            onAdd={editor.addAdditionalInfo}
            onUpdate={editor.updateAdditionalInfo}
            onRemove={editor.removeAdditionalInfo}
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (editor.isLastStep) {
      // Ir para preview
      navigate('/editor/preview');
    } else {
      editor.nextStep();
    }
  };

  return (
    <div className={styles.container}>
      <StepNavigation
        currentStep={editor.currentStep}
        onStepClick={editor.goToStep}
      />

      <Card padding="lg" className={styles.card}>
        {renderStep()}
      </Card>

      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          {!editor.isFirstStep && (
            <Button variant="ghost" onClick={editor.prevStep}>
              ← Voltar
            </Button>
          )}
        </div>

        <div className={styles.actionsCenter}>
          {editor.lastSavedAt && (
            <span className={styles.savedAt}>
              Salvo automaticamente
            </span>
          )}
        </div>

        <div className={styles.actionsRight}>
          <Button onClick={handleNext}>
            {editor.isLastStep ? 'Ver Preview' : 'Continuar →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
