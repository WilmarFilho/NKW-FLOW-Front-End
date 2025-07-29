// Libs
import { useState } from 'react';
// Utils
import { useApi } from '../useApi'; 

interface AddConnectionResponse {
  qr_code: string;
}

export const useAddConnection = (onClose: () => void) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ nome: '', agent: '' });
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const { post } = useApi<AddConnectionResponse>();
  
  // O ID mockado para Desenvolvimento
  const MOCK_USER_ID = '0523e7bd-314c-43c1-abaa-98b789c644e6';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const connectionName = `${formData.nome}_${MOCK_USER_ID}`;
    
    const payload = {
      user_id: MOCK_USER_ID,
      nome: connectionName,
      status: false,
      agente_id: formData.agent,
    };

    const data = await post('/connections', payload);

    if (data) {
      setQrCode(data.qr_code);
      setStep(2);
    }
  };

  return {
    step,
    qrCode,
    formData,
    handleInputChange,
    handleStartSession,
    onClose,
  };
};