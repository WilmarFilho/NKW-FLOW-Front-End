//Libbs
import { motion } from 'framer-motion';
//Css
import './tabsHeader.css';

type Props = {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export default function TabsHeader({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      className="tabs-header"
    >
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`tab-item ${index === activeTab ? 'active' : ''}`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </div>
      ))}
    </motion.div>
  );
}
