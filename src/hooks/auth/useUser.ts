// Libs
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { userState, authTokenState } from '../../state/atom';
// Types
import type { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const [token] = useRecoilState(authTokenState);
  const { get, put } = useApi<User>(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');

  const fetchUser = async () => {
    if (!token || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedUser = await get(`/users/${userId}`);
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      setError('Erro ao carregar usuário');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!token || !userId) return false;

    try {
      await put(`/users/${userId}`, updates);
      await fetchUser();
      return true;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return { user, updateUser, loading, error };
}
