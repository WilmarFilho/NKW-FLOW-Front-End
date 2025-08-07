// Libbs
import { motion } from 'framer-motion';
// Components
import Button from '../../components/Gerais/Buttons/Button';
// Css
import PageStyles from '../PageStyles.module.css'

export default function DashboardPage() {

  return (
    <div className={PageStyles.containerDashboard}>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Vejas seu resumos</h2>
          <h3>Resumos de produtividade para o cliente ter acompanhamento facil.</h3>
        </div>
        <Button label='Quero Ajuda' />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerRow}
      >
        <div className={PageStyles.containerColumnLarge}>
          <h2>Resumo de Chats</h2>
        </div>

        <div className={PageStyles.containerColumnSmall}>
          <h2>Resumo de Chats por IA</h2>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerRow}
      >
        <div className={PageStyles.containerColumnSmall}>
          <h2>Resumo de Atendentes</h2>
        </div>

        <div className={PageStyles.containerColumnSmall}>
          <h2>Resumos de Agentes</h2>
        </div>

        <div className={PageStyles.containerColumnSmall}>
          <h2>Resumo de Conexões</h2>
        </div>

      </motion.div>

    </div>
  );
};


