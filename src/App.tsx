import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/Layout/LoadingScreen';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

const ConversasPage = lazy(() => import('./pages/ConversasPage'));
const AtendentesPage = lazy(() => import('./pages/AtendentesPage'));
const AgentesPage = lazy(() => import('./pages/AgentesPage'));
const ConexoesPage = lazy(() => import('./pages/ConexoesPage'));
const ConfiguracoesPage = lazy(() => import('./pages/ConfiguracoesPage'));
const AjudaPage = lazy(() => import('./pages/AjudaPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResumoPage = lazy(() => import('./pages/ResumoPage'));
const RecompensasPage = lazy(() => import('./pages/RecompensasPage'));

function App() {
 
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Suspense fallback={<LoadingScreen />}>
                <LoginPage />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/conexoes" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<LoadingScreen />}><ResumoPage /></Suspense>} />
          <Route path="conversas" element={<Suspense fallback={<LoadingScreen />}><ConversasPage /></Suspense>} />
          <Route path="atendentes" element={<Suspense fallback={<LoadingScreen />}><AtendentesPage /></Suspense>} />
          <Route path="agentes" element={<Suspense fallback={<LoadingScreen />}><AgentesPage /></Suspense>} />
          <Route path="conexoes" element={<Suspense fallback={<LoadingScreen />}><ConexoesPage /></Suspense>} />
          <Route path="configuracoes" element={<Suspense fallback={<LoadingScreen />}><ConfiguracoesPage /></Suspense>} />
          <Route path="cashback" element={<Suspense fallback={<LoadingScreen />}><RecompensasPage /></Suspense>} />
          <Route path="ajuda" element={<Suspense fallback={<LoadingScreen />}><AjudaPage /></Suspense>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;