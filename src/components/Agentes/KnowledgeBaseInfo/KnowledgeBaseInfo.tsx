import Styles from './KnowledgeBaseInfo.module.css';
// Assets
import DownloadTextIcon from './assets/dowloadtext.svg';
import DownloadIcon from './assets/dowload.svg';

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
        <button><DownloadTextIcon /></button>
        <button><DownloadIcon /></button>
      </div>
    </div>
  );
}
