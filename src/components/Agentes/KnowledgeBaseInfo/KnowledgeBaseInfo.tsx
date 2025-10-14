// Libs
import Styles from './KnowledgeBaseInfo.module.css';
// Icon
import Icon from '../../Gerais/Icons/Icons';

interface KnowledgeBaseInfoProps {
  status: 'Boa' | 'Média' | 'Ruim';
}

export default function KnowledgeBaseInfo({ status }: KnowledgeBaseInfoProps) {

  const progressoMap: Record<string, number> = {
    'Boa': 100,
    'Média': 60,
    'Ruim': 42
  };
  const progresso = progressoMap[status];

  return (
    <div className={Styles.columnTitlesConhecimento}>
      <h4>Sua base de conhecimento é o coração da automação</h4>

      <div className={Styles.wrapperBody}>
        <div className={Styles.progressBarAgent}>
          <div
            className={`${Styles.progressFill} ${Styles[status.toLowerCase()]}`}
            style={{ width: `${progresso}%` }}
          >
            <span className={Styles.progressPercent}>{progresso}% completa</span>
          </div>
        </div>

        <div className={Styles.contentActions}>
          <button><Icon nome='downloadtext' /></button>
        </div>
      </div>

      <p>
        Aqui reunimos tudo que a nossa IA sabe sobre o seu negócio. É a partir dessas
        informações que ela responde com precisão aos seus clientes. Mantenha-a atualizada
        para garantir que cada interação seja fiel à sua marca.
      </p>

    </div>
  );
}