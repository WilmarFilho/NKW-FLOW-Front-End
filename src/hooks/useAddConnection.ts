import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { connectionsState } from '../state/atom';
import type { Connection } from '../types/connection';
import { apiConfig } from '../config/api';

interface ConnectionUpdatePayload {
  event: 'connection.update';
  connection: Connection;
  state: 'open' | 'connecting' | 'closed'; 
  wuid: string;
}

export const useAddConnection = (onClose: () => void) => {
  const setConnections = useSetRecoilState(connectionsState);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ nome: '', agent: '' });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [connectionName, setConnectionName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setConnectionName(formData.nome + 'SENHA');
  };

  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${apiConfig.node}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'b9fc3360-78d3-43fd-b819-fce3173d1fc8',
          nome: connectionName,
          status: false,
          agente_id: formData.agent,
        })

      });
      
      if (!res.ok) throw new Error('Falha ao criar a sessão.');
      
      const data = await res.json();
      setQrCode(data.qr_code);
      setStep(2);
    } catch (err) {
      setError('Não foi possível iniciar a conexão. Verifique o backend:  ' + err);
    }
  };

  useEffect(() => {
    if (step !== 2 || !connectionName) return;
    const eventSource = new EventSource(`${apiConfig.node}/connections/webhook/events/${connectionName}`);

    eventSource.onmessage = (event) => {

      // 1. Parse do JSON sem tipo por enquanto
      const parsedData = JSON.parse(event.data);

      // 2. Verifique se o evento é o que você espera
      if (
        parsedData &&
        parsedData.event === 'connection.update' &&
        parsedData.state === 'open'
      ) {
        console.log(parsedData)
        const eventData = parsedData as ConnectionUpdatePayload;
        const newConnection = eventData.connection;

        setConnections((prev) => [...prev, newConnection]);
        onClose();
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setError('Erro de comunicação com o servidor de eventos.');
      eventSource.close();
    };

    return () => eventSource.close();
  }, [step, connectionName, formData, setConnections, onClose]);

  return {
    step,
    qrCode,
    formData,
    error,
    handleInputChange,
    handleStartSession,
  };
};
