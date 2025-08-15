import FormStyles from '../../Gerais/Form/form.module.css';

interface NewChatFormProps {
  connections: { id: string; nome?: string }[];
  selectedConnectionId: string;
  setSelectedConnectionId: (id: string) => void;
  newChatNumber: string;
  setNewChatNumber: (num: string) => void;
  newChatMessage: string;
  setNewChatMessage: (msg: string) => void;
  showErrors: boolean;
  errors: {
    selectedConnectionId?: string;
    newChatNumber?: string;
    newChatMessage?: string;
  };
}

export default function NewChatForm({
  connections,
  selectedConnectionId,
  setSelectedConnectionId,
  newChatNumber,
  setNewChatNumber,
  newChatMessage,
  setNewChatMessage,
  showErrors,
  errors,
}: NewChatFormProps) {
  return (
    <div className={FormStyles.formContainer}>
      <div className={FormStyles.formGroup}>
        <label>Conexão para disparar mensagem</label>
        <select
          value={selectedConnectionId}
          onChange={(e) => setSelectedConnectionId(e.target.value)}
        >
          <option value="">Selecione a conexão</option>
          {connections.map((conn) => (
            <option key={conn.id} value={conn.id}>
              {conn.nome || conn.id}
            </option>
          ))}
        </select>
        {showErrors && errors.selectedConnectionId && (
          <span className={FormStyles.errorText}>
            {errors.selectedConnectionId}
          </span>
        )}
      </div>

      <div className={FormStyles.formRow}>
        <div className={FormStyles.formGroup}>
          <label>Número de Telefone</label>
          <input
            type="text"
            placeholder="Número com DDD (ex: 11999999999)"
            value={newChatNumber}
            onChange={(e) => setNewChatNumber(e.target.value)}
          />
          {showErrors && errors.newChatNumber && (
            <span className={FormStyles.errorText}>
              {errors.newChatNumber}
            </span>
          )}
        </div>

        <div className={FormStyles.formGroup}>
          <label>Primeira Mensagem</label>
          <input
            placeholder="Primeira mensagem"
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
          />
          {showErrors && errors.newChatMessage && (
            <span className={FormStyles.errorText}>
              {errors.newChatMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}