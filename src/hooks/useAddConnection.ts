import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { connectionsState } from '../state/atom';
import type { Connection } from '../types/connection';
import { apiConfig } from '../config/api';

export const useAddConnection = (onClose: () => void) => {
  const setConnections = useSetRecoilState(connectionsState);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: '', agent: 'Recepcionista' });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sessionName = `${formData.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`;
    setInstanceName(sessionName);
    try {
      const res = await fetch(`${apiConfig.node}/connections/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionName })
      });
      if (!res.ok) throw new Error("Falha ao criar a sessão.");
      const data = await res.json();
      setQrCode(data.qr_code);
      setStep(2);
    } catch (err) {
      setError("Não foi possível iniciar a conexão. Verifique o backend.");
    }
  };

  useEffect(() => {
    if (step !== 2 || !instanceName) return;
    const eventSource = new EventSource(`${apiConfig.node}/webhook/events/${instanceName}`);

    eventSource.onmessage = (event) => {
      const eventData: any = JSON.parse(event.data);
      if (eventData.event === 'connection.update' && eventData.state === 'open') {
        const newConnection: Connection = {
          id: 1,
          nome: formData.name,
          agente: formData.agent,
          numero: eventData.wuid.split('@')[0],
          status: true,
          instanceName,
        };
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
  }, [step, instanceName, formData, setConnections, onClose]);

  return {
    step,
    qrCode,
    formData,
    error,
    handleInputChange,
    handleStartSession,
  };
};
