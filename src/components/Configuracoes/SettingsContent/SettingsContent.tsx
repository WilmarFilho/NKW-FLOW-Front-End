//Libbs
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
// Hooks
import { useUser } from '../../../hooks/auth/useUser';
//Css
import './settingsContent.css';
//Components
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import OptionSelector from '../OptionSelector/OptionSelector';

type Props = {
  tabIndex: number;
};

export default function SettingsContent({ tabIndex }: Props) {

  const { user, updateUser, uploadProfileImage, loading } = useUser();

  const [mostrarNome, setMostrarNome] = useState(false);
  const [notifAtendente, setNotifAtendente] = useState(false);
  const [notifEntrarConversa, setNotifEntrarConversa] = useState(false);
  const [notifNovoChat, setNotifNovoChat] = useState(false);
  const [senhaUser, setsenhaUser] = useState('');
  const [modoTela, setModoTela] = useState<'Black' | 'White'>('Black');
  const [modoSidebar, setModoSidebar] = useState<'Full' | 'Minimal'>('Full');

  // Carrega valores do estado global do usuário
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

  const handleSave = async () => {
    const success = await updateUser({
      mostra_nome_mensagens: mostrarNome,
      modo_notificacao_atendente: notifAtendente,
      notificacao_para_entrar_conversa: notifEntrarConversa,
      notificacao_novo_chat: notifNovoChat,
      modo_tela: modoTela,
      modo_side_bar: modoSidebar,
    });

    if (success) alert('Alterações salvas!');
  };

  // Função para lidar com a seleção e upload da imagem
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Faz o upload da imagem e obtém a URL
    const imageUrl = await uploadProfileImage(file);

    // 2. Se o upload foi bem-sucedido, atualiza o usuário com a nova URL
    if (imageUrl) {
      const success = await updateUser({ foto_perfil: imageUrl });
      if (!success) {
        alert('Houve um erro ao salvar a nova foto de perfil.');
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
            <div className="switch-wrapper profile-wrapper">
              <div className="box-text">
                <span className="switch-label">Foto de Perfil</span>
                <p className="switch-description">Clique na imagem para alterar.</p>
              </div>
              <div className="profile-image-container">
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
            </div>

            <div className="switch-wrapper">
              <div className="box-text">
                <span className="switch-label">Alterar Senha</span>
                <p className="switch-description">Informe uma nova senha de acesso.</p>
              </div>
              <input
                type="password"
                className="password-input"
                placeholder="Nova senha"
                value={senhaUser}
                onChange={(e) => { setsenhaUser(e.target.value) }}
              />
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
              () => setNotifAtendente(!notifAtendente)
            )}
            {renderSwitch(
              'Notificação ao entrar na conversa',
              'Informa você quando entrar em uma conversa ativa.',
              notifEntrarConversa,
              () => setNotifEntrarConversa(!notifEntrarConversa)
            )}
            {renderSwitch(
              'Notificação de novo chat',
              'Você será notificado sempre que um novo chat for iniciado.',
              notifNovoChat,
              () => setNotifNovoChat(!notifNovoChat)
            )}
          </>
        );
      case 2:
        return (
          <>
            {renderSelect(
              'Modo de Tela',
              'Altere entre modo escuro (Black) e claro (White).',
              modoTela,
              (val) => setModoTela(val as 'Black' | 'White'),
              ['Black', 'White']
            )}
            {renderSelect(
              'Modo de Sidebar',
              'Sidebar completa com nomes e ícones ou minimalista com ícones apenas.',
              modoSidebar,
              (val) => setModoSidebar(val as 'Full' | 'Minimal'),
              ['Full', 'Minimal']
            )}
            {renderSwitch(
              'Mostrar nome nas mensagens',
              'Exibe seu nome junto das mensagens enviadas no chat.',
              mostrarNome,
              () => setMostrarNome(!mostrarNome)
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

      <button className="save-btn" onClick={handleSave} disabled={!user}>
        Salvar alterações
      </button>
    </motion.div>
  );
}
