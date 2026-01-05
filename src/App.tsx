import { ErrorBoundary } from '@/components/common';
import { ToastProvider } from '@/components/ui';
import { AppRouter } from '@/router';
import '@/styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
