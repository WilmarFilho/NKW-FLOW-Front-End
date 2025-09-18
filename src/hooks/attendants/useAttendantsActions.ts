import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../state/atom';
import { useAttendants } from './useAttendants';
import { useApi } from '../utils/useApi';
import type { Attendant, AttendantFormData } from '../../types/attendant';
import type { User } from '../../types/user';

interface NewAttendantData {
    nome: string;
    numero: string;
    email: string;
    password: string;
    connection_id?: string | null;
}

interface CreateUserResponse {
    message: string;
    authUser: {
        user: User;
    };
    userData: User;
}

export const useAttendantsActions = () => {
    const [user] = useRecoilState(userState);
    const { fetchAttendants } = useAttendants();
    const { post, del, put, patch } = useApi();

    // ✅ Criar atendente (só admins podem)
    const addAttendant = async (attendantData: Partial<NewAttendantData>) => {
        if (user?.tipo_de_usuario !== 'admin') return;

        if (!attendantData.email || !attendantData.nome || !attendantData.numero || !attendantData.password) {
            throw new Error('Campos obrigatórios não fornecidos');
        }

        // 1️⃣ Criar usuário atendente
        const userResponse = await post<CreateUserResponse>('/createUser', {
            nome: attendantData.nome,
            numero: attendantData.numero,
            email: attendantData.email,
            password: attendantData.password,
            cidade: user.cidade,
            endereco: user.endereco,
            tipo_de_usuario: 'atendente'
        });

        if (!userResponse?.authUser) return;

        // 2️⃣ Vincular atendente ao admin logado
        await post('/attendants', {
            user_id: userResponse.authUser.user.id,
            connection_id: attendantData.connection_id
        });

        // 3️⃣ Atualizar lista de atendentes
        await fetchAttendants();
    };

    // ❌ Remover atendente
    const removeAttendant = async (id: string) => {
        if (user?.tipo_de_usuario !== 'admin') return;
        await del(`/attendants/${id}`);
        await fetchAttendants();
    };

    // ✏️ Editar atendente
    const editAttendant = async (
        attendantId: string,
        updatedData: Partial<AttendantFormData>
    ) => {
        if (user?.tipo_de_usuario !== 'admin') return;

        console.log(updatedData)

        await patch(`/attendants/${attendantId}`, {
            connection_id: updatedData.connection_id,
            nome: updatedData.nome,
            numero: updatedData.numero,
            email: updatedData.email,
            password: updatedData.password,
            status: updatedData.status
        });

        await fetchAttendants();
    };

    // 🔄 Ativar/desativar atendente
    const updateAttendantStatus = useCallback(async (attendant: Attendant) => {
        if (!user || user.tipo_de_usuario !== 'admin') return;
        await put(`/users/${attendant.user.id}`, { status: !attendant.user.status });
        await fetchAttendants();
    }, [put, fetchAttendants, user]);

    return { addAttendant, removeAttendant, editAttendant, updateAttendantStatus };
};