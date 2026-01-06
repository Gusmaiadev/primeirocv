import { DEGREE_OPTIONS, SKILL_LEVEL_OPTIONS } from '@/constants';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
  AdditionalInfo,
} from '@/types';
import styles from './ResumePreview.module.css';

interface ResumePreviewProps {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  additionalInfo: AdditionalInfo[];
}

export function ResumePreview({
  personalData,
  objective,
  education,
  experiences,
  skills,
  additionalInfo,
}: ResumePreviewProps) {
  const formatDate = (date: string): string => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${months[parseInt(month) - 1]}/${year}`;
  };

  const getDegreeLabel = (value: string) => 
    DEGREE_OPTIONS.find(d => d.value === value)?.label ?? value;

  const getSkillLevelLabel = (value: string) =>
    SKILL_LEVEL_OPTIONS.find(l => l.value === value)?.label ?? value;

  const hasContent = (section: unknown[]): boolean => section.length > 0;

  // Agrupar habilidades por categoria
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels: Record<string, string> = {
    technical: 'Técnicas',
    soft: 'Comportamentais',
    language: 'Idiomas',
    tool: 'Ferramentas',
  };

  return (
    <div className={styles.resume} id="resume-preview">
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h1 className={styles.name}>
          {personalData.fullName || 'Seu Nome'}
        </h1>
        
        <div className={styles.contact}>
          {personalData.email && (
            <span className={styles.contactItem}>
              📧 {personalData.email}
            </span>
          )}
          {personalData.phone && (
            <span className={styles.contactItem}>
              📱 {personalData.phone}
            </span>
          )}
          {(personalData.city || personalData.state) && (
            <span className={styles.contactItem}>
              📍 {[personalData.city, personalData.state].filter(Boolean).join(' - ')}
            </span>
          )}
        </div>

        {(personalData.linkedin || personalData.portfolio) && (
          <div className={styles.links}>
            {personalData.linkedin && (
              <span className={styles.linkItem}>
                🔗 {personalData.linkedin}
              </span>
            )}
            {personalData.portfolio && (
              <span className={styles.linkItem}>
                🌐 {personalData.portfolio}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Objetivo Profissional */}
      {objective.text && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Objetivo Profissional</h2>
          <p className={styles.objectiveText}>{objective.text}</p>
        </section>
      )}

      {/* Formação Acadêmica */}
      {hasContent(education) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Formação Acadêmica</h2>
          {education.map((edu) => (
            <div key={edu.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{edu.course}</h3>
                <span className={styles.entryDate}>
                  {formatDate(edu.startDate)}
                  {' - '}
                  {edu.current ? 'Cursando' : formatDate(edu.endDate ?? '')}
                </span>
              </div>
              <p className={styles.entrySubtitle}>
                {edu.institution} • {getDegreeLabel(edu.degree)}
              </p>
              {edu.description && (
                <p className={styles.entryDescription}>{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experiência Profissional */}
      {hasContent(experiences) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experiência</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{exp.title}</h3>
                <span className={styles.entryDate}>
                  {formatDate(exp.startDate)}
                  {' - '}
                  {exp.current ? 'Atual' : formatDate(exp.endDate ?? '')}
                </span>
              </div>
              {exp.company && (
                <p className={styles.entrySubtitle}>{exp.company}</p>
              )}
              {exp.description && (
                <p className={styles.entryDescription}>{exp.description}</p>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={styles.highlights}>
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Habilidades */}
      {hasContent(skills) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Habilidades</h2>
          <div className={styles.skillsContainer}>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className={styles.skillCategory}>
                <h4 className={styles.skillCategoryTitle}>
                  {categoryLabels[category] || category}
                </h4>
                <div className={styles.skillsList}>
                  {categorySkills.map((skill) => (
                    <span key={skill.id} className={styles.skillItem}>
                      {skill.name}
                      {skill.level !== 'intermediate' && (
                        <span className={styles.skillLevel}>
                          ({getSkillLevelLabel(skill.level)})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Informações Adicionais */}
      {hasContent(additionalInfo) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações Adicionais</h2>
          {additionalInfo.map((info) => (
            <div key={info.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{info.title}</h3>
                {info.date && (
                  <span className={styles.entryDate}>{info.date}</span>
                )}
              </div>
              {info.institution && (
                <p className={styles.entrySubtitle}>{info.institution}</p>
              )}
              {info.description && (
                <p className={styles.entryDescription}>{info.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Mensagem se vazio */}
      {!objective.text && 
       !hasContent(education) && 
       !hasContent(experiences) && 
       !hasContent(skills) && (
        <div className={styles.empty}>
          <p>Seu currículo está vazio.</p>
          <p>Volte ao editor e preencha suas informações.</p>
        </div>
      )}
    </div>
  );
}
