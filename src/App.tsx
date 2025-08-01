import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Layout from './components/Layout/Layout';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

import ConversasPage from './pages/Conversas/ConversasPage';
import AtendentesPage from './pages/Atendentes/AtendentesPage';
import AgentesPage from './pages/Agentes/AgentesPage';
import ConexoesPage from './pages/Conexao/ConexoesPage';
import ConfiguracoesPage from './pages/Configuracoes/ConfiguracoesPage';
import AjudaPage from './pages/Ajuda/AjudaPage';
import LoginPage from './pages/Login/Login';

import './main.css';

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
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
              <Route path="conversas" element={<ConversasPage />} />
              <Route path="atendentes" element={<AtendentesPage />} />
              <Route path="agentes" element={<AgentesPage />} />
              <Route path="conexoes" element={<ConexoesPage />} />
              <Route path="configuracoes" element={<ConfiguracoesPage />} />
              <Route path="ajuda" element={<AjudaPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>

  );
}

export default App;
