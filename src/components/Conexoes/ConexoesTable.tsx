import ConnectionRow from './ConexoesRow';
import './conexoesTable.css';

export default function ConnectionTable() {
  const connections = [
    { name: 'Wilmar Filho', number: '64992434104', agent: 'AA', status: true },
    { name: 'Wilmar Filho', number: '64992434104', agent: 'VV', status: true },
  ];

  return (
    <div className="connection-table">
      <div className="connection-table-header">
        <span>Nome</span>
        <span>Número</span>
        <span>Agente</span>
        <span>Status</span>
      </div>
      {connections.map((conn, i) => (
        <ConnectionRow key={i} {...conn} />
      ))}
      <button className="add-connection-btn">Adicionar Conexão</button>
    </div>
  );
}
