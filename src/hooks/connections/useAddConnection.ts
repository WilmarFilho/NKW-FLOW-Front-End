// Libs
import { useState } from 'react';
// Utils
import { useApi } from '../useApi';
import { useConnections } from './useConnections';
//Types
import { Connection } from '../../types/connection';

interface AddConnectionResponse {
  qr_code: string;
}

export const useAddConnection = (onClose: () => void, initialData: Partial<Connection> | null, editMode?: boolean) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    nome: initialData?.nome?.split('_')[0] || '',
    agent: initialData?.agente_id || '',
    id: initialData?.id || '',
    status: initialData?.status ?? true,
  });
  const [qrCode, setQrCode] = useState<string | null>(null);

  const { post, put } = useApi<AddConnectionResponse>();

  const { fetchConnections } = useConnections()

  // O ID mockado para Desenvolvimento
  const MOCK_USER_ID = '0523e7bd-314c-43c1-abaa-98b789c644e6';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'status') {
      setFormData((prev) => ({ ...prev, status: value === 'ativo' }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
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


  const handleEditConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await put(`/connections/${formData.id}`, {
        nome: formData.nome,
        agente_id: formData.agent,
        status: formData.status,
      });
      onClose();
      fetchConnections()
    } catch (err) {
      console.error('Erro ao editar conexão:', err);
    }
  };

  return {
    step,
    qrCode,
    formData,
    handleInputChange,
    handleStartSession,
    handleEditConnection,
    onClose,
    setFormData,
  };
};