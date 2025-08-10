import { useRecoilState } from 'recoil';

// State
import { addConnectionModalState } from '../../state/atom';

// Components
import Modal from '../Gerais/ModalForm/Modal';

// Hooks
import { useAddConnection } from '../../hooks/connections/useAddConnection';
import { useAgents } from '../../hooks/agents/useAgents';

// Css
import formStyles from '../Gerais/ModalForm/ModalForm.module.css';

export default function AddConnectionModal({ fetchConnections }: { fetchConnections: () => Promise<void> }) {
  const [modalState, setModalState] = useRecoilState(addConnectionModalState);
  const { agents } = useAgents();
  const { initialData, editMode } = modalState;

  const handleClose = () => {
    setModalState({ isOpen: false, initialData: null, editMode: false });
  };

  const {
    step,
    qrCode,
    formData,
    handleInputChange,
    handleStartSession,
    handleEditConnection,
    isLoading,
  } = useAddConnection(handleClose, fetchConnections, initialData);

  if (!modalState.isOpen) return null;

  const getTitle = () => {
    if (editMode) return 'Editar Conexão';
    return step === 1 ? 'Criar Nova Conexão' : 'Conecte seu WhatsApp';
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={handleClose} title={getTitle()}>
      {step === 1 && (
        // Aplicando a classe do container do formulário
        <form
          onSubmit={editMode ? handleEditConnection : handleStartSession}
          className={formStyles.formContainer} 
        >
          <p className={formStyles.formDescription}>
            {editMode
              ? 'Edite as informações da sua conexão.'
              : 'Preencha os dados abaixo para gerar o QR Code de conexão.'}
          </p>
          <div className={formStyles.formGroup}>
            <label htmlFor="nome">Nome da Conexão</label>
            <input
              id="nome"
              type="text"
              className={formStyles.formInput}
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: WhatsApp da Loja"
              required
            />
          </div>
          {editMode && (
            <div className={formStyles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className={formStyles.formSelect}
                value={formData.status ? 'ativo' : 'inativo'}
                onChange={handleInputChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Desativado</option>
              </select>
            </div>
          )}
          <div className={formStyles.formGroup}>
            <label htmlFor="agent">Agente IA</label>
            <select
              id="agent"
              className={formStyles.formSelect}
              value={formData.agent}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um agente</option>
              {agents?.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.tipo_de_agente}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <button type="button" className={formStyles.submitButton} disabled>
              <span className={formStyles.spinner}></span>
              Conectando...
            </button>
          ) : (
            <button type="submit" className={formStyles.submitButton}>
              {editMode ? 'Salvar Alterações' : 'Gerar QR Code'}
            </button>
          )}
          
        </form>
      )}

      {step === 2 && (
        <div className={formStyles.qrCodeStep}>
          <p className={formStyles.formDescription}>
            Abra o WhatsApp em seu celular, vá em "Aparelhos Conectados" e escaneie o código abaixo.
          </p>
          {qrCode ? (
            <img src={qrCode} alt="QR Code para conectar no WhatsApp" />
          ) : (
            <div className={formStyles.statusText}>Gerando QR Code...</div>
          )}
        </div>
      )}
    </Modal>
  );
}