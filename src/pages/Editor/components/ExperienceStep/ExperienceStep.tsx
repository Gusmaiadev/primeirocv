import { useState } from 'react';
import { Button, Card, Input, Select, TextArea, Modal } from '@/components/ui';
import { EXPERIENCE_TYPE_OPTIONS } from '@/constants';
import type { Experience } from '@/types';
import styles from './ExperienceStep.module.css';

interface ExperienceStepProps {
  data: Experience[];
  onAdd: (experience: Omit<Experience, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

const emptyExperience: Omit<Experience, 'id'> = {
  type: 'job',
  title: '',
  company: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  highlights: [],
};

export function ExperienceStep({ data, onAdd, onUpdate, onRemove }: ExperienceStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>(emptyExperience);

  const handleOpenModal = (experience?: Experience) => {
    if (experience) {
      setEditingId(experience.id);
      setFormData({
        type: experience.type,
        title: experience.title,
        company: experience.company,
        description: experience.description,
        startDate: experience.startDate,
        endDate: experience.endDate,
        current: experience.current,
        highlights: experience.highlights,
      });
    } else {
      setEditingId(null);
      setFormData(emptyExperience);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyExperience);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleChange = (field: keyof Omit<Experience, 'id'>, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'current' && value === true ? { endDate: '' } : {}),
    }));
  };

  const getTypeLabel = (value: string) => {
    return EXPERIENCE_TYPE_OPTIONS.find((t) => t.value === value)?.label ?? value;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job': return '💼';
      case 'internship': return '📚';
      case 'project': return '🚀';
      case 'volunteer': return '🤝';
      default: return '💼';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Experiências</h2>
        <p className={styles.description}>
          Adicione empregos, estágios, projetos pessoais ou trabalhos voluntários.
          <br />
          <strong>Não tem experiência formal?</strong> Inclua projetos da escola, voluntariado ou freelas!
        </p>
      </div>

      <div className={styles.content}>
        {data.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>💼</span>
            <p className={styles.emptyText}>
              Nenhuma experiência adicionada ainda.
            </p>
            <p className={styles.emptyHint}>
              Projetos pessoais, voluntariado e freelas também contam!
            </p>
            <Button onClick={() => handleOpenModal()}>
              Adicionar experiência
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {data.map((experience) => (
                <Card key={experience.id} variant="outlined" padding="md">
                  <div className={styles.item}>
                    <div className={styles.itemIcon}>
                      {getTypeIcon(experience.type)}
                    </div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemTitle}>{experience.title || 'Cargo não informado'}</h3>
                        <span className={styles.itemType}>{getTypeLabel(experience.type)}</span>
                      </div>
                      {experience.company && (
                        <p className={styles.itemCompany}>{experience.company}</p>
                      )}
                      <p className={styles.itemMeta}>
                        {experience.startDate}
                        {experience.current ? ' - Atual' : experience.endDate ? ` - ${experience.endDate}` : ''}
                      </p>
                      {experience.description && (
                        <p className={styles.itemDescription}>{experience.description}</p>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(experience)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(experience.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" onClick={() => handleOpenModal()} fullWidth>
              + Adicionar outra experiência
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Experiência' : 'Nova Experiência'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Salvar' : 'Adicionar'}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Select
            label="Tipo de experiência"
            options={EXPERIENCE_TYPE_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as Experience['type'])}
            required
            fullWidth
          />

          <Input
            label="Cargo / Função"
            placeholder="Ex: Auxiliar Administrativo, Desenvolvedor..."
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
          />

          <Input
            label="Empresa / Organização"
            placeholder="Ex: Nome da empresa, projeto pessoal..."
            value={formData.company ?? ''}
            onChange={(e) => handleChange('company', e.target.value)}
            hint={formData.type === 'project' ? 'Opcional para projetos pessoais' : undefined}
            fullWidth
          />

          <TextArea
            label="Descrição das atividades"
            placeholder="Descreva suas principais atividades e responsabilidades..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            maxLength={500}
            showCount
            fullWidth
          />

          <div className={styles.row}>
            <Input
              label="Data de início"
              type="month"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
              fullWidth
            />

            {!formData.current && (
              <Input
                label="Data de término"
                type="month"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                fullWidth
              />
            )}
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => handleChange('current', e.target.checked)}
            />
            <span>Trabalho atual</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
