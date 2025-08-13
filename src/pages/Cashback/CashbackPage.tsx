// Libs
import { motion } from 'framer-motion';
import { useState } from 'react';
// Components
import Button from '../../components/Gerais/Buttons/Button';
// Css
import PageStyles from '../PageStyles.module.css';

export default function DashboardPage() {
  // Dados mockados
  const rewards = [
    { tier: 1, name: 'Recompensa 1', goal: 2 },
    { tier: 2, name: 'Recompensa 2', goal: 5 },
    { tier: 3, name: 'Recompensa 3', goal: 10 },
    { tier: 4, name: 'Recompensa 4', goal: 20 }
  ];

  const totalIndicacoes = 12; // Mock: quantidade de indicações atuais

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
        <Button label='Cashback' />
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
          <div className={PageStyles.boxLink}>
            <button onClick={copiarLink}>Copiar</button>
            <span>{link}</span>

          </div>
        </div>

        {/* Lista de recompensas */}
        <div className={PageStyles.containerRewards}>
          {rewards.map((reward) => (
            <div key={reward.tier} className={PageStyles.boxReward}>
              <h4>{reward.name}</h4>
              <p>Alcance {reward.goal} indicações</p>
              {totalIndicacoes >= reward.goal ? (
                <span className={PageStyles.rewardUnlocked}>✔ Desbloqueada</span>
              ) : (
                <span className={PageStyles.rewardLocked}>🔒 Bloqueada</span>
              )}
            </div>
          ))}
        </div>

        {/* Barra de progresso com checkpoints */}
        <div className={PageStyles.progressBar}>
          <div className={PageStyles.progressFill} style={{ width: `${progresso}%` }}></div>
          {rewards.map((reward) => (
            <div
              key={reward.tier}
              className={`${PageStyles.progressCheckpoint} ${totalIndicacoes >= reward.goal ? PageStyles.completed : ''}`}
              style={{ left: `${(reward.goal / rewards[rewards.length - 1].goal) * 100}%` }}
              title={`${reward.name} - ${reward.goal} indicações`}
            >
              {reward.tier}
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
