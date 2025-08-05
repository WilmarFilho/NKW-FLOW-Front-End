// Libbs
import { useState } from 'react';
// Components
import TabsHeader from '../../components/Configuracoes/TabsHeader/TabsHeader';
import SettingsContent from '../../components/Configuracoes/SettingsContent/SettingsContent';
// Css
import PageStyles from '../PageStyles.module.css'

const tabs = ['Conta', 'Preferências'];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={PageStyles.container}>
      <TabsHeader tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <SettingsContent tabIndex={activeTab} />
    </div>
  );
}
