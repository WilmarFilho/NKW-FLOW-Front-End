// Libs
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Hooks
import { useUser } from '../../../hooks/auth/useUser';

// CSS Modules
import styles from './SettingsContent.module.css';

// Components
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import OptionSelector from '../OptionSelector/OptionSelector';

// Assets
import EditIcon from '../assets/pencil.svg'

// Types
import { User } from '../../../types/user';

type Props = {
  tabIndex: number;
};

export default function SettingsContent({ tabIndex }: Props) {
  const { user, updateUser, uploadProfileImage, loading } = useUser();

  // Nomes de estado mais descritivos
  const [showNameInMessages, setShowNameInMessages] = useState(false);
  const [notifyAttendant, setNotifyAttendant] = useState(false);
  const [notifyOnEnterConversation, setNotifyOnEnterConversation] = useState(false);
  const [notifyOnNewChat, setNotifyOnNewChat] = useState(false);
  const [screenMode, setScreenMode] = useState<'Black' | 'White'>('Black');
  const [sidebarMode, setSidebarMode] = useState<'Full' | 'Minimal'>('Full');

  useEffect(() => {
    if (user) {
      setShowNameInMessages(user.mostra_nome_mensagens);
      setNotifyAttendant(user.modo_notificacao_atendente);
      setNotifyOnEnterConversation(user.notificacao_para_entrar_conversa);
      setNotifyOnNewChat(user.notificacao_novo_chat);
      setScreenMode(user.modo_tela);
      setSidebarMode(user.modo_side_bar);
    }
  }, [user]);

  const handleSettingsUpdate = async (updatedFields: Partial<User>) => {
    if (!user) return;
    const success = await updateUser(updatedFields);
    if (success) {
      toast.success('Alteração salva com sucesso!');
    } else {
      toast.error('Erro ao salvar as alterações. Tente novamente.');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadProfileImage(file);

    if (imageUrl) {
      await handleSettingsUpdate({ foto_perfil: imageUrl });
    } else {
      toast.error('Falha no upload da imagem.');
    }
  };

  // Funções de renderização para evitar repetição de JSX
  const renderSwitchSetting = (
    label: string,
    description: string,
    value: boolean,
    onChange: () => void
  ) => (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        <p className={styles.settingDescription}>{description}</p>
      </div>
      <ToggleSwitch isOn={value} onToggle={onChange} />
    </div>
  );

  const renderSelectSetting = (
    label: string,
    description: string,
    value: string,
    onChange: (newVal: string) => void,
    options: string[]
  ) => (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        <p className={styles.settingDescription}>{description}</p>
      </div>
      <OptionSelector options={options} selected={value} onChange={onChange} />
    </div>
  );

  const renderActiveTabContent = () => {
    if (!user) return <p>Carregando configurações...</p>;

    switch (tabIndex) {
      case 0: // Aba de Perfil
        return (
          <>
            <div className={styles.mainHeaderAccountWrapper}>
              <div className={styles.profileImageWrapper}>
                <img
                  src={user.foto_perfil || '/default-avatar.png'}
                  alt="Foto de Perfil"
                  className={styles.profileImage}
                  onClick={() => !loading && document.getElementById('profileImageInput')?.click()}
                  style={{ cursor: loading ? 'wait' : 'pointer' }}
                />
                <span className={styles.overlayText}>Editar</span>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </div>
              <div className={styles.userInfoMain}>
                <h1>Nome de usuário</h1>
                <h2>{user.nome}</h2>
              </div>
              <div className={styles.userInfoMain}>
                <h1>Cargo</h1>
                <h2>Administrador</h2>
              </div>
            </div>

            <div className={styles.configsWrapperBox}>
              <div className={styles.infoGrid}>

                <div className={styles.headerAccountWrapper}>
                  <div className={styles.userInfo}><h1>E-mail</h1><h2>{user.email}</h2></div>
                  <div className={styles.userInfo}><h1>Senha</h1><h2>***********</h2></div>
                  <div className={styles.userInfo}><h1>Plano Contradado</h1><h2>Premium</h2></div>
                </div>

                <div className={styles.headerAccountWrapper}>
                  <div className={styles.userInfo}>
                    <h1>Cidade</h1>
                    <h2>Goiânia</h2>
                  </div>
                  <div className={styles.userInfo}>
                    <h1>Endereço</h1>
                    <h2>Rua 9 Qd 9 Lt 2</h2>
                  </div>
                  <div className={styles.userInfo}>
                    <h1>Número</h1>
                    <h2>(64) 99243-4104</h2>
                  </div>

                </div>

              </div>
              <button className={styles.editButton}>Editar Informações</button>
            </div>
          </>
        );

      case 1: // Aba de Configurações
        return (
          <>
            {renderSwitchSetting(
              'Notificação para atendente',
              'Envia um alerta ao atendente quando é necessário entrar em uma conversa.',
              notifyAttendant,
              () => {
                const newValue = !notifyAttendant;
                setNotifyAttendant(newValue);
                handleSettingsUpdate({ modo_notificacao_atendente: newValue });
              }
            )}
            {renderSwitchSetting(
              'Notificação ao entrar na conversa',
              'Informa você quando entrar em uma conversa ativa.',
              notifyOnEnterConversation,
              () => {
                const newValue = !notifyOnEnterConversation;
                setNotifyOnEnterConversation(newValue);
                handleSettingsUpdate({ notificacao_para_entrar_conversa: newValue });
              }
            )}
            {renderSwitchSetting(
              'Notificação de novo chat',
              'Você será notificado sempre que um novo chat for iniciado.',
              notifyOnNewChat,
              () => {
                const newValue = !notifyOnNewChat;
                setNotifyOnNewChat(newValue);
                handleSettingsUpdate({ notificacao_novo_chat: newValue });
              }
            )}
            {renderSelectSetting(
              'Modo de Tela',
              'Altere entre modo escuro (Black) e claro (White).',
              screenMode,
              (val) => {
                const newValue = val as 'Black' | 'White';
                setScreenMode(newValue);
                handleSettingsUpdate({ modo_tela: newValue });
              },
              ['Black', 'White']
            )}
            {renderSelectSetting(
              'Modo de Sidebar',
              'Completa com nomes e ícones ou minimalista apenas com ícones.',
              sidebarMode,
              (val) => {
                const newValue = val as 'Full' | 'Minimal';
                setSidebarMode(newValue);
                handleSettingsUpdate({ modo_side_bar: newValue });
              },
              ['Full', 'Minimal']
            )}
            {renderSwitchSetting(
              'Mostrar nome nas mensagens',
              'Exibe seu nome junto das mensagens enviadas no chat.',
              showNameInMessages,
              () => {
                const newValue = !showNameInMessages;
                setShowNameInMessages(newValue);
                handleSettingsUpdate({ mostra_nome_mensagens: newValue });
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
      className={styles.settingsContent}
    >
      {renderActiveTabContent()}
    </motion.div>
  );
}