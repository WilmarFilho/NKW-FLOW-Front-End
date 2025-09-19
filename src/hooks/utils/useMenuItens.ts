import type { IconProps } from '../../components/Gerais/Icons/Icons';

export interface MenuItem {
  key: string;
  to: string;
  label: string;
  icon: IconProps['nome']; 
  roles: Array<'admin' | 'atendente'>;
  section: 'principal' | 'suporte';
}

export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    to: '/dashboard',
    label: 'Resumo',
    icon: 'resumopage',
    roles: ['admin'],
    section: 'principal',
  },
  {
    key: 'conversas',
    to: '/conversas',
    label: 'Conversas',
    icon: 'conversaspage',
    roles: ['admin', 'atendente'],
    section: 'principal',
  },
  {
    key: 'atendentes',
    to: '/atendentes',
    label: 'Atendentes',
    icon: 'atendentespage',
    roles: ['admin'],
    section: 'principal',
  },
  {
    key: 'agentes',
    to: '/agentes',
    label: 'Agentes',
    icon: 'agentespage',
    roles: ['admin'],
    section: 'principal',
  },
  {
    key: 'conexoes',
    to: '/conexoes',
    label: 'Conexões',
    icon: 'conexaopage',
    roles: ['admin'],
    section: 'principal',
  },
  {
    key: 'configuracoes',
    to: '/configuracoes',
    label: 'Configurações',
    icon: 'configpage',
    roles: ['admin', 'atendente'],
    section: 'suporte',
  },
  {
    key: 'cashback',
    to: '/cashback',
    label: 'Recompensas',
    icon: 'recompensapage',
    roles: ['admin'],
    section: 'suporte',
  },
  {
    key: 'ajuda',
    to: '/ajuda',
    label: 'Ajuda',
    icon: 'ajudapage',
    roles: ['admin', 'atendente'],
    section: 'suporte',
  },
];