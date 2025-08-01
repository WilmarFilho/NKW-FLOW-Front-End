// Css
import './agentCard.css';
// Assets 
import VendedorIcon from './assets/tag.svg';
import RecepcionistaIcon from './assets/bell.svg';
import TecnicoIcon from './assets/wrench.svg';
import React from 'react';

interface AgentCardProps {
  tipo: string;
  description: string;
  connections?: string[];
}

const iconMap = {
  Vendedor: VendedorIcon,
  Recepcionista: RecepcionistaIcon,
  Tecnico: TecnicoIcon,
};

export default function AgentCard({ description, tipo, connections }: AgentCardProps) {

  const IconComponent = iconMap[tipo as keyof typeof iconMap] as React.ElementType;

  return (
    <div className="agent-card">

      {IconComponent && <IconComponent className="agent-icon" aria-label={`Ícone de ${tipo}`} />}

      <h4>Agente - {tipo}</h4>
      <p className="description">{description}</p>
      <div className="agent-card-bottom">
        {connections && connections.length > 0 && (
          <ul>
            {connections.map((connName, index) => (
              <li className='agent-bullet' key={index}>Conexão: {connName}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


