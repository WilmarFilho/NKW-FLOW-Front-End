import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { attendantsState } from '../state/atom';
import type { Attendant, AttendantInput } from '../types/attendant';

const API_BASE_URL = 'http://localhost:3000/api'; 

/**
 * Busca todos os atendentes na API.
 */
const fetchAttendantsFromAPI = async (): Promise<Attendant[]> => {
  const response = await fetch(`${API_BASE_URL}/atendentes`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao buscar os atendentes');
  }
  return response.json();
};

/**
 * Cria um novo atendente na API.
 */
const createAttendantInAPI = async (data: AttendantInput): Promise<Attendant> => {
  const response = await fetch(`${API_BASE_URL}/atendentes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor' }));
    throw new Error(errorData.message || 'Falha ao criar o atendente');
  }
  return response.json();
};

/**
 * Deleta um atendente da API pelo seu ID.
 */
const deleteAttendantFromAPI = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/atendentes/${id}`, {
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
        console.error("Falha ao buscar atendentes:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAttendants]);

  // Função para adicionar um novo atendente
  const addAttendant = async (attendantData: AttendantInput) => {
    try {
      const newAttendant = await createAttendantInAPI(attendantData);
      setAttendants(current => [...current, newAttendant]);
      return newAttendant;
    } catch (err: any) {
      console.error("Falha ao criar atendente:", err);
      // Lança o erro para que o componente possa tratá-lo (ex: mostrar um alerta)
      throw err;
    }
  };

  // Função para remover um atendente
  const removeAttendant = async (id: number) => {
    try {
      await deleteAttendantFromAPI(id);
      setAttendants(current => current.filter(a => a.id !== id));
    } catch (err: any) {
      console.error("Falha ao deletar atendente:", err);
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