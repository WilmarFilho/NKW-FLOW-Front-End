// Libs
import { useRecoilState } from 'recoil';
// Atom
import { userState, authTokenState } from '../../state/atom';
// Types
import type { User } from '../../types/user';
// Utils
import { useApi } from '../utils/useApi';
import { useCallback } from 'react';

export function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const [token] = useRecoilState(authTokenState);
  const { get } = useApi();
  const userId = localStorage.getItem('userId');

  const fetchUser = useCallback(async (opts?: { force?: boolean }) => {
    if (!token || !userId) return null;
    if (!opts?.force && user) return user;

    try {
      const fetchedUser = await get<User>(`/users/${userId}`);
      if (fetchedUser) setUser(fetchedUser);
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  }, [token, userId, user, setUser, get]);

  return { fetchUser };
}
