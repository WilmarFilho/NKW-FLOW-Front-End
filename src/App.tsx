import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//Layout
import Layout from './components/Layout/Layout';
//Paginas
import ConversasPage from './pages/Conversas/ConversasPage';
import AtendentesPage from './pages/Atendentes/AtendentesPage';
import AgentesPage from './pages/Agentes/AgentesPage';
import ConexoesPage from './pages/Conexao/ConexoesPage';
import ConfiguracoesPage from './pages/Configuracoes/ConfiguracoesPage';
import AjudaPage from './pages/Ajuda/AjudaPage';
//Estilo
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