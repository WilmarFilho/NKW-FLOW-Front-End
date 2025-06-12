import './tabsHeader.css';


type Props = {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
};

export default function TabsHeader({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <div className="tabs-header">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`tab-item ${index === activeTab ? 'active' : ''}`}
          onClick={() => setActiveTab(index)}
        >
          {tab} 
        </div>
      ))}
    </div>
  );
}
