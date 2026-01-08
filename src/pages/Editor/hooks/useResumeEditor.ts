// ============================================
// PRIMEIROCV - HOOK DO EDITOR DE CURRÍCULOS
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { useAuth } from '@/contexts';
import { createResume, updateResume, getBaseResume } from '@/services/firebase';
import { generateId } from '@/utils';
import { EDITOR_STEPS } from '@/constants';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
  AdditionalInfo,
  ScoreDetails,
} from '@/types';

// ============================================
// TIPOS
// ============================================

interface EditorState {
  currentStep: number;
  resumeId: string | null;
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  additionalInfo: AdditionalInfo[];
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
}

interface UseResumeEditorReturn extends EditorState {
  // Navegação
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
  
  // Dados pessoais
  updatePersonalData: (data: Partial<PersonalData>) => void;
  
  // Objetivo
  updateObjective: (data: Partial<ProfessionalObjective>) => void;
  
  // Formação
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Experiências
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Habilidades
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  // Informações adicionais
  addAdditionalInfo: (info: Omit<AdditionalInfo, 'id'>) => void;
  updateAdditionalInfo: (id: string, data: Partial<AdditionalInfo>) => void;
  removeAdditionalInfo: (id: string) => void;
  
  // Ações
  saveResume: () => Promise<void>;
  resetEditor: () => void;
  loadFromFirestore: () => Promise<void>;
}

// ============================================
// ESTADO INICIAL
// ============================================

const initialPersonalData: PersonalData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  linkedin: '',
  portfolio: '',
};

const initialObjective: ProfessionalObjective = {
  text: '',
  generatedByAI: false,
  targetPosition: '',
};

const initialState: EditorState = {
  currentStep: 1,
  resumeId: null,
  personalData: initialPersonalData,
  objective: initialObjective,
  education: [],
  experiences: [],
  skills: [],
  additionalInfo: [],
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
};

const STORAGE_KEY = 'primeirocv_draft';

// ============================================
// HOOK
// ============================================

