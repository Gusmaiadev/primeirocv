import { Input, Select } from '@/components/ui';
import { BRAZILIAN_STATES } from '@/constants';
import { formatPhone } from '@/utils';
import type { PersonalData } from '@/types';
import styles from './PersonalDataStep.module.css';

interface PersonalDataStepProps {
  data: PersonalData;
  onChange: (data: Partial<PersonalData>) => void;
  errors?: Partial<Record<keyof PersonalData, string>>;
}

export function PersonalDataStep({ data, onChange, errors = {} }: PersonalDataStepProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange({ phone: formatted });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dados Pessoais</h2>
        <p className={styles.description}>
          Informações básicas para os recrutadores entrarem em contato com você.
        </p>
      </div>

      <div className={styles.form}>
        <Input
          label="Nome completo"
          placeholder="Ex: Maria Silva Santos"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          error={errors.fullName}
          required
          fullWidth
        />

        <div className={styles.row}>
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
            required
            fullWidth
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={data.phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            required
            fullWidth
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Cidade"
            placeholder="Ex: São Paulo"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            error={errors.city}
            required
            fullWidth
          />

          <Select
            label="Estado"
            placeholder="Selecione..."
            options={BRAZILIAN_STATES.map((s) => ({ value: s.value, label: s.label }))}
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            error={errors.state}
            required
            fullWidth
          />
        </div>

        <div className={styles.divider}>
          <span>Opcional</span>
        </div>

        <div className={styles.row}>
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/seu-perfil"
            value={data.linkedin ?? ''}
            onChange={(e) => onChange({ linkedin: e.target.value })}
            hint="Perfil profissional aumenta suas chances"
            fullWidth
          />

          <Input
            label="Portfólio / Site"
            placeholder="seu-site.com"
            value={data.portfolio ?? ''}
            onChange={(e) => onChange({ portfolio: e.target.value })}
            hint="Projetos pessoais, GitHub, Behance..."
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
