import { connectionsState, addConnectionModalState } from '../../state/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from "../../components/Gerais/Buttons/Button";
import AddConnectionModal from "../../components/Conexoes/AddConnectionModal";
import GenericTable from "../../components/Gerais/Tables/GenericTable";
import type { Connection } from "../../types/connection";
import "./conexoes.css";
import ConnectionStatusManager from '../../components/Conexoes/ConnectionStatusManager';

export default function ConexoesPage() {

  const connections = useRecoilValue(connectionsState);
  const setModalState = useSetRecoilState(addConnectionModalState);
  const { isOpen } = useRecoilValue(addConnectionModalState);

  const handleOpenModal = (): void => {
    setModalState({ isOpen: true });
  };

  return (
    <div className="connections-container">

      <ConnectionStatusManager /> 
      
      <div className="connections-header">
        <h2>Suas conexões</h2>
        <h3>Verifique as conexões atuais, adicione ou desative…</h3>
      </div>

      <GenericTable<Connection>
        columns={["Nome", "Número", "Agente", "Status"]}
        data={connections}
        renderRow={(conn, i) => (
          <div className="connection-row" key={i}>
            <div>{conn.name}</div>
            <div>{conn.number}</div>
            <div className="agent-select">{conn.agent}</div>
            <div
              className={`status-chip ${conn.status ? "active" : "inactive"}`}
            >
              {conn.status ? "Ativado" : "Desativado"}
            </div>
          </div>
        )}
      />

      <div className="button-container">
        <Button label="Adicionar Conexão" onClick={handleOpenModal} />
      </div>

      {isOpen && <AddConnectionModal />}

    </div>
  );
}
