import { useState } from 'react';
import { Button, Card, Input, Select, Modal } from '@/components/ui';
import { ADDITIONAL_INFO_TYPE_OPTIONS } from '@/constants';
import type { AdditionalInfo } from '@/types';
import styles from './AdditionalInfoStep.module.css';

interface AdditionalInfoStepProps {
  data: AdditionalInfo[];
  onAdd: (info: Omit<AdditionalInfo, 'id'>) => void;
  onUpdate: (id: string, data: Partial<AdditionalInfo>) => void;
  onRemove: (id: string) => void;
}

const emptyInfo: Omit<AdditionalInfo, 'id'> = {
  type: 'course',
  title: '',
  institution: '',
  date: '',
  description: '',
};

export function AdditionalInfoStep({ data, onAdd, onUpdate, onRemove }: AdditionalInfoStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<AdditionalInfo, 'id'>>(emptyInfo);

  const handleOpenModal = (info?: AdditionalInfo) => {
    if (info) {
      setEditingId(info.id);
      setFormData({
        type: info.type,
        title: info.title,
        institution: info.institution,
        date: info.date,
        description: info.description,
      });
    } else {
      setEditingId(null);
      setFormData(emptyInfo);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyInfo);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleChange = (field: keyof Omit<AdditionalInfo, 'id'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTypeLabel = (value: string) => {
    return ADDITIONAL_INFO_TYPE_OPTIONS.find((t) => t.value === value)?.label ?? value;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'certification': return '🏅';
      case 'award': return '🏆';
      case 'language': return '🌍';
      case 'other': return '📌';
      default: return '📌';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Informações Adicionais</h2>
        <p className={styles.description}>
          Adicione cursos, certificações, prêmios ou outras informações relevantes.
          <br />
          <span className={styles.optional}>Esta seção é opcional.</span>
        </p>
      </div>

      <div className={styles.content}>
        {data.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📋</span>
            <p className={styles.emptyText}>
              Nenhuma informação adicional.
            </p>
            <p className={styles.emptyHint}>
              Cursos online, certificações e premiações destacam seu currículo!
            </p>
            <Button onClick={() => handleOpenModal()}>
              Adicionar informação
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {data.map((info) => (
                <Card key={info.id} variant="outlined" padding="md">
                  <div className={styles.item}>
                    <div className={styles.itemIcon}>
                      {getTypeIcon(info.type)}
                    </div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemTitle}>{info.title}</h3>
                        <span className={styles.itemType}>{getTypeLabel(info.type)}</span>
                      </div>
                      {info.institution && (
                        <p className={styles.itemInstitution}>{info.institution}</p>
                      )}
                      {info.date && (
                        <p className={styles.itemDate}>{info.date}</p>
                      )}
                      {info.description && (
                        <p className={styles.itemDescription}>{info.description}</p>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(info)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(info.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" onClick={() => handleOpenModal()} fullWidth>
              + Adicionar outra informação
            </Button>
          </>
        )}

        <div className={styles.examples}>
          <h4 className={styles.examplesTitle}>💡 Exemplos de informações relevantes:</h4>
          <ul className={styles.examplesList}>
            <li>Cursos online (Coursera, Udemy, Alura...)</li>
            <li>Certificações técnicas</li>
            <li>Participação em competições ou olimpíadas</li>
            <li>Trabalhos voluntários</li>
            <li>Projetos acadêmicos relevantes</li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Informação' : 'Nova Informação'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.title.trim()}>
              {editingId ? 'Salvar' : 'Adicionar'}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Select
            label="Tipo"
            options={ADDITIONAL_INFO_TYPE_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            required
            fullWidth
          />

          <Input
            label="Título"
            placeholder="Ex: Curso de Excel Avançado"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
          />

          <Input
            label="Instituição / Emissor"
            placeholder="Ex: Coursera, SENAI..."
            value={formData.institution ?? ''}
            onChange={(e) => handleChange('institution', e.target.value)}
            fullWidth
          />

          <Input
            label="Data / Ano"
            placeholder="Ex: 2024, Janeiro/2024"
            value={formData.date ?? ''}
            onChange={(e) => handleChange('date', e.target.value)}
            fullWidth
          />

          <Input
            label="Descrição (opcional)"
            placeholder="Detalhes adicionais..."
            value={formData.description ?? ''}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
          />
        </div>
      </Modal>
    </div>
  );
}
