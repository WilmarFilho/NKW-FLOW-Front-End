// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { attendantsState, userState } from '../../state/atom';
// Types
import type { Attendant, AttendantFormData } from '../../types/attendant';
import { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';
import { toast } from 'react-toastify';

export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const { post, del, put } = useApi();
  const [user] = useRecoilState(userState)

  // Função para buscar e atualizar a lista de atendentes.
  const fetchAttendants = useCallback(async (userParam?: User) => {
    const currentUser = userParam ?? user;
    if (!currentUser) return;

    const fetchedData = await post<Attendant[]>('/attendants/list', {
      user_admin_id: currentUser.id,
      tipo_de_usuario: currentUser.tipo_de_usuario 
    });

    if (fetchedData) {
      setAttendants(fetchedData);
    }
  }, [setAttendants, user]);

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
        toast.error('com API de Usuário');
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
    userId: string,
    updatedData: Partial<AttendantFormData>
  ) => {
    try {
      const userUpdatePayload: Partial<User> = {
        nome: updatedData.nome,
        email: updatedData.email,
        senha_hash: updatedData.senha_hash,
        numero: updatedData.numero,
        status: updatedData.status,
      };

      // Atualiza usuário
      await put(`/users/${userId}`, userUpdatePayload);
      await fetchAttendants();
      toast.success('Alteração salva com sucesso!');
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
      toast.success('Alteração salva com sucesso!');
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