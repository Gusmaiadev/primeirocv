// ============================================
// PRIMEIROCV - CONFIGURAÇÃO DO AMBIENTE
// ============================================

// Validação das variáveis de ambiente
const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key] as string | undefined;
  
  if (required && !value) {
    // Em desenvolvimento, apenas avisa. Em produção, lança erro.
    if (import.meta.env.PROD) {
      throw new Error(`Variável de ambiente ${key} não definida`);
    }
    console.warn(`⚠️ Variável de ambiente ${key} não definida`);
    return '';
  }
  
  return value ?? '';
};

// Configuração do Firebase
export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', false),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', false),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', false),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', false),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', false),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', false),
};

// Configuração do ambiente
export const appConfig = {
  env: getEnvVar('VITE_APP_ENV', false) || 'development',
  url: getEnvVar('VITE_APP_URL', false) || 'http://localhost:3000',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

// Verifica se o Firebase está configurado
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Configuração de Email Link
export const actionCodeSettings = {
  url: `${appConfig.url}/auth/verify`,
  handleCodeInApp: true,
};
