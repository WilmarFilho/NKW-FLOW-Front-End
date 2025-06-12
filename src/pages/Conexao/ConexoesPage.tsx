import ConnectionTable from '../../components/Conexoes/ConexoesTable';
import './conexoes.css';

export default function ConnectionsPage() {
  return (
    <div className="connections-container">
      
      <div className="connections-table-wrapper">
        <h2>Vejo suas conexões</h2>
        <p>Verifique as conexões atuais, adicione ou desative …</p>
        <ConnectionTable />
      </div>
    </div>
  );
}
