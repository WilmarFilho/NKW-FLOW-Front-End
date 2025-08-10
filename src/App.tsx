// Libs
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Recoil
import { RecoilRoot } from 'recoil';
// Components
import Layout from './components/Layout/Layout';
// Routes
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
// CSS
import './main.css';

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
              <Suspense fallback={<div>Carregando...</div>}>
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
              <Suspense fallback={<div>Carregando...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="conversas"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <ConversasPage />
              </Suspense>
            }
          />
          <Route
            path="atendentes"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <AtendentesPage />
              </Suspense>
            }
          />
          <Route
            path="agentes"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <AgentesPage />
              </Suspense>
            }
          />
          <Route
            path="conexoes"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <ConexoesPage />
              </Suspense>
            }
          />
          <Route
            path="configuracoes"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <ConfiguracoesPage />
              </Suspense>
            }
          />
          <Route
            path="cashback"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
                <CashbackPage />
              </Suspense>
            }
          />
          <Route
            path="ajuda"
            element={
              <Suspense fallback={<div>Carregando...</div>}>
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