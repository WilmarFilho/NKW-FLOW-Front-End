import { useEffect, useState } from "react";
import "./button.css";

interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {

  const [qrCode, setQrCode] = useState(null);
  const [instanceName, setInstanceName] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('PENDING');
  const [messages, setMessages] = useState([]);

  const startSession = async () => {

    const res = await fetch('http://localhost:5678/webhook/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session: 'usuario_josao' })
    });

    const data = await res.json();
    console.log(data)
    setQrCode(data.qr_code);
    //setInstanceName(data.instanceId);
    setInstanceName('usuario_josao');
  };


  // Efeito para ouvir os eventos em tempo real
  useEffect(() => {
    if (!instanceName) return;

    // A URL deve corresponder ao seu gatilho SSE no n8n (Workflow 3)
    const eventSource = new EventSource(
      `http://192.168.208.1:5679/webhook/events/${instanceName}`
    );

    // Abre a conexão
    eventSource.onopen = () => {
      console.log('Conexão SSE estabelecida com o n8n!');
    };

    // Ouve por eventos do tipo "message" (o que definimos no nó SSE)
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.log('Evento recebido do n8n:', eventData);

      // Agora, você processa o evento
      switch (eventData.event) {
        case 'connection.update':
          if (eventData.state === 'open') {
            setConnectionStatus('CONNECTED');
            setQrCode(null); // Esconde o QR code
            return(<div>CONECTADO</div>)
          }
          break;
        case 'messages.upsert':
          // Adiciona a nova mensagem à lista
          
          break;
        default:
          break;
      }
    };

    // Lida com erros
    eventSource.onerror = (err) => {
      console.error('Erro na conexão SSE:', err);
      eventSource.close();
    };

    // Função de limpeza: fecha a conexão quando o componente é desmontado
    return () => {
      eventSource.close();
    };
  }, [instanceName]); // O efeito re-executa se o instanceName mudar

  // ... sua lógica de renderização para mostrar QR Code, status, mensagens, etc. ...


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



