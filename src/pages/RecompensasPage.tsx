import { motion } from 'framer-motion';
import GlobalStyles from '../global.module.css';
import ConvitesCount from '../components/Recompensas/ConvitesCount/ConvitesCount';
import LinkBox from '../components/Recompensas/LinkBox/LinkBox';
import RewardsList from '../components/Recompensas/RewardsList/RewardsList';
import ProgressBar from '../components/Recompensas/ProgressBar/ProgressBar';
import { useRecompensaPage } from '../hooks/recompensas/useRecompensaPage';

export default function RecompensaPage() {

  const { rewards, totalIndicacoes, progresso, link, copiarLink } = useRecompensaPage();

  return (
    <div className={GlobalStyles.pageContainer}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageHeader}
      >
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Ganhe cashback convidando amigos</h2>
          <h3>
            Compartilhe seu link e desbloqueie recompensas incríveis conforme
            atinge novas metas.
          </h3>
        </div>
        <ConvitesCount confirmados={12} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageContent}
      >
        <LinkBox link={link} onCopy={copiarLink} />
        <RewardsList
          rewards={rewards}
          totalIndicacoes={totalIndicacoes}
        />
        <ProgressBar
          rewards={rewards}
          totalIndicacoes={totalIndicacoes}
          progresso={progresso}
        />
      </motion.div>
    </div>
  );
}