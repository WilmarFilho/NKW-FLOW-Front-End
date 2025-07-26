import { useState } from 'react';
import { apiConfig } from '../config/api';

export const useAddConnection = (onClose: () => void) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ nome: '', agent: '' });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [connectionName, setConnectionName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setConnectionName(formData.nome + '_' + '0523e7bd-314c-43c1-abaa-98b789c644e6');
  };

  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiConfig.node}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: '0523e7bd-314c-43c1-abaa-98b789c644e6',
          nome: connectionName,
          status: false,
          agente_id: formData.agent,
        })

      })
      const data = await res.json();
      setQrCode(data.qr_code);
      setStep(2);
    } catch (err) {
      setError('Não foi possível iniciar a conexão. Verifique o backend:  ' + err);
    }
  };

  return {
    step,
    qrCode,
    formData,
    error,
    handleInputChange,
    handleStartSession,
    onClose
  };
};
