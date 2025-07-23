import { addConnectionModalState } from '../../state/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../components/Gerais/Buttons/Button';
import ConnectionForm from '../../components/Conexoes/ConnectionForm';
import GenericTable from '../../components/Gerais/Tables/GenericTable';
import type { Connection } from '../../types/connection';
import './conexoes.css';
import { useConnectionsComStatus } from '../../hooks/useConnectionsComStatus';

export default function ConexoesPage() {

  const { connections, loading, error } = useConnectionsComStatus();
  const setModalState = useSetRecoilState(addConnectionModalState);
  const { isOpen } = useRecoilValue(addConnectionModalState);

  if (loading) {
    return <div><h2>Carregando conexões...</h2></div>;
  }

  if (error) {
    return <div><h2>Erro ao carregar: {error}</h2></div>;
  }

  const handleOpenModal = (): void => {
    setModalState({ isOpen: true });
  };

  return (
    <div className="connections-container">



      <div className="connections-header">
        <div>
          <h2>Suas conexões</h2>
          <h3>Verifique as conexões atuais, adicione ou desative…</h3>
        </div>
        
          <Button label="Adicionar Conexão" onClick={handleOpenModal} />
        
      </div>

      <GenericTable<Connection>
        columns={['Nome', 'Número', 'Agente', 'Status']}
        data={connections}
        renderRow={(conn, i) => (
          <div className="connection-row" key={i}>
            <div>{conn.nome}</div>
            <div>{conn.numero}</div>
            <div className="agent-select">{conn.agente.tipo_de_agente}</div>
            <div
              className={`status-chip ${conn.status ? 'active' : 'inactive'}`}
            >
              {conn.status ? 'Ativado' : 'Desativado'}
            </div>
          </div>
        )}
      />



      {isOpen && <ConnectionForm />}

    </div>
  );
}
