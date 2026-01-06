// ============================================
// PRIMEIROCV - CÁLCULO DE PONTUAÇÃO
// ============================================

import { SCORE_WEIGHTS } from '@/constants';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
  AdditionalInfo,
  ScoreDetails,
} from '@/types';

interface ResumeData {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  additionalInfo: AdditionalInfo[];
}

interface SectionScore {
  score: number;
  maxScore: number;
  percentage: number;
  suggestions: string[];
}

/**
 * Calcula pontuação de dados pessoais (máx 20 pontos)
 */
function scorePersonalData(data: PersonalData): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.personalData;

  // Nome completo (4 pontos)
  if (data.fullName && data.fullName.trim().length >= 5) {
    score += 4;
  } else {
    suggestions.push('Adicione seu nome completo');
  }

  // Email (4 pontos)
  if (data.email && data.email.includes('@')) {
    score += 4;
  } else {
    suggestions.push('Adicione um email válido');
  }

  // Telefone (4 pontos)
  if (data.phone && data.phone.replace(/\D/g, '').length >= 10) {
    score += 4;
  } else {
    suggestions.push('Adicione um telefone válido');
  }

  // Cidade (3 pontos)
  if (data.city && data.city.trim().length >= 2) {
    score += 3;
  } else {
    suggestions.push('Informe sua cidade');
  }

  // Estado (3 pontos)
  if (data.state && data.state.length === 2) {
    score += 3;
  } else {
    suggestions.push('Selecione seu estado');
  }

  // LinkedIn (bônus 2 pontos)
  if (data.linkedin && data.linkedin.length > 0) {
    score += 2;
  } else {
    suggestions.push('Adicione seu LinkedIn para destacar seu perfil');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação do objetivo profissional (máx 15 pontos)
 */
function scoreObjective(data: ProfessionalObjective): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.objective;

  const textLength = data.text?.trim().length || 0;

  if (textLength === 0) {
    suggestions.push('Escreva seu objetivo profissional');
  } else if (textLength < 50) {
    score += 5;
    suggestions.push('Objetivo muito curto. Tente pelo menos 50 caracteres');
  } else if (textLength < 100) {
    score += 10;
    suggestions.push('Objetivo bom, mas pode ser mais detalhado');
  } else if (textLength <= 300) {
    score += 15;
  } else {
    score += 12;
    suggestions.push('Objetivo muito longo. Tente resumir em até 300 caracteres');
  }

  // Bônus se mencionar cargo desejado
  if (data.targetPosition && data.targetPosition.length > 0) {
    score += 2;
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação de formação acadêmica (máx 20 pontos)
 */
function scoreEducation(data: Education[]): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.education;

  if (data.length === 0) {
    suggestions.push('Adicione sua formação acadêmica');
    return { score: 0, maxScore, percentage: 0, suggestions };
  }

  // Pontos base por ter formação (10 pontos)
  score += 10;

  // Pontos por formação completa (até 10 pontos)
  data.forEach((edu) => {
    let eduScore = 0;
    
    if (edu.institution && edu.institution.length > 0) eduScore += 1;
    if (edu.course && edu.course.length > 0) eduScore += 1;
    if (edu.startDate) eduScore += 1;
    if (edu.endDate || edu.current) eduScore += 1;
    
    score += Math.min(eduScore, 2.5); // Máx 2.5 por formação
  });

  if (data.length === 1) {
    suggestions.push('Considere adicionar cursos complementares');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação de experiências (máx 20 pontos)
 */
function scoreExperience(data: Experience[]): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.experience;

  if (data.length === 0) {
    // Para primeiro emprego, não penaliza tanto
    score += 5;
    suggestions.push('Adicione projetos pessoais, voluntariado ou experiências informais');
    return { score, maxScore, percentage: Math.round((score / maxScore) * 100), suggestions };
  }

  // Pontos base (8 pontos)
  score += 8;

  // Pontos por experiência (até 12 pontos)
  data.forEach((exp) => {
    let expScore = 0;
    
    if (exp.title && exp.title.length > 0) expScore += 1;
    if (exp.description && exp.description.length >= 30) expScore += 2;
    if (exp.startDate) expScore += 0.5;
    
    score += Math.min(expScore, 3); // Máx 3 por experiência
  });

  // Verificar se há descrições
  const withDescription = data.filter((exp) => exp.description && exp.description.length >= 30);
  if (withDescription.length < data.length) {
    suggestions.push('Adicione descrições detalhadas às suas experiências');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação de habilidades (máx 15 pontos)
 */
function scoreSkills(data: Skill[]): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.skills;

  if (data.length === 0) {
    suggestions.push('Adicione suas habilidades');
    return { score: 0, maxScore, percentage: 0, suggestions };
  }

  // Pontos base (5 pontos)
  score += 5;

  // Pontos por quantidade (até 6 pontos)
  score += Math.min(data.length * 1.5, 6);

  // Bônus por variedade de categorias (até 4 pontos)
  const categories = new Set(data.map((s) => s.category));
  score += Math.min(categories.size * 2, 4);

  if (data.length < 5) {
    suggestions.push('Adicione mais habilidades (recomendado: 5-10)');
  }

  if (categories.size < 2) {
    suggestions.push('Diversifique: adicione habilidades técnicas e comportamentais');
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação de informações adicionais (máx 10 pontos)
 */
function scoreAdditionalInfo(data: AdditionalInfo[]): SectionScore {
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = SCORE_WEIGHTS.additionalInfo;

  if (data.length === 0) {
    // Opcional, não penaliza
    score += 3;
    suggestions.push('Cursos e certificações podem destacar seu currículo');
    return { score, maxScore, percentage: Math.round((score / maxScore) * 100), suggestions };
  }

  // Pontos base (5 pontos)
  score += 5;

  // Pontos por item (até 5 pontos)
  score += Math.min(data.length * 2.5, 5);

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    suggestions,
  };
}

/**
 * Calcula pontuação total do currículo
 */
export function calculateResumeScore(data: ResumeData): ScoreDetails {
  const personalDataScore = scorePersonalData(data.personalData);
  const objectiveScore = scoreObjective(data.objective);
  const educationScore = scoreEducation(data.education);
  const experienceScore = scoreExperience(data.experiences);
  const skillsScore = scoreSkills(data.skills);
  const additionalInfoScore = scoreAdditionalInfo(data.additionalInfo);

  const total = 
    personalDataScore.score +
    objectiveScore.score +
    educationScore.score +
    experienceScore.score +
    skillsScore.score +
    additionalInfoScore.score;

  // Coletar todas as sugestões (máx 5)
  const allSuggestions = [
    ...personalDataScore.suggestions,
    ...objectiveScore.suggestions,
    ...educationScore.suggestions,
    ...experienceScore.suggestions,
    ...skillsScore.suggestions,
    ...additionalInfoScore.suggestions,
  ].slice(0, 5);

  return {
    total: Math.round(total),
    breakdown: {
      personalData: personalDataScore.score,
      objective: objectiveScore.score,
      education: educationScore.score,
      experience: experienceScore.score,
      skills: skillsScore.score,
      additionalInfo: additionalInfoScore.score,
    },
    suggestions: allSuggestions,
  };
}

/**
 * Retorna classificação do score
 */
export function getScoreClassification(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      label: 'Excelente',
      color: 'success',
      description: 'Seu currículo está muito bem preparado!',
    };
  }
  if (score >= 60) {
    return {
      label: 'Bom',
      color: 'primary',
      description: 'Bom currículo! Algumas melhorias podem destacá-lo ainda mais.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Regular',
      color: 'warning',
      description: 'Currículo básico. Siga as sugestões para melhorar.',
    };
  }
  return {
    label: 'Precisa melhorar',
    color: 'error',
    description: 'Complete mais seções para ter um currículo competitivo.',
  };
}
