import React from "react";
import GenericTable from "../../components/Gerais/Tables/GenericTable";
import Button from "../../components/Gerais/Buttons/Button";
import "./atendentes.css";

const AtendentesPage: React.FC = () => {
  const attendants = [
    { name: "Wilmar Filho", email: "Email do atendente" },
    { name: "Wilmar Filho", email: "Email do atendente" },
  ];

  return (
    <div className="attendants-container">
      <div className="attendants-header">
        <h2>Veja seus atendentes humanos cadastrados</h2>
        <h3>Veja e cadastre seus atendentes aqui.</h3>
      </div>

      <GenericTable
        columns={["Nome", "Email"]}
        data={attendants}
        renderRow={(attendant, i) => (
          <div className="attendant-row" key={i}>
            <div>{attendant.name}</div>
            <div className="email">{attendant.email}</div>
          </div>
        )}
      />

      <Button label="Adicionar Atendente" />
    </div>
  );
};

export default AtendentesPage;
