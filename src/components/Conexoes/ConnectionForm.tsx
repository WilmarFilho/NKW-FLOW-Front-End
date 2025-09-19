import { useRecoilValue } from 'recoil';
import Select, { OnChangeValue } from 'react-select'; 
import { Connection } from '../../types/connection';
import formStyles from '../Gerais/Form/form.module.css';
import styles from './ConnectionForm.module.css';
import { agentsState } from '../../state/atom';

import {
  useMediaQuery,
  getCustomSelectStyles,
  AnimatedMenu,
  SelectOption,
} from '../Gerais/Form/CustomSelect'; 

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

  const isMobile = useMediaQuery('(max-width: 600px)');
  const customStyles = getCustomSelectStyles(isMobile);

  const agentOptions: SelectOption[] =
    agents?.map((agent) => ({
      value: agent.id,
      label: agent.tipo_de_agente,
    })) || [];

  const selectedAgent =
    agentOptions.find((opt) => opt.value === formData?.agente_id) || null;

  const handleAgentChange = (
    selectedOption: OnChangeValue<SelectOption, false>
  ) => {
    onChange({
      ...formData,
      agente_id: selectedOption ? selectedOption.value : '',
    });
  };

  const statusOptions: SelectOption[] = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  const selectedStatus =
    statusOptions.find(
      (opt) => opt.value === (formData?.status ? 'ativo' : 'inativo')
    ) || null;

  const handleStatusChange = (
    selectedOption: OnChangeValue<SelectOption, false>
  ) => {
    onChange({
      ...formData,
      status: selectedOption?.value === 'ativo',
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

          {/* Select customizado para Agente */}
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
            <Select<SelectOption>
              inputId="status"
              options={statusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Selecione"
              isClearable={false}
              components={{ Menu: AnimatedMenu }}
              styles={customStyles}
            />
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