// Hooks
import { useRecoilValue } from 'recoil';
// Type
import { Connection } from '../../types/connection';
// Css
import formStyles from '../Gerais/Form/form.module.css'
import styles from './ConnectionForm.module.css'
import { agentsState } from '../../state/atom';

interface ConnectionFormProps {
  formData: Partial<Connection> | null;
  onChange: (data: Partial<Connection> | null) => void;
  step: 1 | 2;
  qrCode: string | null;
  editMode?: boolean;
  errors?: Partial<Record<keyof Connection, string>>;
  showErrors?: boolean;
}

export default function ConnectionForm({
  formData,
  onChange,
  step,
  qrCode,
  editMode,
  errors = {},
  showErrors = false
}: ConnectionFormProps) {

  const agents = useRecoilValue(agentsState)

  if (step === 1) {
    return (
      <div className={formStyles.formContainer}>
        <div className={formStyles.formRow}>
          <div className={formStyles.formGroup}>
            <label>Nome da Conexão</label>
            <input
              id="nome"
              type="text"
              value={formData?.nome || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  nome: e.target.value,
                })
              }
            />
            {showErrors && errors.nome && (
              <span className={formStyles.errorText}>{errors.nome}</span>
            )}
          </div>

          <div className={formStyles.formGroup}>
            <label>Agente IA</label>
            <select
              id="agent"
              value={formData?.agente_id || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  agente_id: e.target.value,
                })
              }
            >
              <option value="">Selecione</option>
              {agents?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.tipo_de_agente}
                </option>
              ))}
            </select>
            {showErrors && errors.agente_id && (
              <span className={formStyles.errorText}>{errors.agente_id}</span>
            )}
          </div>
        </div>

        {editMode && (
          <div className={formStyles.formGroup}>
            <label>Status</label>
            <select
              id="status"
              value={formData?.status ? 'ativo' : 'inativo'}
              onChange={(e) =>
                onChange({
                  ...formData,
                  status: e.target.value === 'ativo',
                })
              }
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={styles.qrCodeStep}>
        <h2>Escaneie o qr code com seu WhatsApp</h2>
        {qrCode ? <img src={qrCode} alt="QR Code" /> : ''}
      </div>
    );
  }

  return null;
}