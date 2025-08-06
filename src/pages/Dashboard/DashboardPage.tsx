// Libbs
import { motion } from 'framer-motion';
// Components
import Button from '../../components/Gerais/Buttons/Button';
// Css
import PageStyles from '../PageStyles.module.css'

export default function DashboardPage() {

  return (
    <div className={PageStyles.container}>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Vejas seu resumo</h2>
        </div>
        <Button label='Dashboard' />
      </motion.div>

    </div>
  );
};


