// Libs
import { useState } from 'react';
import { useRecoilState } from 'recoil';
// Utils
import { useApi } from '../utils/useApi';
// Types
import { Connection } from '../../types/connection';
// Atom
import { userState } from '../../state/atom';

export const useAddConnection = () => {

  const [user] = useRecoilState(userState);
  const [step, setStep] = useState<1 | 2>(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { post, put } = useApi();

  const handleStartSession = async (connection: Partial<Connection>) => {

    setIsLoading(true)

    if (!user) return;

    const payload = {
      user_id: user.id,
      nome: connection.nome,
      status: false,
      agente_id: connection.agente_id,
    };

    const qrcode = await post<string>('/connections', payload);

    setQrCode(qrcode);
    setIsLoading(false)
    setStep(2);

  };

  const handleEditConnection = async (connection: Partial<Connection>) => {
    await put<Connection>(`/connections/${connection.id}`, {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: connection.status,
    });
  };

  return {
    step,
    qrCode,
    handleStartSession,
    handleEditConnection,
    isLoading,
  };
};