import { useState } from 'react';
import { Button, Input, Select, Modal, Badge } from '@/components/ui';
import { SKILL_LEVEL_OPTIONS, SKILL_CATEGORY_OPTIONS } from '@/constants';
import type { Skill } from '@/types';
import styles from './SkillsStep.module.css';

interface SkillsStepProps {
  data: Skill[];
  onAdd: (skill: Omit<Skill, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}

const emptySkill: Omit<Skill, 'id'> = {
  name: '',
  level: 'basic',
  category: 'technical',
};

const SUGGESTED_SKILLS = {
  technical: ['Excel', 'Word', 'PowerPoint', 'Pacote Office', 'Internet', 'Digitação', 'Informática básica'],
  soft: ['Comunicação', 'Trabalho em equipe', 'Organização', 'Proatividade', 'Pontualidade', 'Responsabilidade', 'Flexibilidade'],
  language: ['Inglês', 'Espanhol', 'Libras'],
  tool: ['Canva', 'Google Docs', 'Trello', 'WhatsApp Business'],
};

export function SkillsStep({ data, onAdd, onUpdate, onRemove }: SkillsStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>(emptySkill);

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      });
    } else {
      setEditingId(null);
      setFormData(emptySkill);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptySkill);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleChange = (field: keyof Omit<Skill, 'id'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickAdd = (name: string, category: Skill['category']) => {
    // Verificar se já existe
    if (data.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    onAdd({ name, level: 'intermediate', category });
  };

  const getCategoryLabel = (value: string) => {
    return SKILL_CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
  };

  const getLevelLabel = (value: string) => {
    return SKILL_LEVEL_OPTIONS.find((l) => l.value === value)?.label ?? value;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '💻';
      case 'soft': return '🧠';
      case 'language': return '🌍';
      case 'tool': return '🔧';
      default: return '📌';
    }
  };

  const skillsByCategory = data.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Habilidades</h2>
        <p className={styles.description}>
          Liste suas habilidades técnicas, comportamentais e idiomas.
        </p>
      </div>

      <div className={styles.content}>
        {/* Quick add suggestions */}
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Sugestões rápidas:</h3>
          <div className={styles.suggestionsTabs}>
            {Object.entries(SUGGESTED_SKILLS).map(([category, skills]) => (
              <div key={category} className={styles.suggestionsGroup}>
                <span className={styles.suggestionsCategoryIcon}>
                  {getCategoryIcon(category)}
                </span>
                <div className={styles.suggestionsList}>
                  {skills.map((skill) => {
                    const isAdded = data.some(
                      (s) => s.name.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <button
                        key={skill}
                        type="button"
                        className={`${styles.suggestionChip} ${isAdded ? styles.suggestionChipAdded : ''}`}
                        onClick={() => handleQuickAdd(skill, category as Skill['category'])}
                        disabled={isAdded}
                      >
                        {isAdded ? '✓' : '+'} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Added skills */}
        {data.length > 0 && (
          <div className={styles.skillsContainer}>
            <h3 className={styles.skillsTitle}>
              Suas habilidades ({data.length})
            </h3>
            
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className={styles.categoryGroup}>
                <h4 className={styles.categoryTitle}>
                  {getCategoryIcon(category)} {getCategoryLabel(category)}
                </h4>
                <div className={styles.skillsList}>
                  {skills.map((skill) => (
                    <div key={skill.id} className={styles.skillItem}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <Badge variant="default" size="sm">
                        {getLevelLabel(skill.level)}
                      </Badge>
                      <button
                        type="button"
                        className={styles.skillEdit}
                        onClick={() => handleOpenModal(skill)}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className={styles.skillRemove}
                        onClick={() => onRemove(skill.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={() => handleOpenModal()} fullWidth>
          + Adicionar habilidade personalizada
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Habilidade' : 'Nova Habilidade'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingId ? 'Salvar' : 'Adicionar'}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Input
            label="Nome da habilidade"
            placeholder="Ex: Excel, Comunicação, Inglês..."
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
          />

          <Select
            label="Categoria"
            options={SKILL_CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
            fullWidth
          />

          <Select
            label="Nível"
            options={SKILL_LEVEL_OPTIONS.map((l) => ({ value: l.value, label: l.label }))}
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            required
            fullWidth
          />
        </div>
      </Modal>
    </div>
  );
}
