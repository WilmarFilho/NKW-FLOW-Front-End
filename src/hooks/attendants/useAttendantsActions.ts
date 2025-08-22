// useAttendantsActions.ts
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../state/atom';
import { useAttendants } from './useAttendants';
import { useApi } from '../utils/useApi';
import type { Attendant, AttendantFormData } from '../../types/attendant';
import { User } from '../../types/user';

interface NewAttendantData {
    nome: string;
    numero: string;
    email: string;
    senha_hash: string;
    connection_id?: string;
}

export const useAttendantsActions = () => {
    const [user] = useRecoilState(userState);
    const { fetchAttendants } = useAttendants();
    const { post, del, put, patch } = useApi();

    const addAttendant = async (attendantData: Partial<NewAttendantData>) => {
        if (!user || user.tipo_de_usuario !== 'admin') return;

        const userResponse = await post<User[]>('/users', {
            nome: attendantData.nome,
            numero: attendantData.numero,
            email: attendantData.email,
            senha_hash: attendantData.senha_hash,
            tipo_de_usuario: 'atendente',
            status: true,
        });

        const createdUserId = userResponse?.[0]?.id;
        if (!createdUserId) return;

        await post('/attendants', {
            user_id: createdUserId,
            user_admin_id: user.id,
            connection_id: attendantData.connection_id || null
        });

        await fetchAttendants();
    };

    const removeAttendant = async (id: string) => {
        if (!user || user.tipo_de_usuario !== 'admin') return;
        await del(`/attendants/${id}`);
        await fetchAttendants();
    };

    const editAttendant = async (
        attendantId: string,
        userId: string,
        updatedData: Partial<AttendantFormData>
    ) => {
        if (!user || user.tipo_de_usuario !== 'admin') return;

        await put(`/users/${userId}`, {
            nome: updatedData.nome,
            email: updatedData.email,
            numero: updatedData.numero,
            status: updatedData.status,
        });

        if (updatedData.connection_id !== undefined) {
            await patch(`/attendants/${attendantId}`, {
                connection_id: updatedData.connection_id,
                user_admin_id: user.id
            });
        }

        await fetchAttendants();
    };

    const updateAttendantStatus = useCallback(async (attendant: Attendant) => {
        if (!user || user.tipo_de_usuario !== 'admin') return;
        await put(`/users/${attendant.user.id}`, { status: !attendant.user.status });
        await fetchAttendants();
    }, [put, fetchAttendants, user]);

    return { addAttendant, removeAttendant, editAttendant, updateAttendantStatus };
};