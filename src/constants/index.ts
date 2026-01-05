import type { PlanConfig } from '@/types';

// ============================================
// PRIMEIROCV - CONSTANTES
// ============================================

// Configuração dos planos
export const PLANS: Record<string, PlanConfig> = {
  basic: {
    type: 'basic',
    name: 'Básico',
    price: 15,
    features: [
      '1 currículo base',
      '3 gerações de IA no total',
      'Pontuação e checklist',
      'Preview em tempo real',
      '1 download em PDF',
    ],
    limits: {
      aiGenerations: 3,
      resumes: 1,
      optimizedResumes: 0,
      coverLetters: 0,
      validDays: 30,
    },
  },
  intermediate: {
    type: 'intermediate',
    name: 'Intermediário',
    price: 25,
    features: [
      'Tudo do Básico',
      'Até 3 currículos otimizados por vaga',
      'Sugestão automática de habilidades',
      '1 carta de apresentação padrão',
      'Downloads ilimitados',
      'Histórico de currículos',
    ],
    limits: {
      aiGenerations: 10,
      resumes: 1,
      optimizedResumes: 3,
      coverLetters: 1,
      validDays: 30,
    },
    popular: true,
  },
  advanced: {
    type: 'advanced',
    name: 'Avançado',
    price: 35,
    features: [
      'Tudo do Intermediário',
      'Match % com a vaga',
      'Carta personalizada por vaga',
      'Feedback estilo recrutador',
      'Templates ATS adicionais',
      'Histórico completo de versões',
      'Acesso por 60 dias',
    ],
    limits: {
      aiGenerations: 30,
      resumes: 1,
      optimizedResumes: 10,
      coverLetters: 5,
      validDays: 60,
    },
  },
};

// Etapas do editor
export const EDITOR_STEPS = [
  { id: 1, name: 'Dados Pessoais', key: 'personalData' },
  { id: 2, name: 'Objetivo', key: 'objective' },
  { id: 3, name: 'Formação', key: 'education' },
  { id: 4, name: 'Experiências', key: 'experiences' },
  { id: 5, name: 'Habilidades', key: 'skills' },
  { id: 6, name: 'Informações Adicionais', key: 'additionalInfo' },
] as const;

// Opções de grau de formação
export const DEGREE_OPTIONS = [
  { value: 'ensino_medio', label: 'Ensino Médio' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'graduacao', label: 'Graduação' },
  { value: 'pos_graduacao', label: 'Pós-Graduação' },
  { value: 'outro', label: 'Outro' },
] as const;

// Opções de tipo de experiência
export const EXPERIENCE_TYPE_OPTIONS = [
  { value: 'job', label: 'Emprego' },
  { value: 'internship', label: 'Estágio' },
  { value: 'project', label: 'Projeto' },
  { value: 'volunteer', label: 'Voluntariado' },
] as const;

// Opções de nível de habilidade
export const SKILL_LEVEL_OPTIONS = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
] as const;

// Opções de categoria de habilidade
export const SKILL_CATEGORY_OPTIONS = [
  { value: 'technical', label: 'Técnica' },
  { value: 'soft', label: 'Comportamental' },
  { value: 'language', label: 'Idioma' },
  { value: 'tool', label: 'Ferramenta' },
] as const;

// Opções de informações adicionais
export const ADDITIONAL_INFO_TYPE_OPTIONS = [
  { value: 'course', label: 'Curso' },
  { value: 'certification', label: 'Certificação' },
  { value: 'award', label: 'Prêmio' },
  { value: 'language', label: 'Idioma' },
  { value: 'other', label: 'Outro' },
] as const;

// Estados brasileiros
export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const;

// Pesos para cálculo de pontuação
export const SCORE_WEIGHTS = {
  personalData: 15,
  objective: 20,
  education: 15,
  experience: 25,
  skills: 15,
  additionalInfo: 10,
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  PLAN_LIMIT_REACHED: 'Você atingiu o limite do seu plano.',
  AI_LIMIT_REACHED: 'Limite de gerações de IA atingido.',
} as const;

// Configurações de validação
export const VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  PHONE_PATTERN: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OBJECTIVE_MIN_LENGTH: 50,
  OBJECTIVE_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;
