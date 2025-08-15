// Libs
import Styles from './KnowledgeBaseInfo.module.css';
// Icon
import Icon from '../../Gerais/Icons/Icons';

export default function KnowledgeBaseInfo() {
  return (
    <div className={Styles.columnTitlesConhecimento}>
      <h4>Sua base de conhecimento é o coração da automação</h4>
      <p>
        Aqui reunimos tudo que a nossa IA sabe sobre o seu negócio. É a partir dessas
        informações que ela responde com precisão aos seus clientes. Mantenha-a atualizada
        para garantir que cada interação seja fiel à sua marca.
      </p>
      <div className={Styles.contentActions}>
        <button><Icon nome='downloadtext' /></button>
        <button><Icon nome='download' /></button>
      </div>
    </div>
  );
}