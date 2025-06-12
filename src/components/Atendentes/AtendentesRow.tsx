import React from "react";
import "./atendentesRow.css";

interface AttendantRowProps {
  name: string;
  email: string;
}

const AttendantRow: React.FC<AttendantRowProps> = ({ name, email }) => {
  return (
    <div className="attendant-row">
      <span>{name}</span>
      <span className="email">{email}</span>
    </div>
  );
};

export default AttendantRow;
