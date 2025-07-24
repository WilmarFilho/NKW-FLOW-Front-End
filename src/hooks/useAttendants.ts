import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { attendantsState } from '../state/atom';
import { apiConfig } from '../config/api';
import type { Attendant, AttendantInput } from '../types/attendant';

const fetchAttendantsFromAPI = async (): Promise<Attendant[]> => {
  const response = await fetch(`${apiConfig.node}/attendants`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao buscar os atendentes');
  }
  const data = await response.json();
  return data;
};

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
        senha_hash: data.senha, 
        tipo_de_usuario: 'atendente',
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
    throw error;
  }


  // --- ETAPA 2: Criar o registro de Atendente ---
  try {
    const attendantResponse = await fetch(`${apiConfig.node}/attendants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: createdUser[0].id,       
        user_admin_id: '0523e7bd-314c-43c1-abaa-98b789c644e6',   
        status: true,                  
      }),
    });

    if (!attendantResponse.ok) {
      const errorData = await attendantResponse.json().catch(() => ({ message: 'Erro ao criar o registro de atendente.' }));
      throw new Error(errorData.message);
    }

    return await attendantResponse.json();

  } catch (error) {
    console.error('Falha na Etapa 2 (Criação de Atendente):', error);
    throw error;
  }
};

const deleteAttendantFromAPI = async (id: string): Promise<void> => {
  const response = await fetch(`${apiConfig.node}/attendants/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao deletar o atendente');
  }
};

export const useAttendants = () => {
  const [attendants, setAttendants] = useRecoilState(attendantsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const addAttendant = async (attendantData: AttendantInput) => {
    try {
      await createAttendantInAPI(attendantData, 'b9fc3360-78d3-43fd-b819-fce3173d1fc8');
      const updatedList = await fetchAttendantsFromAPI();
      setAttendants(updatedList);

      
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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