// Libs
import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
// Utils
import { useApi } from '../utils/useApi';
// Types
import { Connection } from '../../types/connection';
// Atom
import { connectionsState, userState } from '../../state/atom';
import { useConnections } from './useConnections';

export const useConnectionsActions = () => {

  const { fetchConnections } = useConnections();

  const [user] = useRecoilState(userState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [step, setStep] = useState<1 | 2>(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { post, put, del } = useApi();

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

  const removeConnection = useCallback(async (id: string) => {
    const result = await del(`/connections/${id}`);
    if (result !== null) {
      fetchConnections();
    }
  }, [del, setConnections]);

  const updateConnectionStatus = useCallback(async (connection: Connection) => {

    const newStatus = !connection.status;

    // Payload para a requisição, mantendo os outros dados
    const payload = {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: newStatus,
    };

    const updatedConnection = await put<Connection>(`/connections/${connection.id}`, payload);

    if (updatedConnection) {
      fetchConnections();
    }

  }, [put, setConnections]);

  return {
    step,
    qrCode,
    handleStartSession,
    handleEditConnection,
    isLoading,
    removeConnection,
    updateConnectionStatus,
  };
};