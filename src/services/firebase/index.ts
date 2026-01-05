// Firebase Services - Central Export
export {
  initializeFirebase,
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseDb,
} from './app';

export {
  signInWithGoogle,
  sendEmailLink,
  completeEmailLinkSignIn,
  isEmailSignInLink,
  signOut,
  onAuthChange,
  getCurrentUser,
  getUserData,
  updateUserPlan,
} from './auth';

export {
  createResume,
  getResume,
  getBaseResume,
  getUserResumes,
  updateResume,
  deleteResume,
  countOptimizedResumes,
} from './resumes';
