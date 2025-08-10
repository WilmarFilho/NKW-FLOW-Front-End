// Libs
import { useState } from 'react';
import { useRecoilState } from 'recoil';
// Atom
import { authTokenState } from '../../state/atom';
import { useUser } from './useUser'
// Types
import type { User } from '../../types/user';
import type { Upload } from '../../types/upload';
// Utils
import { useApi } from '../utils/useApi';

export function useUserAction() {
    const { fetchUser } = useUser();
    const [token] = useRecoilState(authTokenState);
    const { put } = useApi();
    const { post } = useApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = localStorage.getItem('userId');

    // Atualiza o usuário
    const updateUser = async (updates: Partial<User>): Promise<User | null> => {
        if (!token || !userId) return null;

        try {
            const updatedUser = await put<User>(`/users/${userId}`, updates);

            await fetchUser({ force: true });

            return updatedUser;
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            return null;
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

            if (!responseURL) return null

            return responseURL.url;

        } catch (err) {
            console.error('Erro ao fazer upload da imagem:', err);
            setError('Erro ao enviar imagem.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateUser, uploadProfileImage, loading, error };
}




