import { useState } from 'react';
import { Button, Card, Input, Select, Modal } from '@/components/ui';
import { DEGREE_OPTIONS } from '@/constants';
import type { Education } from '@/types';
import styles from './EducationStep.module.css';

interface EducationStepProps {
  data: Education[];
  onAdd: (education: Omit<Education, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  course: '',
  degree: 'ensino_medio',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

export function EducationStep({ data, onAdd, onUpdate, onRemove }: EducationStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>(emptyEducation);

  const handleOpenModal = (education?: Education) => {
    if (education) {
      setEditingId(education.id);
      setFormData({
        institution: education.institution,
        course: education.course,
        degree: education.degree,
        startDate: education.startDate,
        endDate: education.endDate,
        current: education.current,
        description: education.description,
      });
    } else {
      setEditingId(null);
      setFormData(emptyEducation);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyEducation);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleChange = (field: keyof Omit<Education, 'id'>, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'current' && value === true ? { endDate: '' } : {}),
    }));
  };

  const getDegreeLabel = (value: string) => {
    return DEGREE_OPTIONS.find((d) => d.value === value)?.label ?? value;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Formação Acadêmica</h2>
        <p className={styles.description}>
          Adicione sua formação escolar, cursos técnicos ou graduação.
        </p>
      </div>

      <div className={styles.content}>
        {data.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎓</span>
            <p className={styles.emptyText}>
              Nenhuma formação adicionada ainda.
            </p>
            <Button onClick={() => handleOpenModal()}>
              Adicionar formação
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {data.map((education) => (
                <Card key={education.id} variant="outlined" padding="md">
                  <div className={styles.item}>
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemTitle}>{education.course || 'Curso não informado'}</h3>
                      <p className={styles.itemInstitution}>{education.institution}</p>
                      <p className={styles.itemMeta}>
                        {getDegreeLabel(education.degree)} • {education.startDate}
                        {education.current ? ' - Cursando' : education.endDate ? ` - ${education.endDate}` : ''}
                      </p>
                    </div>
                    <div className={styles.itemActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(education)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(education.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" onClick={() => handleOpenModal()} fullWidth>
              + Adicionar outra formação
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Formação' : 'Nova Formação'}
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
          <Input
            label="Instituição"
            placeholder="Ex: ETEC, SENAI, USP..."
            value={formData.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            required
            fullWidth
          />

          <Input
            label="Curso"
            placeholder="Ex: Ensino Médio, Técnico em Informática..."
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value)}
            required
            fullWidth
          />

          <Select
            label="Nível"
            options={DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label }))}
            value={formData.degree}
            onChange={(e) => handleChange('degree', e.target.value as Education['degree'])}
            required
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
                label="Data de conclusão"
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
            <span>Ainda estou cursando</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
