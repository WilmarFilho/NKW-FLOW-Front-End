import { useState } from 'react';
import TabsHeader from '../../components/Configuracoes/TabsHeader/TabsHeader';
import SettingsContent from '../../components/Configuracoes/SettingsContent/SettingsContent';
import './configuracoes.css';

const tabs = ['Conta', 'Segurança', 'Notificações', 'Preferências'];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="settings-container">
      <TabsHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <SettingsContent tabIndex={activeTab} />
    </div>
  );
}
