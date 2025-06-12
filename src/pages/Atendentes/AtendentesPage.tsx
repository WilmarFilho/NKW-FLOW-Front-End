import React from "react";
import AttendantRow from "../../components/Atendentes/AtendentesRow";
import Button from "../../components/Gerais/Button"
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
        <p>Veja e cadastre seus atendentes aqui.</p>
      </div>

      <div className="attendants-table">
        <div className="attendants-header-row">
          <span>Nome</span>
          <span>Email</span>
        </div>

        {attendants.map((attendant, idx) => (
          <AttendantRow key={idx} {...attendant} />
        ))}
      </div>

      <div className="button-wrapper">
        <Button label="Adicionar Atendente" />
      </div>
    </div>
  );
};

export default AtendentesPage;
