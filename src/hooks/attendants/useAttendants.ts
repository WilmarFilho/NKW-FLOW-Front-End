// Libs
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { attendantsState, userState } from '../../state/atom';
// Types
import type { Attendant } from '../../types/attendant';
import { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';

export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const { get, post, del, put } = useApi();
  const [user] = useRecoilState(userState)

  // Função para buscar e atualizar a lista de atendentes.
  const fetchAttendants = useCallback(async () => {
    const fetchedData = await get<Attendant[]>('/attendants');
    if (fetchedData) {
      setAttendants(fetchedData);
    }
  }, [get, setAttendants]);

  useEffect(() => {
    fetchAttendants();
  }, [fetchAttendants]);

  const addAttendant = async (attendantData: Partial<User>) => {
    if (!user) {
      console.error('Usuário administrador não encontrado. Ação cancelada.');
      return; 
    }

    try {
      // ETAPA 1: Criar o registro de Usuário.
      const userResponse = await post<User[]>('/users', {
        nome: attendantData.nome,
        numero: attendantData.numero,
        email: attendantData.email,
        senha_hash: attendantData.senha_hash,
        tipo_de_usuario: 'atendente',
        status: true,
      });

      // Validação robusta da resposta da API.
      const createdUserId = userResponse?.[0]?.id;
      if (!createdUserId) {
        throw new Error('A API de usuários não retornou um ID válido.');
      }

      // ETAPA 2: Criar o registro de Atendente.
      await post('/attendants', {
        user_id: createdUserId,
        user_admin_id: user.id
      });

      // ETAPA 3: Atualizar a lista de atendentes após o sucesso.
      await fetchAttendants();

    } catch (err) {
      console.error('Falha ao adicionar atendente:', err);
      throw err;
    }
  };

  const removeAttendant = async (id: string) => {
    try {
      await del(`/attendants/${id}`);
      await fetchAttendants();
    } catch (err) {
      console.error('Falha ao deletar atendente:', err);
      throw err;
    }
  };

  const editAttendant = async (
    attendantId: string,
    userId: string | null, 
    updatedData: Partial<User & { status: boolean }>
  ) => {
    try {
      // Cria um objeto apenas com os dados do usuário a serem atualizados
      const userUpdatePayload: Record<string, unknown> = {};
      if (updatedData.nome) userUpdatePayload.nome = updatedData.nome;
      if (updatedData.email) userUpdatePayload.email = updatedData.email;
      if (updatedData.senha_hash) userUpdatePayload.senha_hash = updatedData.senha_hash;
      if (updatedData.numero) userUpdatePayload.numero = updatedData.numero;
      if (updatedData.status) userUpdatePayload.status = updatedData.status;


      // Atualiza o usuário do atendente
      if (Object.keys(userUpdatePayload).length > 0) {
        await put(`/users/${userId}`, userUpdatePayload);
      }

      // Atualiza a lista para refletir as mudanças
      await fetchAttendants();
    } catch (err) {
      console.error('Falha ao editar atendente:', err);
      throw err;
    }
  };

  const updateAttendantStatus = useCallback(async (attendant: Attendant) => {

    if (!attendant.user || !attendant.user.id) {
      throw new Error('Dados do usuário do atendente estão incompletos.');
    }
    try {
      
      const newStatus = !attendant.user.status;

      await put(`/users/${attendant.user.id}`, { status: newStatus });

      await fetchAttendants();

    } catch (err) {
      console.error('Falha ao atualizar o status do atendente:', err);
      throw err;
    }
  }, [put, fetchAttendants]);

  return {
    attendants,
    addAttendant,
    removeAttendant,
    editAttendant,
    fetchAttendants,
    updateAttendantStatus,
  };
};







