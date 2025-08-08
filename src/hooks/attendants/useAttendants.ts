// Libs
import { useEffect, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { attendantsState, userState } from '../../state/atom';
// Types
import type { Attendant, AttendantInput } from '../../types/attendant';
import { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';
import { log } from 'console';


export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const { get, post, del, put } = useApi();
  const [user] = useRecoilState(userState)

  // Função para buscar e atualizar a lista de atendentes.
  const fetchAttendants = useCallback(async () => {
    // Especificamos o tipo de retorno esperado para o 'get'.
    const fetchedData = await get<Attendant[]>('/attendants');
    if (fetchedData) {
      setAttendants(fetchedData);
    }
    // O tratamento de erro já é feito dentro do useApi.
  }, [get, setAttendants]);

  // Efeito para carregar os atendentes na montagem inicial.
  useEffect(() => {
    fetchAttendants();
  }, [fetchAttendants]);

  const addAttendant = async (attendantData: AttendantInput) => {
    if (!user) {
      console.error('Usuário administrador não encontrado. Ação cancelada.');
      return; // Early return se não houver um usuário admin logado.
    }

    try {
      // ETAPA 1: Criar o registro de Usuário.
      // Tipamos a resposta esperada para a criação do usuário.
      const userResponse = await post<User[]>('/users', {
        nome: attendantData.nome,
        numero: attendantData.numero,
        email: attendantData.email,
        senha_hash: attendantData.senha,
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
      // O erro já é logado pelo useApi, mas podemos relançar ou tratar adicionalmente aqui.
      console.error('Falha ao adicionar atendente:', err);
      throw err;
    }
  };

  const removeAttendant = async (id: string) => {
    try {
      await del(`/attendants/${id}`);
      // Em vez de uma atualização otimista, buscamos a lista atualizada para garantir consistência.
      await fetchAttendants();
    } catch (err) {
      console.error('Falha ao deletar atendente:', err);
      throw err;
    }
  };

  const editAttendant = async (
    attendantId: string,
    userId: string | null, // userId não deve ser nulo para esta operação
    updatedData: Partial<AttendantInput & { status: boolean }> // Usando Partial para flexibilidade
  ) => {
    try {
      // Cria um objeto apenas com os dados do usuário a serem atualizados
      const userUpdatePayload: Record<string, unknown> = {};
      if (updatedData.nome) userUpdatePayload.nome = updatedData.nome;
      if (updatedData.email) userUpdatePayload.email = updatedData.email;
      if (updatedData.senha) userUpdatePayload.senha_hash = updatedData.senha;
      if (updatedData.numero) userUpdatePayload.numero = updatedData.numero;
      if (updatedData.status) userUpdatePayload.status = updatedData.status;


      // Atualiza o usuário apenas se houver dados para atualizar
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
    // 1. Validar se o 'user' associado ao atendente existe
    if (!attendant.user || !attendant.user.id) {
      throw new Error('Dados do usuário do atendente estão incompletos.');
    }
    try {
      // 2. Inverter o status atual do atendente
      const newStatus = !attendant.user.status;

      // 3. Chamar a API para atualizar o 'status' na tabela de 'users'
      //    usando o ID do usuário do atendente, e não o do admin logado.
      await put(`/users/${attendant.user.id}`, { status: newStatus });

      // 4. Após o sucesso, buscar a lista de atendentes novamente
      //    para garantir que a UI reflita o dado mais recente do banco.
      await fetchAttendants();

      console.log(attendants)

    } catch (err) {
      // O useApi já loga o erro, mas relançamos para que o componente
      // (AtendentesPage) possa capturá-lo e mostrar um alerta.
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







