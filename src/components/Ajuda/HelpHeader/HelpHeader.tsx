// Libs
import { motion } from 'framer-motion';
// Icons
import Icon from '../../Gerais/Icons/Icons';
// Css
import GlobalStyles from '../../../global.module.css'
import HelpHeaderStyles from './HelpHeader.module.css';

export default function HelpHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      className={GlobalStyles.pageHeader}
    >
      <div className={GlobalStyles.pageHeaderTitles}>
        <h2>Página de Ajuda</h2>
        <h3>Pergunte qualquer coisa que estiver com dúvidas sobre o NKW FLOW.</h3>
      </div>

      <div className={HelpHeaderStyles.helpHeaderIcons}>
        <div className={HelpHeaderStyles.helpHeaderIconBox}>
          <a href="https://google.com" target="_blank" rel="noreferrer">
            <Icon nome="info" />
          </a>
        </div>
        <div className={HelpHeaderStyles.helpHeaderIconBox}>
          <a href="https://google.com" target="_blank" rel="noreferrer">
            <Icon nome="insta" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}