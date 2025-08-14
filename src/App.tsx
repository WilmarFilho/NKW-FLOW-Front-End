// Libs
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Components
import Layout from './components/Layout/Layout';
// Routes
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
// Lazy imports das páginas
const ConversasPage = lazy(() => import('./pages/Conversas/ConversasPage'));
const AtendentesPage = lazy(() => import('./pages/Atendentes/AtendentesPage'));
const AgentesPage = lazy(() => import('./pages/Agentes/AgentesPage'));
const ConexoesPage = lazy(() => import('./pages/Conexao/ConexoesPage'));
const ConfiguracoesPage = lazy(() => import('./pages/Configuracoes/ConfiguracoesPage'));
const AjudaPage = lazy(() => import('./pages/Ajuda/AjudaPage'));
const LoginPage = lazy(() => import('./pages/Login/Login'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const CashbackPage = lazy(() => import('./pages/Cashback/CashbackPage'));

function App() {
  return (

    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        {/* Rota pública (login) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Suspense fallback={''}>
                <LoginPage />
              </Suspense>
            </PublicRoute>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/conexoes" replace />} />

          <Route
            path="dashboard"
            element={
             <Suspense fallback={''}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="conversas"
            element={
              <Suspense fallback={''}>
                <ConversasPage />
              </Suspense>
            }
          />
          <Route
            path="atendentes"
            element={
              <Suspense fallback={''}>
                <AtendentesPage />
              </Suspense>
            }
          />
          <Route
            path="agentes"
            element={
             <Suspense fallback={''}>
                <AgentesPage />
              </Suspense>
            }
          />
          <Route
            path="conexoes"
            element={
             <Suspense fallback={''}>
                <ConexoesPage />
              </Suspense>
            }
          />
          <Route
            path="configuracoes"
            element={
              <Suspense fallback={''}>
                <ConfiguracoesPage />
              </Suspense>
            }
          />
          <Route
            path="cashback"
            element={
              <Suspense fallback={''}>
                <CashbackPage />
              </Suspense>
            }
          />
          <Route
            path="ajuda"
            element={
              <Suspense fallback={''}>
                <AjudaPage />
              </Suspense>
            }
          />
        </Route>

        {/* Redirecionamento para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;