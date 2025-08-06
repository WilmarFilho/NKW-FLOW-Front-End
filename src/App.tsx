import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Suspense, lazy } from 'react'; 

import Layout from './components/Layout/Layout';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Importar os componentes de página com React.lazy
const ConversasPage = lazy(() => import('./pages/Conversas/ConversasPage'));
const AtendentesPage = lazy(() => import('./pages/Atendentes/AtendentesPage'));
const AgentesPage = lazy(() => import('./pages/Agentes/AgentesPage'));
const ConexoesPage = lazy(() => import('./pages/Conexao/ConexoesPage'));
const ConfiguracoesPage = lazy(() => import('./pages/Configuracoes/ConfiguracoesPage'));
const AjudaPage = lazy(() => import('./pages/Ajuda/AjudaPage'));
const LoginPage = lazy(() => import('./pages/Login/Login'));
import DashboardPage from './pages/Dashboard/DashboardPage';
import CashbackPage from './pages/Cashback/CashbackPage';

import './main.css';

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Suspense fallback={<Layout />}>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
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
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="conversas" element={<ConversasPage />} />
                <Route path="atendentes" element={<AtendentesPage />} />
                <Route path="agentes" element={<AgentesPage />} />
                <Route path="conexoes" element={<ConexoesPage />} />
                <Route path="configuracoes" element={<ConfiguracoesPage />} />
                <Route path="cashback" element={<CashbackPage />} />
                <Route path="ajuda" element={<AjudaPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;