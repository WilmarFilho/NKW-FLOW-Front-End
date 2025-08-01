// Libs
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
// Hooks
import { useUser } from '../../../hooks/auth/useUser';
// Css
import './settingsContent.css';
// Components
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import OptionSelector from '../OptionSelector/OptionSelector';
import { User } from '../../../types/user';
import { toast } from 'react-toastify';

type Props = {
  tabIndex: number;
};

export default function SettingsContent({ tabIndex }: Props) {
  const { user, updateUser, uploadProfileImage, loading } = useUser();

  const [mostrarNome, setMostrarNome] = useState(false);
  const [notifAtendente, setNotifAtendente] = useState(false);
  const [notifEntrarConversa, setNotifEntrarConversa] = useState(false);
  const [notifNovoChat, setNotifNovoChat] = useState(false);
  const [modoTela, setModoTela] = useState<'Black' | 'White'>('Black');
  const [modoSidebar, setModoSidebar] = useState<'Full' | 'Minimal'>('Full');

  useEffect(() => {
    if (user) {
      setMostrarNome(user.mostra_nome_mensagens);
      setNotifAtendente(user.modo_notificacao_atendente);
      setNotifEntrarConversa(user.notificacao_para_entrar_conversa);
      setNotifNovoChat(user.notificacao_novo_chat);
      setModoTela(user.modo_tela);
      setModoSidebar(user.modo_side_bar);
    }
  }, [user]);

  const handleAutoUpdate = async (updatedFields: Partial<User>) => {
    if (!user) return;
    const success = await updateUser(updatedFields);
    if (success) {
      toast.success('Alteração salva!');
    } else {
      toast.error('Erro ao salvar. Tente novamente.');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadProfileImage(file);

    if (imageUrl) {
      const success = await updateUser({ foto_perfil: imageUrl });
      if (success) {
        toast.success('Alteração salva!');
      } else {
        toast.error('Erro ao salvar. Tente novamente.');
      }
    } else {
      alert('Falha no upload da imagem.');
    }
  };

  const renderSwitch = (
    label: string,
    description: string,
    value: boolean,
    onChange: () => void
  ) => (
    <div className="switch-wrapper">
      <div className='box-text'>
        <span className="switch-label">{label}</span>
        <p className="switch-description">{description}</p>
      </div>
      <ToggleSwitch isOn={value} onToggle={onChange} />
    </div>
  );

  const renderSelect = (
    label: string,
    description: string,
    value: string,
    onChange: (newVal: string) => void,
    options: string[]
  ) => (
    <div className="switch-wrapper">
      <div className='box-text'>
        <span className="switch-label">{label}</span>
        <p className="switch-description">{description}</p>
      </div>
      <OptionSelector
        options={options}
        selected={value}
        onChange={onChange}
      />
    </div>
  );

  const renderContent = () => {
    if (!user) return <p>Carregando configurações...</p>;

    switch (tabIndex) {
      case 0:
        return (
          <>
            <div className="main-header-accont-wrapper">
              <div className="image-wrapper">
                <img
                  src={user.foto_perfil || '/default-avatar.png'}
                  alt="Foto de Perfil"
                  className="profile-image"
                  onClick={() => !loading && document.getElementById('fileInput')?.click()}
                  style={{ cursor: loading ? 'wait' : 'pointer' }}
                />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  disabled={loading}
                />

              </div>
              <div className='name-wrapper'>
                <h1>Nome de usuário</h1>
                <h2>{user.nome}</h2>
              </div>
              <div className='name-wrapper'>
                <h1>Cargo do usuário</h1>
                <h2>Administrador</h2>
              </div>
            </div>
            <div className='wrapper-box-configs'>
              <div className="header-accont-wrapper">
                <div className='name-wrapper'>
                  <h1>Endereço</h1>
                  <h2>Rua 9 Qd 9 Lt 2</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>Número</h1>
                  <h2>64992434104</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>E-mail</h1>
                  <h2>{user.email}</h2>
                </div>
              </div>
              <div className="header-accont-wrapper">
                <div className='name-wrapper'>
                  <h1>Endereço</h1>
                  <h2>Rua 9 Qd 9 Lt 2</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>Número</h1>
                  <h2>64992434104</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>E-mail</h1>
                  <h2>{user.email}</h2>
                </div>
              </div>
              <div className="header-accont-wrapper">
                <div className='name-wrapper'>
                  <h1>Endereço</h1>
                  <h2>Rua 9 Qd 9 Lt 2</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>Número</h1>
                  <h2>64992434104</h2>
                </div>
                <div className='name-wrapper'>
                  <h1>E-mail</h1>
                  <h2>{user.email}</h2>
                </div>
              </div>
              <button className='save-btn'>Editar Informações</button>
            </div>

          </>
        );

      case 1:
        return (
          <>
            {renderSwitch(
              'Notificação para atendente',
              'Envia um alerta ao atendente quando é necessário entrar em uma conversa.',
              notifAtendente,
              () => {
                const newVal = !notifAtendente;
                setNotifAtendente(newVal);
                handleAutoUpdate({ modo_notificacao_atendente: newVal });
              }
            )}
            {renderSwitch(
              'Notificação ao entrar na conversa',
              'Informa você quando entrar em uma conversa ativa.',
              notifEntrarConversa,
              () => {
                const newVal = !notifEntrarConversa;
                setNotifEntrarConversa(newVal);
                handleAutoUpdate({ notificacao_para_entrar_conversa: newVal });
              }
            )}
            {renderSwitch(
              'Notificação de novo chat',
              'Você será notificado sempre que um novo chat for iniciado.',
              notifNovoChat,
              () => {
                const newVal = !notifNovoChat;
                setNotifNovoChat(newVal);
                handleAutoUpdate({ notificacao_novo_chat: newVal });
              }
            )}
            {renderSelect(
              'Modo de Tela',
              'Altere entre modo escuro (Black) e claro (White).',
              modoTela,
              (val) => {
                setModoTela(val as 'Black' | 'White');
                handleAutoUpdate({ modo_tela: val as 'Black' | 'White' });
              },
              ['Black', 'White']
            )}
            {renderSelect(
              'Modo de Sidebar',
              'Sidebar completa com nomes e ícones ou minimalista com ícones apenas.',
              modoSidebar,
              (val) => {
                setModoSidebar(val as 'Full' | 'Minimal');
                handleAutoUpdate({ modo_side_bar: val as 'Full' | 'Minimal' });
              },
              ['Full', 'Minimal']
            )}
            {renderSwitch(
              'Mostrar nome nas mensagens',
              'Exibe seu nome junto das mensagens enviadas no chat.',
              mostrarNome,
              () => {
                const newVal = !mostrarNome;
                setMostrarNome(newVal);
                handleAutoUpdate({ mostra_nome_mensagens: newVal });
              }
            )}
          </>
        );

      default:
        return <p>Selecione uma aba de configuração válida.</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      className="settings-content"
    >
      {renderContent()}
    </motion.div>
  );
}
