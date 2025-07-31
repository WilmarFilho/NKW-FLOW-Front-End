// Libbs
import { useState } from 'react';
// Components
import TabsHeader from '../../components/Configuracoes/TabsHeader/TabsHeader';
import SettingsContent from '../../components/Configuracoes/SettingsContent/SettingsContent';
// Css
import './configuracoes.css';

const tabs = ['Conta', 'Notificações', 'Preferências'];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="settings-container">
      <TabsHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <SettingsContent tabIndex={activeTab} />
    </div>
  );
}
