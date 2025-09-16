// Libs
import { useCallback, useState } from 'react';
// Recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { connectionsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
import { useConnections } from './useConnections';
// Types
import { Connection } from '../../types/connection';

export const useConnectionsActions = () => {

  // Carrega metodos de conexões
  const { fetchConnections } = useConnections();
  const setConnections = useSetRecoilState(connectionsState);

  // Carrega o usuário
  const [user] = useRecoilState(userState);

  // Variaveis de controle de cadastro
  const [step, setStep] = useState<1 | 2>(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega Metodos do hook da api
  const { post, put, del } = useApi();

  const handleStartSession = async (connection: Partial<Connection>) => {

    if (!user) return;

    setIsLoading(true);
    try {
      const qrcode = await post<string>('/connections', {
        nome: connection.nome,
        agente_id: connection.agente_id,
      });

      if (qrcode) {
        setQrCode(qrcode);
        setStep(2);
      } else {
        setQrCode(null);
      }
    } catch (err) {
      console.error('Erro ao iniciar sessão de conexão', err);
      setQrCode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConnection = async (connection: Partial<Connection>) => {

    if (!user) return;

    const result = await put<Connection>(`/connections/${connection.id}`, {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: connection.status,
    });

    if (result) {
      fetchConnections();
    }

  };

  const removeConnection = useCallback(async (id: string) => {

    if (!user) return;

    const result = await del(`/connections/${id}`);

    if (result) {
      fetchConnections();
    }

  }, [del, setConnections]);

  const updateConnectionStatus = useCallback(async (connection: Connection) => {

    if (!user) return;

    const result = await put<Connection>(`/connections/${connection.id}`, {
      nome: connection.nome,
      agente_id: connection.agente_id,
      status: !connection.status,
    });

    if (result) {
      fetchConnections();
    }

  }, [put, setConnections]);

  return {
    setStep,
    step,
    qrCode,
    handleStartSession,
    handleEditConnection,
    isLoading,
    removeConnection,
    updateConnectionStatus,
  };
};