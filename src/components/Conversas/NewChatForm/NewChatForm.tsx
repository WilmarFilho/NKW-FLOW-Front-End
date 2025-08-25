import React, { useState, useEffect } from 'react';
import Select, { components, MenuProps, OnChangeValue, StylesConfig } from 'react-select';
import FormStyles from '../../Gerais/Form/form.module.css';

// --- Hook para Media Query ---
// Este hook detecta se a largura da tela é menor que um valor específico.
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};


// --- Interfaces (Tipagem) ---
interface SelectOption {
  value: string;
  label: string;
}

interface NewChatFormProps {
  connections: { id: string; nome?: string }[];
  selectedConnectionId: string | null;
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


// --- Componente de Animação ---
// Este componente ainda precisa de uma classe CSS para os @keyframes.
const Menu = (props: MenuProps<SelectOption>) => {
  return (
    <components.Menu {...props} className={FormStyles.animatedMenu}>
      {props.children}
    </components.Menu>
  );
};


// --- Componente Principal ---
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
  // Usando o hook para detectar telas mobile (largura <= 600px)
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Formata as opções para o React Select
  const selectOptions: SelectOption[] = connections.map((conn) => ({
    value: conn.id,
    label: conn.nome || conn.id,
  }));

  const selectedValue = selectOptions.find(
    (option) => option.value === selectedConnectionId
  ) || null;

  const handleSelectChange = (selectedOption: OnChangeValue<SelectOption, false>) => {
    setSelectedConnectionId(selectedOption ? selectedOption.value : '');
  };

  // Objeto de estilos dinâmico que reage à media query 'isMobile'
  const customSelectStyles: StylesConfig<SelectOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: isMobile ? '48px' : '50px',
      height: isMobile ? '48px' : '50px',
      borderRadius: '8px',
      backgroundColor: '#ffffff1a',
      border: state.isFocused ? '1px solid #ffffff23' : '1px solid transparent',
      boxShadow: 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#ffffff23' : '#cccccc',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 10px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff90',
      fontSize: isMobile ? '16px' : '14px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999',
      fontSize: isMobile ? '16px' : '14px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      // Ajuste aqui para o seu tema, se necessário
      backgroundColor: '#1a1e24', // Exemplo de cor de fundo escura para o menu
      boxShadow: '0 4px 12px rgba(1, 0, 0, 0.1)',
      marginTop: '12px',
    }),
    // ***** ALTERAÇÃO PRINCIPAL AQUI *****
    option: (provided, state) => ({
      ...provided,
      // O fundo só muda no hover (isFocused), caso contrário é transparente.
      backgroundColor: 'transparent',

      // A cor do texto é sempre a mesma, sem mudança para a opção selecionada.
      color: '#ffffff90',

      fontSize: isMobile ? '16px' : '14px',
      padding: isMobile ? '12px 15px' : '16px 15px',
      cursor: 'pointer',

      // Remove o efeito de clique para não ter cor de fundo
      '&:active': {
        backgroundColor: '#ffffff1a', // Opcional: manter o mesmo efeito do hover ao clicar
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <div className={FormStyles.formContainer}>
      <div className={FormStyles.formGroupSelect}>
        <label>Conexão para disparar mensagem</label>
        <Select<SelectOption>
          options={selectOptions}
          value={selectedValue}
          onChange={handleSelectChange}
          placeholder="Selecione a conexão"
          isClearable
          components={{ Menu }}
          styles={customSelectStyles} // A mágica acontece aqui!
        />
        {showErrors && errors.selectedConnectionId && (
          <span className={FormStyles.errorText}>
            {errors.selectedConnectionId}
          </span>
        )}
      </div>

      {/* Usamos o operador '&&' para renderizar o bloco seguinte APENAS se 'selectedConnectionId' for truthy */}
      {selectedConnectionId && (
        <div className={`${FormStyles.formRow} ${FormStyles.fieldsAppear}`}>
          <div className={FormStyles.formGroup}>
            <label>Número de Telefone</label>
            <input
              type="text"
              placeholder="Número com DDD (ex: 11999999999)"
              value={newChatNumber}
              onChange={(e) => setNewChatNumber(e.target.value)}
            />
            {showErrors && errors.newChatNumber && (
              <span className={FormStyles.errorText}>{errors.newChatNumber}</span>
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
              <span className={FormStyles.errorText}>{errors.newChatMessage}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}