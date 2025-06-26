import { useState } from "react";
import "./button.css";

interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {

  const [qrCode, setQrCode] = useState(null);

  const startSession = async () => {

    const res = await fetch('http://localhost:5678/webhook/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session: 'usuario_josao' })
    });

    const data = await res.json();
    console.log(data.qr_code)
    setQrCode(data.qr_code);
  };

  return (
    <div className="wrapper-button">
      <button onClick={startSession} className="add-button"> {label} </button>
      {qrCode && (
        <img
          src={`${qrCode}`}
          alt="QR Code para conectar no WhatsApp"
          style={{ marginTop: 20, width: 250 }}
        />
      )}
    </div>
  );
}
