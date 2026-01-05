import { ErrorBoundary } from '@/components/common';
import { ToastProvider } from '@/components/ui';
import { AuthProvider } from '@/contexts';
import { AppRouter } from '@/router';
import '@/styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
