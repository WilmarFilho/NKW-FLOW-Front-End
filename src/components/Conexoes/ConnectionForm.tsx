// Hooks
import { useRecoilValue } from 'recoil';
import Select, { OnChangeValue } from 'react-select'; // 1. Importar o Select

// Type
import { Connection } from '../../types/connection';
// Css
import formStyles from '../Gerais/Form/form.module.css';
import styles from './ConnectionForm.module.css';
// State
import { agentsState } from '../../state/atom';

// 2. Importar tudo do nosso módulo reutilizável
import {
  useMediaQuery,
  getCustomSelectStyles,
  AnimatedMenu,
  SelectOption,
} from '../Gerais/Form/CustomSelect'; // Ajuste o caminho conforme necessário

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
  showErrors = false,
}: ConnectionFormProps) {
  const agents = useRecoilValue(agentsState);

  // 3. Adicionar a lógica do select customizado
  const isMobile = useMediaQuery('(max-width: 600px)');
  const customStyles = getCustomSelectStyles(isMobile);

  // 4. Formatar os dados para o formato do Select
  const agentOptions: SelectOption[] =
    agents?.map((agent) => ({
      value: agent.id,
      label: agent.tipo_de_agente,
    })) || [];

  // 5. Encontrar o valor selecionado
  const selectedAgent =
    agentOptions.find((opt) => opt.value === formData?.agente_id) || null;

  // 6. Criar um handler específico para o select customizado
  const handleAgentChange = (
    selectedOption: OnChangeValue<SelectOption, false>
  ) => {
    onChange({
      ...formData,
      agente_id: selectedOption ? selectedOption.value : '',
    });
  };

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

          {/* 7. Substituir o select nativo pelo componente Select */}
          <div className={formStyles.formGroup}>
            <label>Agente IA</label>
            <Select<SelectOption>
              inputId="agent"
              options={agentOptions}
              value={selectedAgent}
              onChange={handleAgentChange}
              placeholder="Selecione"
              isClearable
              components={{ Menu: AnimatedMenu }}
              styles={customStyles}
            />
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