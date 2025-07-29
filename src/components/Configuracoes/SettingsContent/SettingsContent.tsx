//Libbs
import { motion } from 'framer-motion';
//Css
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
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      className="settings-content"
    >
      <p>{contentMap[tabIndex]}</p>
    </motion.div>
  );
}
