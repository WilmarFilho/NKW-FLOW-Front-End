// Libs
import { motion } from 'framer-motion';
import { useState } from 'react';
// Components
import Button from '../../components/Gerais/Buttons/Button';
// Css
import PageStyles from '../PageStyles.module.css';
// Assets 
import CopyIcon from './assets/copy.svg'
import MedalIcon from './assets/medal.svg'
import CheckIcon from './assets/TablerCircleCheck.svg'

export default function DashboardPage() {
  // Dados mockados
  const rewards = [
    { tier: 1, name: 'Novato', goal: 2, casbackPercentual: 5 },
    { tier: 2, name: 'Engajado', goal: 4, casbackPercentual: 15 },
    { tier: 3, name: 'Influenciador', goal: 10, casbackPercentual: 25 },
    { tier: 4, name: 'Lenda do FLOW', goal: 25, casbackPercentual: 40, rewardBonus: 'desconto em outros serviços' }
  ];

  const totalIndicacoes = 8; // Mock: quantidade de indicações atuais

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
    <div className={PageStyles.container}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Ganhe cashback convidando amigos</h2>
          <h3>Compartilhe seu link e desbloqueie recompensas incríveis conforme atinge novas metas.</h3>
        </div>

        <div className={PageStyles.containerCountConvites}>
          <h2>Suas indicações:</h2>
          <p>12 confirmadas</p>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.cashbackWrapper}
      >



        {/* Caixa do link */}
        <div className={PageStyles.containerLink}>
          <h4>Seu link de indicação</h4>
          <p>Envie este link para seus amigos. A cada indicação válida você avança na barra e desbloqueia recompensas.</p>
          <div onClick={copiarLink} className={PageStyles.boxLink}>
            <button >Copiar</button>
            <span>{link}</span>
            <CopyIcon />
          </div>
        </div>

        {/* Lista de recompensas */}
        <div className={PageStyles.containerRewards}>
          {rewards.map((reward) => (
            <div key={reward.tier} className={totalIndicacoes >= reward.goal ? PageStyles.boxRewardUnlock : PageStyles.boxRewardLocked}>
              <div className={PageStyles.rowContainerRewards}>
                <MedalIcon />
                <h2>{reward.goal} indicações</h2>
              </div>

              <div className={PageStyles.bodyContainerRewards}>

                <div className={PageStyles.rowBodyContainerRewards}>
                  <h4>{reward.name}</h4>
                  <span> -------------- Recompensas: -------------- </span>
                </div>

                <div className={PageStyles.containerLiRewards}>
                  <div className={PageStyles.rowLiRewards}>
                    <CheckIcon />
                    <p>{reward.casbackPercentual}% de desconto</p>
                  </div>
                  {reward.rewardBonus ?
                    <div className={PageStyles.rowLiRewards}>
                      <CheckIcon />
                      <p>{reward.rewardBonus}</p>
                    </div> : ''}
                </div>

              </div>

              <div className={PageStyles.footerContainerRewards}>
                {totalIndicacoes >= reward.goal ? 'Desbloqueado' : 'Bloqueado'}
              </div>

            </div>
          ))}
        </div>

        {/* Barra de progresso com checkpoints */}
        < div className={PageStyles.progressBar} >
          <div className={PageStyles.progressFillReward} style={{ width: `${progresso}%` }}></div>
          {
            rewards.map((reward) => (
              <div
                key={reward.tier}
                className={`${PageStyles.progressCheckpoint} ${totalIndicacoes >= reward.goal ? PageStyles.completed : ''}`}
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
