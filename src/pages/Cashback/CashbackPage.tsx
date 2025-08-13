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
          <h2>Vejas seu cashback</h2>
          <h3>Informações sobre como ganhar cashback, link para compartilhar e quantidade de indicações validas</h3>
        </div>
        <Button label='Cashback' />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.cashbackWrapper}
      >

        <div className={PageStyles.progressBar}>

        </div>

        <div className={PageStyles.containerLink}>
          <h4>Copie seu link</h4>
          <p>Informações sobre como ganhar cashback, link para compartilhar e quantidade de indicações validas</p>
          <div className={PageStyles.boxLink}>
            
          </div>
        </div>

        <div className={PageStyles.containerRewards}>
          <div className={PageStyles.boxReward}>
            <h4>Recompensa 1</h4>
          </div>
          <div className={PageStyles.boxReward}>
            <h4>Recompensa 2</h4>
          </div>
          <div className={PageStyles.boxReward}>
            <h4>Recompensa 3</h4>
          </div>
          <div className={PageStyles.boxReward}>
            <h4>Recompensa 4</h4>
          </div>
        </div>

      </motion.div>

    </div>
  );
};