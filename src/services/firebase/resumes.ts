// ============================================
// PRIMEIROCV - SERVIÇO DE CURRÍCULOS
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './app';
import type { Resume, PersonalData, ProfessionalObjective, Education, Experience, Skill, AdditionalInfo, ScoreDetails } from '@/types';
import { generateId } from '@/utils';

// ============================================
// HELPERS
// ============================================

function timestampToDate(timestamp: Timestamp | Date): Date {
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

function resumeFromFirestore(id: string, data: Record<string, unknown>): Resume {
  return {
    id,
    userId: data.userId as string,
    createdAt: timestampToDate(data.createdAt as Timestamp),
    updatedAt: timestampToDate(data.updatedAt as Timestamp),
    isBase: data.isBase as boolean,
    targetJobUrl: data.targetJobUrl as string | undefined,
    targetJobTitle: data.targetJobTitle as string | undefined,
    personalData: data.personalData as PersonalData,
    objective: data.objective as ProfessionalObjective,
    education: data.education as Education[],
    experiences: data.experiences as Experience[],
    skills: data.skills as Skill[],
    additionalInfo: data.additionalInfo as AdditionalInfo[],
    score: data.score as number,
    scoreDetails: data.scoreDetails as ScoreDetails,
  };
}

// ============================================
// OPERAÇÕES CRUD
// ============================================

/**
 * Criar novo currículo
 */
export async function createResume(
  userId: string,
  data: Partial<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Resume> {
  const db = getFirebaseDb();
  const resumeId = generateId();
  const resumeRef = doc(db, 'resumes', resumeId);

  const defaultResume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: ReturnType<typeof serverTimestamp>; updatedAt: ReturnType<typeof serverTimestamp> } = {
    userId,
    isBase: data.isBase ?? true,
    targetJobUrl: data.targetJobUrl,
    targetJobTitle: data.targetJobTitle,
    personalData: data.personalData ?? {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
    },
    objective: data.objective ?? {
      text: '',
      generatedByAI: false,
    },
    education: data.education ?? [],
    experiences: data.experiences ?? [],
    skills: data.skills ?? [],
    additionalInfo: data.additionalInfo ?? [],
    score: data.score ?? 0,
    scoreDetails: data.scoreDetails ?? {
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
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(resumeRef, defaultResume);

  return {
    ...defaultResume,
    id: resumeId,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Resume;
}

/**
 * Obter currículo por ID
 */
export async function getResume(resumeId: string): Promise<Resume | null> {
  const db = getFirebaseDb();
  const resumeRef = doc(db, 'resumes', resumeId);
  const resumeDoc = await getDoc(resumeRef);

  if (!resumeDoc.exists()) {
    return null;
  }

  return resumeFromFirestore(resumeDoc.id, resumeDoc.data());
}

/**
 * Obter currículo base do usuário
 */
export async function getBaseResume(userId: string): Promise<Resume | null> {
  const db = getFirebaseDb();
  const resumesRef = collection(db, 'resumes');
  const q = query(
    resumesRef,
    where('userId', '==', userId),
    where('isBase', '==', true),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return resumeFromFirestore(doc.id, doc.data());
}

/**
 * Obter todos os currículos do usuário
 */
export async function getUserResumes(userId: string): Promise<Resume[]> {
  const db = getFirebaseDb();
  const resumesRef = collection(db, 'resumes');
  const q = query(
    resumesRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => resumeFromFirestore(doc.id, doc.data()));
}

/**
 * Atualizar currículo
 */
export async function updateResume(
  resumeId: string,
  data: Partial<Omit<Resume, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const db = getFirebaseDb();
  const resumeRef = doc(db, 'resumes', resumeId);

  await updateDoc(resumeRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletar currículo
 */
export async function deleteResume(resumeId: string): Promise<void> {
  const db = getFirebaseDb();
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
}

/**
 * Contar currículos otimizados do usuário
 */
export async function countOptimizedResumes(userId: string): Promise<number> {
  const db = getFirebaseDb();
  const resumesRef = collection(db, 'resumes');
  const q = query(
    resumesRef,
    where('userId', '==', userId),
    where('isBase', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}
