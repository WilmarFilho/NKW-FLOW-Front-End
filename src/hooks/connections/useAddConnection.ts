// Libs
import { useEffect, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Utils
import { useApi } from '../utils/useApi';
import { useConnections } from './useConnections';
// Types
import { Connection } from '../../types/connection';
// Atom
import { userState } from '../../state/atom';

interface AddConnectionResponse {
  qr_code: string;
}

export const useAddConnection = (onClose: () => void, initialData: Partial<Connection> | undefined | null) => {
  const [user] = useRecoilState(userState);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    nome: '',
    agent: '',
    id: '',
    status: true,
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { post, put } = useApi();
  const { fetchConnections } = useConnections();

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome?.split('_')[0] || '',
        agent: initialData.agente_id || '',
        id: initialData.id || '',
        status: initialData.status ?? true,
      });
    } else {
      setFormData({ nome: '', agent: '', id: '', status: true });
    }
  }, [initialData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'status') {
      setFormData((prev) => ({ ...prev, status: value === 'ativo' }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  }, []);

  const handleStartSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)

    if (!user) return;

    const payload = {
      user_id: user.id,
      nome: formData.nome,
      status: false,
      agente_id: formData.agent,
    };

    const data = await post<AddConnectionResponse>('/connections', payload);

    if (data) {
      setQrCode(data.qr_code);
      setStep(2);
    }
  };

  const handleEditConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await put(`/connections/${formData.id}`, {
      nome: formData.nome,
      agente_id: formData.agent,
      status: formData.status,
    });

    if (result !== null) {
      fetchConnections();
      onClose();
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
    isLoading,
    setFormData,
  };
};