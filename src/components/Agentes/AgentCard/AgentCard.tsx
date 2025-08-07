//Css
import styles from './AgentCard.module.css';
//Assets
import VendedorIcon from './assets/tag.svg';
import RecepcionistaIcon from './assets/bell.svg';
import TecnicoIcon from './assets/wrench.svg';
//Libs
import React from 'react';


/*
<div className={styles.connectionsContainer}>
        {connections && connections?.length > 0 && (
          <ul className={styles.connectionList}>
            {connections.map((connName, index) => (
              <li className={styles.connectionItem} key={index}>Conexão: {connName}</li>
            ))}
          </ul>
        )}
      </div>
*/

interface AgentCardProps {
  tipo: string;
  description: string;
  connections?: string[];
}

const iconMap = {
  Vendedor: VendedorIcon,
  Recepcionista: RecepcionistaIcon,
  Tecnico: TecnicoIcon,
  Contador: VendedorIcon,
};

export default function AgentCard({ description, tipo, connections }: AgentCardProps) {

  const IconComponent = iconMap[tipo as keyof typeof iconMap] as React.ElementType;

  return (
    <div className={styles.card}>
      {IconComponent && <IconComponent className={styles.icon} aria-label={`Ícone de ${tipo}`} />}
      <h4 className={styles.title}>Agente - {tipo}</h4>
      <p className={styles.description}>{description}</p>
      <button className={styles.buttonCard}>Ver Detalhes</button>
    </div>
  );
}





