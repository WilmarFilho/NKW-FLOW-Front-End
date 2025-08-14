import Styles from './LinkBox.module.css';
import Icon from '../../../components/Gerais/Icons/Icons';

interface LinkBoxProps {
  link: string;
  onCopy: () => void;
}

export default function LinkBox({ link, onCopy }: LinkBoxProps) {
  return (
    <div className={Styles.containerLink}>
      <h4>Seu link de indicação</h4>
      <p>
        Envie este link para seus amigos. A cada indicação válida você avança na barra e desbloqueia recompensas.
      </p>
      <div onClick={onCopy} className={Styles.boxLink}>
        <button>Copiar</button>
        <span>{link}</span>
        <Icon nome="copy" />
      </div>
    </div>
  );
}