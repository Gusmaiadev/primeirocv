import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout, AuthLayout, EditorLayout } from '@/layouts';
import { LoadingOverlay, ProtectedRoute } from '@/components';

// Lazy loading das páginas
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const Editor = lazy(() => import('@/pages/Editor').then((m) => ({ default: m.Editor })));
const Preview = lazy(() => import('@/pages/Preview').then((m) => ({ default: m.Preview })));
const Plans = lazy(() => import('@/pages/Plans').then((m) => ({ default: m.Plans })));
const Auth = lazy(() => import('@/pages/Auth').then((m) => ({ default: m.Auth })));
const Verify = lazy(() => import('@/pages/Auth').then((m) => ({ default: m.Verify })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

// Wrapper para Suspense
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingOverlay message="Carregando..." />}>
      {children}
    </Suspense>
  );
}

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'plans',
        element: (
          <SuspenseWrapper>
            <Plans />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/editor',
    element: <EditorLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Editor />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'preview',
        element: (
          <SuspenseWrapper>
            <Preview />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Auth />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'verify',
        element: (
          <SuspenseWrapper>
            <Verify />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

// Exportar paths para uso tipado
export const ROUTES = {
  HOME: '/',
  EDITOR: '/editor',
  PREVIEW: '/editor/preview',
  PLANS: '/plans',
  AUTH: '/auth',
  AUTH_VERIFY: '/auth/verify',
  DASHBOARD: '/dashboard',
} as const;