export function useResumeEditor(): UseResumeEditorReturn {
  const { user, isAuthenticated } = useAuth();
  const [savedDraft, setSavedDraft, removeSavedDraft] = useLocalStorage<EditorState | null>(
    STORAGE_KEY,
    null
  );
  
  const [state, setState] = useState<EditorState>(() => {
    // Carregar do localStorage se existir
    if (savedDraft) {
      return { ...savedDraft, isSaving: false };
    }
    return initialState;
  });

  const totalSteps = EDITOR_STEPS.length;

  // ============================================
  // AUTO-SAVE NO LOCALSTORAGE
  // ============================================

  // Ref para armazenar o state atual sem causar re-render
  const stateRef = React.useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.isDirty) {
      const timeoutId = setTimeout(() => {
        setSavedDraft(stateRef.current);
        setState((prev) => ({
          ...prev,
          isDirty: false,
          lastSavedAt: new Date(),
        }));
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [state.isDirty, setSavedDraft]);

  // ============================================
  // CARREGAR DO FIRESTORE
  // ============================================

  const loadFromFirestore = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const baseResume = await getBaseResume(user.id);
      if (baseResume) {
        setState({
          currentStep: 1,
          resumeId: baseResume.id,
          personalData: baseResume.personalData,
          objective: baseResume.objective,
          education: baseResume.education,
          experiences: baseResume.experiences,
          skills: baseResume.skills,
          additionalInfo: baseResume.additionalInfo,
          isDirty: false,
          isSaving: false,
          lastSavedAt: baseResume.updatedAt,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar currículo:', error);
    }
  }, [isAuthenticated, user]);

  // Carregar do Firestore quando usuário logar
  useEffect(() => {
    if (isAuthenticated && user && !state.resumeId) {
      loadFromFirestore();
    }
  }, [isAuthenticated, user, state.resumeId, loadFromFirestore]);

  // ============================================
  // NAVEGAÇÃO
  // ============================================

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, totalSteps),
    }));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // ============================================
  // DADOS PESSOAIS
  // ============================================

  const updatePersonalData = useCallback((data: Partial<PersonalData>) => {
    setState((prev) => ({
      ...prev,
      personalData: { ...prev.personalData, ...data },
      isDirty: true,
    }));
  }, []);

  // ============================================
  // OBJETIVO
  // ============================================

  const updateObjective = useCallback((data: Partial<ProfessionalObjective>) => {
    setState((prev) => ({
      ...prev,
      objective: { ...prev.objective, ...data },
      isDirty: true,
    }));
  }, []);

  // ============================================
  // FORMAÇÃO
  // ============================================

  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    setState((prev) => ({
      ...prev,
      education: [...prev.education, { ...education, id: generateId() }],
      isDirty: true,
    }));
  }, []);

  const updateEducation = useCallback((id: string, data: Partial<Education>) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
      isDirty: true,
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
      isDirty: true,
    }));
  }, []);

  // ============================================
  // EXPERIÊNCIAS
  // ============================================

  const addExperience = useCallback((experience: Omit<Experience, 'id'>) => {
    setState((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...experience, id: generateId() }],
      isDirty: true,
    }));
  }, []);

  const updateExperience = useCallback((id: string, data: Partial<Experience>) => {
    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...data } : exp
      ),
      isDirty: true,
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
      isDirty: true,
    }));
  }, []);

  // ============================================
  // HABILIDADES
  // ============================================

  const addSkill = useCallback((skill: Omit<Skill, 'id'>) => {
    setState((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: generateId() }],
      isDirty: true,
    }));
  }, []);

  const updateSkill = useCallback((id: string, data: Partial<Skill>) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
      isDirty: true,
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
      isDirty: true,
    }));
  }, []);

  // ============================================
  // INFORMAÇÕES ADICIONAIS
  // ============================================

  const addAdditionalInfo = useCallback((info: Omit<AdditionalInfo, 'id'>) => {
    setState((prev) => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { ...info, id: generateId() }],
      isDirty: true,
    }));
  }, []);

  const updateAdditionalInfo = useCallback((id: string, data: Partial<AdditionalInfo>) => {
    setState((prev) => ({
      ...prev,
      additionalInfo: prev.additionalInfo.map((info) =>
        info.id === id ? { ...info, ...data } : info
      ),
      isDirty: true,
    }));
  }, []);

  const removeAdditionalInfo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter((info) => info.id !== id),
      isDirty: true,
    }));
  }, []);

  // ============================================
  // SALVAR NO FIRESTORE
  // ============================================

  const saveResume = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // Apenas salvar no localStorage
      setSavedDraft(state);
      return;
    }

    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      const scoreDetails: ScoreDetails = {
        total: 0,
        breakdown: {
          personalData: 0,
          objective: 0,
          education: 0,
          experience: 0,
          skills: 0,
          additionalInfo: 0,
        },
        suggestions: [],
      };

      if (state.resumeId) {
        // Atualizar existente
        await updateResume(state.resumeId, {
          personalData: state.personalData,
          objective: state.objective,
          education: state.education,
          experiences: state.experiences,
          skills: state.skills,
          additionalInfo: state.additionalInfo,
          score: 0,
          scoreDetails,
        });
      } else {
        // Criar novo
        const newResume = await createResume(user.id, {
          isBase: true,
          personalData: state.personalData,
          objective: state.objective,
          education: state.education,
          experiences: state.experiences,
          skills: state.skills,
          additionalInfo: state.additionalInfo,
          score: 0,
          scoreDetails,
        });

        setState((prev) => ({ ...prev, resumeId: newResume.id }));
      }

      // Limpar draft do localStorage após salvar no Firestore
      removeSavedDraft();

      setState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        lastSavedAt: new Date(),
      }));
    } catch (error) {
      console.error('Erro ao salvar currículo:', error);
      setState((prev) => ({ ...prev, isSaving: false }));
      throw error;
    }
  }, [isAuthenticated, user, state, setSavedDraft, removeSavedDraft]);

  // ============================================
  // RESETAR EDITOR
  // ============================================

  const resetEditor = useCallback(() => {
    setState(initialState);
    removeSavedDraft();
  }, [removeSavedDraft]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    ...state,
    totalSteps,
    
    // Navegação
    goToStep,
    nextStep,
    prevStep,
    canGoNext: state.currentStep < totalSteps,
    canGoPrev: state.currentStep > 1,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === totalSteps,
    
    // Dados pessoais
    updatePersonalData,
    
    // Objetivo
    updateObjective,
    
    // Formação
    addEducation,
    updateEducation,
    removeEducation,
    
    // Experiências
    addExperience,
    updateExperience,
    removeExperience,
    
    // Habilidades
    addSkill,
    updateSkill,
    removeSkill,
    
    // Informações adicionais
    addAdditionalInfo,
    updateAdditionalInfo,
    removeAdditionalInfo,
    
    // Ações
    saveResume,
    resetEditor,
    loadFromFirestore,
  };
}