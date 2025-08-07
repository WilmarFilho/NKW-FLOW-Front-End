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
        
          <h2>Informações sobre como ganhar cashback, link para compartilhar e quantidade de indicações validas</h2>

          <h2>Gameficação de progresso nas recompensas</h2>

          <h2>X Convidados com assinatura efetuada ganha X% de desconto no plano ativo</h2>

          <h2>Mostrar o progresso / Mostrar link para convidar / Explicar como funciona</h2>
        
      </motion.div>

    </div>
  );
};


