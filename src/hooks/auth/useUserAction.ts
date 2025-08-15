// Recoil
import { useRecoilState } from 'recoil';
import { userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
import { useUser } from './useUser'
// Types
import type { User } from '../../types/user';
import type { Upload } from '../../types/upload';

export function useUserAction() {

    // Carrega metodos do user
    const [user] = useRecoilState(userState);
    const { fetchUser } = useUser();

    // Carrega Metodos do hook da api
    const { post, put } = useApi();

    const updateUser = async (updates: Partial<User>): Promise<User | null> => {

        if (!user) return null;

        const updatedUser = await put<User>(`/users/${user.id}`, updates);

        await fetchUser({ force: true });

        return updatedUser;

    };

    const uploadProfileImage = async (file: File): Promise<string | null> => {

        if (!user) return null;

        const formData = new FormData();

        formData.append('arquivo', file);

        const result = await post<Upload>(`/upload/user/${user.id}`, formData);

        if (!result) return null

        return result.url;

    };

    return { updateUser, uploadProfileImage };
}