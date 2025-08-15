// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Recoil
import { attendantsState, userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
// Types
import type { Attendant } from '../../types/attendant';
import { User } from '../../types/user';

export const useAttendants = () => {

  // Carrega Usuário
  const [user] = useRecoilState(userState)

  // Carrega Atendentes
  const [attendants, setAttendants] = useRecoilState(attendantsState);

  // Carrega Metodos do hook da api
  const { post } = useApi();
  
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
    
  }, [post, setAttendants]);

  return { fetchAttendants };
};