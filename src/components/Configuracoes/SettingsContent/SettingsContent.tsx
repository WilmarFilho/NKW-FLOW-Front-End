//Libbs
import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { userState } from '../../../state/atom';
import { useState } from 'react';
//Css
import './settingsContent.css';
//Components
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import OptionSelector from '../OptionSelector/OptionSelector';

type Props = {
  tabIndex: number;
};

export default function SettingsContent({ tabIndex }: Props) {
  const [user, setUser] = useRecoilState(userState);

  // Estados locais (você pode usar useEffect se quiser sincronizar com mudanças do user)
  const [mostrarNome, setMostrarNome] = useState(user.mostra_nome_mensagens);
  const [notifAtendente, setNotifAtendente] = useState(user.modo_notificacao_atendente);
  const [notifEntrarConversa, setNotifEntrarConversa] = useState(user.notificacao_para_entrar_conversa);
  const [notifNovoChat, setNotifNovoChat] = useState(user.notificacao_novo_chat);
  const [modoTela, setModoTela] = useState(user.modo_tela);
  const [modoSidebar, setModoSidebar] = useState(user.modo_side_bar);

  const handleSave = () => {
    setUser({
      ...user,
      mostra_nome_mensagens: mostrarNome,
      modo_notificacao_atendente: notifAtendente,
      notificacao_para_entrar_conversa: notifEntrarConversa,
      notificacao_novo_chat: notifNovoChat,
      modo_tela: modoTela,
      modo_side_bar: modoSidebar,
    });
    alert('Alterações salvas!');
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
    switch (tabIndex) {
      case 0:
        return (
          <>
            {renderSwitch(
              'Mostrar nome nas mensagens',
              'Exibe seu nome junto das mensagens enviadas no chat.',
              mostrarNome,
              () => setMostrarNome(!mostrarNome)
            )}
            {renderSwitch(
              'Notificação de novo chat',
              'Você será notificado sempre que um novo chat for iniciado.',
              notifNovoChat,
              () => setNotifNovoChat(!notifNovoChat)
            )}
          </>
        );
      case 1:
        return <p>🚧 Funções de segurança como troca de senha e autenticação em 2 fatores estarão aqui.</p>;
      case 2:
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
          </>
        );
      case 3:
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

      <button className="save-btn" onClick={handleSave}>
        Salvar alterações
      </button>

    </motion.div>
  );
}
