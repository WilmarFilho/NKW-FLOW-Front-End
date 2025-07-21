import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { attendantsState } from '../state/atom';
import { apiConfig } from '../config/api';
import type { Attendant, AttendantInput } from '../types/attendant';

/**
 * Busca todos os atendentes na API.
 */
const fetchAttendantsFromAPI = async (): Promise<Attendant[]> => {
  const response = await fetch(`${apiConfig.node}/attendants`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao buscar os atendentes');
  }
  const data = await response.json();
  return data;
};

/**
 * Cria um novo atendente na API.
 */
/**
 * Cria um novo atendente realizando um processo de duas etapas:
 * 1. Cria um registro de usuário.
 * 2. Cria um registro de atendente vinculado ao novo usuário.
 * @param data - Os dados do novo atendente (nome, email, etc.).
 * @param adminId - O ID do administrador que está criando este atendente.
 */
const createAttendantInAPI = async (data: AttendantInput, adminId: string): Promise<Attendant> => {

  // --- ETAPA 1: Criar o registro de Usuário ---
  let createdUser;
  try {
    const userResponse = await fetch(`${apiConfig.node}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        senha_hash: data.senha, // Envie a senha se ela for definida no front-end
        tipo_de_usuario: 'atendente', // Hardcoded, pois estamos criando um atendente
      }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({ message: 'Erro ao criar o registro de usuário.' }));
      throw new Error(errorData.message);
    }

    createdUser = await userResponse.json();
    console.log(createdUser)

    // Verificação de segurança: garantir que o usuário foi criado com um ID
    if (!createdUser || !createdUser[0].id) {
      throw new Error('A API de usuários não retornou um ID válido.');
    }

  } catch (error) {
    console.error('Falha na Etapa 1 (Criação de Usuário):', error);
    // Re-lança o erro para que a chamada externa saiba que falhou
    throw error;
  }


  // --- ETAPA 2: Criar o registro de Atendente ---
  try {
    const attendantResponse = await fetch(`${apiConfig.node}/attendants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: createdUser[0].id,       // O ID retornado da primeira chamada
        user_admin_id: adminId,        // O ID do admin que está logado
        status: true,                  // Status inicial padrão como 'ativo'
      }),
    });

    if (!attendantResponse.ok) {
      const errorData = await attendantResponse.json().catch(() => ({ message: 'Erro ao criar o registro de atendente.' }));
      // Aqui, pode-se considerar deletar o usuário criado na etapa 1 para evitar órfãos.
      // Mas, por simplicidade, vamos apenas lançar o erro.
      throw new Error(errorData.message);
    }

    // Retorna os dados do atendente recém-criado, que vem da segunda chamada
    return await attendantResponse.json();

  } catch (error) {
    console.error('Falha na Etapa 2 (Criação de Atendente):', error);
    // Se a etapa 2 falhar, o ideal seria ter uma rotina para deletar o usuário da etapa 1.
    throw error;
  }
};
/**
 * Deleta um atendente da API pelo seu ID.
 */
const deleteAttendantFromAPI = async (id: string): Promise<void> => {
  const response = await fetch(`${apiConfig.node}/attendants/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao deletar o atendente');
  }
};


// =======================================================
// Hook Personalizado
// =======================================================

export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    setLoading(true);
    fetchAttendantsFromAPI()
      .then(data => {
        setAttendants(data);
        setError(null);
      })
      .catch(err => {
        console.error('Falha ao buscar atendentes:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAttendants]);

  // Função para adicionar um novo atendente
  const addAttendant = async (attendantData: AttendantInput) => {
    try {
      await createAttendantInAPI(attendantData, 'b9fc3360-78d3-43fd-b819-fce3173d1fc8');
      const updatedList = await fetchAttendantsFromAPI();
      setAttendants(updatedList);

      
    } catch (err) {
      console.error(err);
      // Lança o erro para que o componente possa tratá-lo (ex: mostrar um alerta)
      throw err;
    }
  };

  // Função para remover um atendente
  const removeAttendant = async (id: string) => {
    try {
      await deleteAttendantFromAPI(id);
      setAttendants(current => current.filter(a => a.id !== id));
    } catch (err) {
      console.error('Falha ao deletar atendente:', err);
      throw err;
    }
  };

  return {
    attendants,
    loading,
    error,
    addAttendant,
    removeAttendant,
  };
};