import Styles from './KnowledgeBaseProgress.module.css';

interface KnowledgeBaseProgressProps {
  status: 'Boa' | 'Média' | 'Ruim';
}

export default function KnowledgeBaseProgress({ status }: KnowledgeBaseProgressProps) {
  const progressoMap: Record<string, number> = {
    'Boa': 100,
    'Média': 60,
    'Ruim': 42
  };
  const progresso = progressoMap[status];

  return (
    <div className={Styles.columnProgressConhecimento}>
      <div className={Styles.wrapperProgressConhecimento}>
        <h4>Sua base de conhecimento está: <strong>{status}</strong></h4>
        <div className={Styles.progressBarAgent}>
          <div
            className={`${Styles.progressFill} ${Styles[status.toLowerCase()]}`}
            style={{ width: `${progresso}%` }}
          >
            <span className={Styles.progressPercent}>{progresso}% completa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
