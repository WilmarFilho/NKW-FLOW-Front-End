// Libs
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { userState, authTokenState } from '../../state/atom';
// Types
import type { User } from '../../types/user';
import type { Upload } from '../../types/upload';
// Utils
import { useApi } from '../utils/useApi';

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const [token] = useRecoilState(authTokenState);
  const { get, put } = useApi();
  const { post } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');

  // Carrega o usuário
  const fetchUser = async () => {
    if (!token || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedUser = await get<User>(`/users/${userId}`);
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

  // Atualiza o usuário
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!token || !userId) return false;

    try {
      await put<User>(`/users/${userId}`, updates);
      await fetchUser();
      return true;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      return false;
    }
  };

  // Atualiza foto do usuário
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!token) return null;

    const formData = new FormData();
    formData.append('arquivo', file);

    setLoading(true);
    setError(null);

    try {
      const responseURL = await post<Upload>(`/upload/user/${userId}`, formData);

      if(!responseURL) return null

      return responseURL.url;

    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      setError('Erro ao enviar imagem.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUser();
    }
  }, [token, userId]);

  return { user, updateUser, uploadProfileImage, loading, error };
}









