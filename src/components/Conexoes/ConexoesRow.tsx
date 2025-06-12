import './conexoesRow.css';

type Props = {
  name: string;
  number: string;
  agent: string;
  status: boolean;
};

export default function ConnectionRow({ name, number, agent, status }: Props) {
  return (
    <div className="connection-row">
      <span>{name}</span>
      <span>{number}</span>
      <span className="agent-select">{agent}</span>
      <span className={`status-chip ${status ? 'active' : 'inactive'}`}>
        {status ? 'Ativado' : 'Desativado'}
      </span>
    </div>
  );
}
