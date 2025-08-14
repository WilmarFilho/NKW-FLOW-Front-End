// Libs
import { motion } from 'framer-motion';
import { useState } from 'react';
// Css
import GlobalStyles from '../../global.module.css';
import RecompensasStyles from './RecompensasPage.module.css'
// Icons 
import Icon from '../../components/Gerais/Icons/Icons';

export default function DashboardPage() {
  // Dados mockados
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

        <div className={RecompensasStyles.containerCountConvites}>
          <h2>Suas indicações:</h2>
          <p>12 confirmadas</p>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageContent}
      >

        {/* Caixa do link */}
        <div className={RecompensasStyles.containerLink}>
          <h4>Seu link de indicação</h4>
          <p>Envie este link para seus amigos. A cada indicação válida você avança na barra e desbloqueia recompensas.</p>
          <div onClick={copiarLink} className={RecompensasStyles.boxLink}>
            <button >Copiar</button>
            <span>{link}</span>
            <Icon nome='copy' />
          </div>
        </div>

        {/* Lista de recompensas */}
        <div className={RecompensasStyles.containerRewards}>
          {rewards.map((reward) => (
            <div key={reward.tier} className={`${RecompensasStyles.boxReward} ${totalIndicacoes >= reward.goal ? RecompensasStyles.boxRewardUnlock : RecompensasStyles.boxRewardLocked}`}>
              <div className={RecompensasStyles.rowContainerRewards}>
                <Icon nome='medal' />
                <h2>{reward.goal} indicações</h2>
              </div>

              <div className={RecompensasStyles.bodyContainerRewards}>

                <div className={RecompensasStyles.rowBodyContainerRewards}>
                  <h4>{reward.name}</h4>
                  <span> -------------- Recompensas: -------------- </span>
                </div>

                <div className={RecompensasStyles.containerLiRewards}>
                  <div className={RecompensasStyles.rowLiRewards}>
                    <Icon nome='check'/>
                    <p>{reward.casbackPercentual}% de desconto</p>
                  </div>
                  {reward.rewardBonus ?
                    <div className={RecompensasStyles.rowLiRewards}>
                      <Icon nome='check' />
                      <p>{reward.rewardBonus}</p>
                    </div> : ''}
                </div>

              </div>

              <div className={RecompensasStyles.footerContainerRewards}>
                {totalIndicacoes >= reward.goal ? 'Desbloqueado' : 'Bloqueado'}
              </div>

            </div>
          ))}
        </div>

        {/* Barra de progresso com checkpoints */}
        < div className={RecompensasStyles.progressBar} >
          <div className={RecompensasStyles.progressFillReward} style={{ width: `${progresso}%` }}></div>
          {
            rewards.map((reward) => (
              <div
                key={reward.tier}
                className={`${RecompensasStyles.progressCheckpoint} ${totalIndicacoes >= reward.goal ? RecompensasStyles.completed : ''}`}
                style={{ left: `${(reward.goal / rewards[rewards.length - 1].goal) * 100}%` }}
                title={`${reward.name} - ${reward.goal} indicações`}
              >
                {reward.tier}
              </div>
            ))
          }
        </div>

      </motion.div>
    </div>
  );
}