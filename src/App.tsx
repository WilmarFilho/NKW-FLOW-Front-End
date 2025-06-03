import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ConversasPage from './pages/ConversasPage';
import AtendentesPage from './pages/AtendentesPage';
import AgentesPage from './pages/AgentesPage';
import ConexoesPage from './pages/ConexoesPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import AjudaPage from './pages/AjudaPage';
import './main.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          {/* Rota padrão (index) para / será ConexoesPage */}
          <Route index element={<Navigate to="/conexoes" replace />} />
          <Route path="conversas" element={<ConversasPage />} />
          <Route path="atendentes" element={<AtendentesPage />} />
          <Route path="agentes" element={<AgentesPage />} />
          <Route path="conexoes" element={<ConexoesPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/conexoes" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;