import { useState } from 'react';
import { Input, TextArea, Button, Badge } from '@/components/ui';
import type { ProfessionalObjective } from '@/types';
import styles from './ObjectiveStep.module.css';

interface ObjectiveStepProps {
  data: ProfessionalObjective;
  onChange: (data: Partial<ProfessionalObjective>) => void;
  errors?: Partial<Record<keyof ProfessionalObjective, string>>;
}

const EXAMPLE_OBJECTIVES = [
  'Busco uma oportunidade de estágio na área de tecnologia onde possa aplicar meus conhecimentos em programação e contribuir para o crescimento da empresa enquanto desenvolvo minhas habilidades profissionais.',
  'Jovem aprendiz em busca da primeira experiência profissional, com grande disposição para aprender e contribuir com a equipe. Possuo boa comunicação, responsabilidade e vontade de crescer.',
  'Estudante de Administração buscando estágio na área administrativa. Organizado, proativo e com conhecimentos em Excel e atendimento ao cliente.',
];

export function ObjectiveStep({ data, onChange, errors = {} }: ObjectiveStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    // Simular geração por IA (será implementado na etapa de IA)
    setTimeout(() => {
      const randomExample = EXAMPLE_OBJECTIVES[Math.floor(Math.random() * EXAMPLE_OBJECTIVES.length)];
      onChange({ text: randomExample, generatedByAI: true });
      setIsGenerating(false);
    }, 1500);
  };

  const characterCount = data.text.length;
  const minChars = 50;
  const maxChars = 500;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Objetivo Profissional</h2>
        <p className={styles.description}>
          Descreva brevemente seus objetivos de carreira e o que você busca.
          Seja específico sobre a área ou tipo de vaga.
        </p>
      </div>

      <div className={styles.form}>
        <Input
          label="Cargo ou área desejada"
          placeholder="Ex: Estágio em Marketing, Jovem Aprendiz, Auxiliar Administrativo"
          value={data.targetPosition ?? ''}
          onChange={(e) => onChange({ targetPosition: e.target.value })}
          hint="Ajuda a IA a personalizar seu objetivo"
          fullWidth
        />

        <div className={styles.textareaWrapper}>
          <TextArea
            label="Seu objetivo profissional"
            placeholder="Descreva o que você busca e o que pode oferecer..."
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value, generatedByAI: false })}
            error={errors.text}
            maxLength={maxChars}
            showCount
            required
            fullWidth
          />

          {data.generatedByAI && (
            <Badge variant="primary" className={styles.aiBadge}>
              ✨ Gerado com IA
            </Badge>
          )}
        </div>

        <div className={styles.helper}>
          {characterCount < minChars ? (
            <span className={styles.warning}>
              Mínimo {minChars} caracteres ({minChars - characterCount} restantes)
            </span>
          ) : (
            <span className={styles.success}>
              ✓ Tamanho adequado
            </span>
          )}
        </div>

        <div className={styles.aiSection}>
          <div className={styles.aiHeader}>
            <span className={styles.aiIcon}>✨</span>
            <div>
              <h3 className={styles.aiTitle}>Precisa de ajuda?</h3>
              <p className={styles.aiDescription}>
                Nossa IA pode criar um objetivo personalizado para você.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleGenerateWithAI}
            loading={isGenerating}
          >
            Gerar com IA
          </Button>
        </div>

        <div className={styles.tips}>
          <h4 className={styles.tipsTitle}>💡 Dicas</h4>
          <ul className={styles.tipsList}>
            <li>Mencione a área ou cargo específico que busca</li>
            <li>Destaque suas principais qualidades</li>
            <li>Mostre disposição para aprender</li>
            <li>Evite objetivos muito genéricos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
