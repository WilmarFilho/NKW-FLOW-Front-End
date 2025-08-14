import { motion } from 'framer-motion';
import { useState } from 'react';
// Css
import GlobalStyles from '../global.module.css';
// Components
import ConvitesCount from '../components/Recompensas/ConvitesCount/ConvitesCount';
import LinkBox from '../components/Recompensas/LinkBox/LinkBox';
import RewardsList from '../components/Recompensas/RewardsList/RewardsList';
import ProgressBar from '../components/Recompensas/ProgressBar/ProgressBar';

export default function DashboardPage() {
  const rewards = [
    { tier: 1, name: 'Novato', goal: 2, casbackPercentual: 5 },
    { tier: 2, name: 'Engajado', goal: 4, casbackPercentual: 15 },
    { tier: 3, name: 'Influenciador', goal: 10, casbackPercentual: 25 },
    { tier: 4, name: 'Lenda do FLOW', goal: 25, casbackPercentual: 40, rewardBonus: 'desconto em outros serviços' }
  ];

  const totalIndicacoes = 8;

  const progresso = Math.min(
    (totalIndicacoes / rewards[rewards.length - 1].goal) * 100,
    100
  );

  const [link] = useState('https://nkwflow.com/ref/seu-link');

  const copiarLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copiado!');
  };

  return (
    <div className={GlobalStyles.pageContainer}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageHeader}
      >
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Ganhe cashback convidando amigos</h2>
          <h3>Compartilhe seu link e desbloqueie recompensas incríveis conforme atinge novas metas.</h3>
        </div>
        <ConvitesCount confirmados={12} />
      </motion.div>

      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageContent}
      >
        <LinkBox link={link} onCopy={copiarLink} />
        <RewardsList rewards={rewards} totalIndicacoes={totalIndicacoes} />
        <ProgressBar rewards={rewards} totalIndicacoes={totalIndicacoes} progresso={progresso} />
      </motion.div>
    </div>
  );
}