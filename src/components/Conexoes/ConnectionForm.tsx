//Libbs
import { useRecoilState } from 'recoil';
// Atom
import { addConnectionModalState } from '../../state/atom';
//Components
import Modal from '../Gerais/ModalForm/Modal';
//Hooks
import { useAddConnection } from '../../hooks/connections/useAddConnection';
import { useAgents } from '../../hooks/agents/useAgents';
import { useState } from 'react';

export default function AddConnectionModal() {

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
    isLoading
  } = useAddConnection(handleClose, initialData);


  if (!modalState.isOpen) return null;

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Preencha para gerar o QR Code' : 'Conecte seu WhatsApp'}
    >
      {step === 1 && (
        <form onSubmit={editMode ? handleEditConnection : handleStartSession} className="connection-form">
          <div className="form-group">
            <label htmlFor="name">Nome da Conexão</label>
            <input id="nome" type="text" value={formData.nome} onChange={handleInputChange} placeholder="Ex: WhatsApp da Loja" required />
          </div>
          {editMode && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status ? 'ativo' : 'inativo'}
                onChange={(e) =>
                  handleInputChange(e)
                }
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Desativado</option>
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="agent">Agente IA</label>
            {/* 3. ATUALIZE O SELECT PARA SER DINÂMICO */}
            <select id='agent' value={formData.agent} onChange={handleInputChange}>
              {agents && (
                <>
                  {/* É uma boa prática ter uma opção default */}
                  <option value="" >Selecione um agente</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.tipo_de_agente}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          {isLoading ? (
            <button type="button" className="submit-button loading" disabled>
              <span className="spinner"></span>
              Conectando...
            </button>
          ) : (
            <button type="submit" className="submit-button">
              {editMode ? 'Salvar Alterações' : 'Gerar QR Code'}
            </button>
          )}
        </form>
      )}

      {step === 2 && (
        <div className="qr-code-step">
          <p>Abra o WhatsApp em seu celular, vá em Aparelhos Conectados e escaneie o código abaixo.</p>
          {qrCode && <img src={qrCode} alt="QR Code para conectar no WhatsApp" />}
        </div>
      )}
    </Modal>
  );
}


