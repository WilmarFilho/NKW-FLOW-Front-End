import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState, authTokenState } from '../../state/atom';
import type { User } from '../../types/user';

export function useUser() {
    const [user, setUser] = useRecoilState(userState);
    const [token] = useRecoilState(authTokenState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = localStorage.getItem('userId');

    const fetchUser = async () => {
        if (!token || !userId) return;

        setLoading(false);
        setError(null);

        /*try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!res.ok) throw new Error('Erro ao buscar usuário');
    
          const data: User = await res.json();
          
          } catch (err) {
          setError('Erro ao carregar usuário');
          console.error(err);
        } finally {
          setLoading(false);
        }*/

        const mockUser: User = {
            id: 'user123',
            email: 'teste@teste.com',
            nome: 'Atendente A',
            tipo_de_usuario: 'atendente',
            status: true,
            foto_perfil: 'https://avatars.githubusercontent.com/u/103720085?v=4',
            modo_tela: 'Black',
            modo_side_bar: 'Full',
            mostra_nome_mensagens: true,
            modo_notificacao_atendente: false,
            notificacao_para_entrar_conversa: true,
            notificacao_necessidade_de_entrar_conversa: false,
            notificacao_novo_chat: true,
            criado_em: new Date().toISOString(),
        }; 

        setUser(mockUser);

    };

    const updateUser = async (updates: Partial<User>): Promise<boolean> => {
        if (!token || !userId) return false;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error('Erro ao atualizar usuário');

            const updated: User = await res.json();
            setUser(updated);
            return true;
        } catch (err) {
            console.error('Erro ao atualizar usuário', err);
            return false;
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    return { user, updateUser, loading, error };
}
