import './settingsContent.css';

type Props = {
  tabIndex: number;
};

export default function SettingsContent({ tabIndex }: Props) {
  const contentMap = [
    'Configurações referentes à aba ativa',
    'Alterar senha, autenticação de dois fatores...',
    'Preferências de notificações por email ou sistema...',
    'Personalize aparência, idioma e outros...',
  ];

  return (
    <div className="settings-content">
      <p>{contentMap[tabIndex]}</p>
    </div>
  );
}
