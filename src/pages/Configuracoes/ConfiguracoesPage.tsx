// Libbs
import { useState } from 'react';
// Components
import TabsHeader from '../../components/Configuracoes/TabsHeader/TabsHeader';
import SettingsContent from '../../components/Configuracoes/SettingsContent/SettingsContent';
// Css
import GlobalStyles from '../../global.module.css'

const tabs = ['Conta', 'Preferências'];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={GlobalStyles.pageContainer}>
      <TabsHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <SettingsContent tabIndex={activeTab} />
    </div>
  );
}