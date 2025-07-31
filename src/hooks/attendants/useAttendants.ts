// Libs
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { attendantsState, userState } from '../../state/atom';
// Types
import type { Attendant, AttendantInput } from '../../types/attendant';
// Utils
import { useApi } from '../utils/useApi';

export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const { get, post, del, put } = useApi<Attendant[]>();
  const { data: createdAttendantData, post: createAttendantApi } = useApi<Attendant[]>();
  const [user] = useRecoilState(userState)

  const fetchAttendants = async () => {
    const fetchedData = await get('/attendants');
    if (fetchedData) {
      setAttendants(fetchedData);
    }
  };

  // Efeito para carregar atendentes na montagem do componente
  useEffect(() => {
    fetchAttendants();
  }, [get, setAttendants]);

  // Efeito para atualizar a lista de atendentes após a criação
  useEffect(() => {
    if (createdAttendantData) {
      fetchAttendants();
    }
  }, [createdAttendantData, setAttendants]);

  const addAttendant = async (attendantData: AttendantInput) => {
    try {
      // ETAPA 1: Criar o registro de Usuário
      const userResponse = await post('/users', {
        nome: attendantData.nome,
        email: attendantData.email,
        senha_hash: attendantData.senha,
        tipo_de_usuario: 'atendente',
      });

      if (!userResponse || !userResponse[0]?.id) {
        throw new Error('A API de usuários não retornou um ID válido.');
      }

      const createdUserId = userResponse[0].id;

      // ETAPA 2: Criar o registro de Atendente
      // TODO: user_admin_id deve vir de um contexto de autenticação ou ser passado como parâmetro

      if(!user) return

      await createAttendantApi('/attendants', {
        user_id: createdUserId,
        user_admin_id: user.id,
        status: true,
        numero: attendantData.numero,
      });

    } catch (err) {
      console.error('Falha ao adicionar atendente:', err);
      throw err; // Re-lança o erro para ser tratado pelo componente
    }
  };

  const removeAttendant = async (id: string) => {
    try {
      await del(`/attendants/${id}`);
      setAttendants(current => current.filter(a => a.id !== id));
    } catch (err) {
      console.error('Falha ao deletar atendente:', err);
      throw err;
    }
  };

  const editAttendant = async (
    attendantId: string,
    userId: string | null,
    updatedData: {
      nome?: string;
      email?: string;
      senha?: string;
      status?: boolean;
    }
  ) => {
    try {
      // Atualiza o usuário
      await put(`/users/${userId}`, {
        nome: updatedData.nome,
        email: updatedData.email,
        senha_hash: updatedData.senha,
        status: updatedData.status,
      });

      // Atualiza o atendente apenas se houver mudança no status
      if (updatedData.status !== undefined) {
        await put(`/attendants/${attendantId}`, {
          status: updatedData.status,
        });
      }
      await fetchAttendants();
    } catch (err) {
      console.error('Falha ao editar atendente:', err);
      throw err;
    }
  };


  return {
    attendants,
    addAttendant,
    removeAttendant,
    editAttendant,
  };
};

