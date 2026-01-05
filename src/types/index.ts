// ============================================
// PRIMEIROCV - TIPOS GLOBAIS
// ============================================

// Planos disponíveis
export type PlanType = 'basic' | 'intermediate' | 'advanced';

// Status do usuário
export type UserStatus = 'guest' | 'authenticated' | 'paid';

// Informações do plano do usuário
export interface UserPlan {
  type: PlanType;
  purchasedAt: Date;
  expiresAt: Date;
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  resumesCreated: number;
  resumesLimit: number;
  optimizedResumesCreated: number;
  optimizedResumesLimit: number;
  coverLettersCreated: number;
  coverLettersLimit: number;
}

// Dados pessoais do currículo
export interface PersonalData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedin?: string;
  portfolio?: string;
}

// Objetivo profissional
export interface ProfessionalObjective {
  text: string;
  generatedByAI: boolean;
  targetPosition?: string;
}

// Formação acadêmica
export interface Education {
  id: string;
  institution: string;
  course: string;
  degree: 'ensino_medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'outro';
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

// Experiência (emprego, projeto, voluntariado)
export interface Experience {
  id: string;
  type: 'job' | 'project' | 'volunteer' | 'internship';
  title: string;
  company?: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights?: string[];
}

// Habilidades
export interface Skill {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced';
  category: 'technical' | 'soft' | 'language' | 'tool';
}

// Informações adicionais
export interface AdditionalInfo {
  id: string;
  type: 'course' | 'certification' | 'award' | 'language' | 'other';
  title: string;
  institution?: string;
  date?: string;
  description?: string;
}

// Currículo completo
export interface Resume {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isBase: boolean;
  targetJobUrl?: string;
  targetJobTitle?: string;
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  additionalInfo: AdditionalInfo[];
  score: number;
  scoreDetails: ScoreDetails;
}

// Detalhes da pontuação
export interface ScoreDetails {
  total: number;
  breakdown: {
    personalData: number;
    objective: number;
    education: number;
    experience: number;
    skills: number;
    additionalInfo: number;
  };
  suggestions: string[];
}

// Usuário
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLoginAt: Date;
  plan: UserPlan | null;
  baseResumeId?: string;
}

// Resposta da API genérica
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Estado do editor
export interface EditorState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  hasUnsavedChanges: boolean;
}

// Configurações de preços dos planos
export interface PlanConfig {
  type: PlanType;
  name: string;
  price: number;
  features: string[];
  limits: {
    aiGenerations: number;
    resumes: number;
    optimizedResumes: number;
    coverLetters: number;
    validDays: number;
  };
  popular?: boolean;
}
