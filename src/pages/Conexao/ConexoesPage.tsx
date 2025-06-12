import Button from "../../components/Gerais/Buttons/Button";
import GenericTable from "../../components/Gerais/Tables/GenericTable";
import "./conexoes.css";

const connections = [
  { name: "Wilmar Filho", number: "64992434104", agent: "Recepcionista", status: true },
  { name: "Wilmar Filho", number: "64992434104", agent: "Vendedor", status: true },
];

export default function ConexoesPage() {
  return (
    <div className="connections-container">
      <div className="connections-header">
        <h2>Vejo suas conexões</h2>
        <h3>Verifique as conexões atuais, adicione ou desative …</h3>
      </div>

      <GenericTable
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

      <Button label="Adicionar Conexão" />
    </div>
  );
}
