// Libs
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
// Recoil
import { userState } from '../../state/atom';
// Hooks
import { useApi } from '../utils/useApi';
import { useAttendants } from './useAttendants';
// Types
import type { Attendant, AttendantFormData } from '../../types/attendant';
import { User } from '../../types/user';

export const useAttendantsActions = () => {

    // Carrega Usuário
    const [user] = useRecoilState(userState)

    // Carrega o fetch de Atendentes
    const { fetchAttendants } = useAttendants();

    // Carrega Metodos do hook da api
    const { post, del, put } = useApi();

    const addAttendant = async (attendantData: Partial<User>) => {

        if (!user) return;

        // ETAPA 1: Criar o registro de Usuário.
        const userResponse = await post<User[]>('/users', {
            nome: attendantData.nome,
            numero: attendantData.numero,
            email: attendantData.email,
            senha_hash: attendantData.senha_hash,
            tipo_de_usuario: 'atendente',
            status: true,
        });

        const createdUserId = userResponse?.[0]?.id;

        // ETAPA 2: Criar o registro de Atendente.
        await post('/attendants', {
            user_id: createdUserId,
            user_admin_id: user.id
        });

        await fetchAttendants();

    };

    const removeAttendant = async (id: string) => {

        if (!user) return;

        const result = await del(`/attendants/${id}`);

        if (result) {
            await fetchAttendants();
        }

    };

    const editAttendant = async (
        attendantId: string,
        userId: string,
        updatedData: Partial<AttendantFormData>
    ) => {

        if (!user) return;

        const userUpdatePayload: Partial<User> = {
            nome: updatedData.nome,
            email: updatedData.email,
            senha_hash: updatedData.senha_hash,
            numero: updatedData.numero,
            status: updatedData.status,
        };

        const result = await put(`/users/${userId}`, userUpdatePayload);

        if (result) {
            await fetchAttendants();
        }

    };

    const updateAttendantStatus = useCallback(async (attendant: Attendant) => {

        if (!user) return;

        const result = await put(`/users/${attendant.user.id}`, { status: !attendant.user.status });

        if (result) {
            await fetchAttendants();
        }

    }, [put, fetchAttendants]);

    return {
        addAttendant,
        removeAttendant,
        editAttendant,
        updateAttendantStatus,
    };
};