import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Button from '../components/Gerais/Buttons/Button';
import MetricCard from '../components/Resumo/MetricCard/MetricCard';
import DropdownPeriod, { ViewType, DropdownId } from '../components/Resumo/DropdownPeriod/DropdownPeriod';
import BarMetricChart from '../components/Resumo/BarMetricChart/BarMetricChart';
import LineMetricChart from '../components/Resumo/LineMetricChart/LineMetricChart';
import GaugeMetricChart from '../components/Resumo/GaugeMetricChart/GaugeMetricChart';

// Css
import GlobalStyles from '../global.module.css';

// Assets
import Icon from '../components/Gerais/Icons/Icons';

export default function ResumoPage() {
  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  const navigate = useNavigate();

  // Dados mockados
  const weeklyData = [
    { name: 'Seg', chats: 12 },
    { name: 'Ter', chats: 5 },
    { name: 'Qua', chats: 8 },
    { name: 'Qui', chats: 15 },
    { name: 'Sex', chats: 20 },
    { name: 'Sáb', chats: 10 },
    { name: 'Dom', chats: 7 },
  ];

  const monthlyData = [
    { name: 'Fev', chats: 17 },
    { name: 'Mar', chats: 3 },
    { name: 'Abr', chats: 8 },
    { name: 'Mai', chats: 16 },
    { name: 'Jun', chats: 2 },
    { name: 'Jul', chats: 10 },
    { name: 'Ago', chats: 70 },
  ];

  const dataNovos = viewChatsNovos === 'weekly' ? weeklyData : monthlyData;
  const dataFechados = viewChatsFechados === 'weekly' ? weeklyData : monthlyData;

  const dataConexoes = [
    { name: 'Principal', value: 32 },
    { name: 'Unidade Bueno', value: 18 },
    { name: 'Vila Nova', value: 14 },
    { name: 'Reserva', value: 20 },
    { name: 'Empresarial', value: 8 },
  ];

  const dataAtendentes = [
    { name: 'João', chats: 26 },
    { name: 'Maria', chats: 15 },
    { name: 'Pedro', chats: 10 },
    { name: 'João', chats: 20 },
    { name: 'Maria', chats: 15 },
    { name: 'Pedro', chats: 10 },
  ];

  const heightAtedentes = dataAtendentes.length * 50;
  const widthConexoes = Math.max(dataConexoes.length * 120, 300);

  return (
    <div className={GlobalStyles.pageContainer}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageHeader}
      >
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Veja seu resumo</h2>
          <h3>Resumos de produtividade para acompanhamento fácil.</h3>
        </div>
        <Button onClick={() => navigate('/ajuda')} label="Quero Ajuda" />
      </motion.div>

      {/* Linha 1 */}
      <motion.div className={GlobalStyles.pageRow}>
        <MetricCard
          title="Chats Novos"
          icon={<Icon nome='chaton' />}
          value="+ 230"
          variation="12% "
          variationText="+231 comparado ao período anterior"
          dropdown={
            <DropdownPeriod
              value={viewChatsNovos}
              onChange={setViewChatsNovos}
              id="novos"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
            />
          }
        >
          <BarMetricChart data={dataNovos} dataKey="chats" />
        </MetricCard>

        <MetricCard
          title="Chats Fechados"
          icon={<Icon nome='chatoff' />}
          value="+ 180"
          variation="-5% "
          variationText="-10 comparado ao período anterior"
          dropdown={
            <DropdownPeriod
              value={viewChatsFechados}
              onChange={setViewChatsFechados}
              id="fechados"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
            />
          }
        >
          <BarMetricChart data={dataFechados} dataKey="chats" />
        </MetricCard>
      </motion.div>

      {/* Linha 2 */}
      <motion.div className={GlobalStyles.pageRow}>
        <MetricCard
          title="Chats por Atendentes"
          icon={<Icon nome='userlist' />}
          small
        >
          <div style={{ height: 200, overflowY: 'auto', paddingRight: 8, width: '100%', scrollbarWidth: 'none' }}>
            <BarMetricChart
              data={dataAtendentes}
              dataKey="chats"
              vertical
              barSize={36}
              height={heightAtedentes}
            />
          </div>
        </MetricCard>

        <MetricCard
          title="Chats por Conexões"
          icon={<Icon nome='connect' />}
          small
        >
          <div style={{ width: '450px', overflowX: 'auto', height: 200, scrollbarWidth: 'none' }}>
            <LineMetricChart data={dataConexoes} dataKey="value" width={widthConexoes} />
          </div>
        </MetricCard>

        <MetricCard
          title="Convidados na Semana"
          icon={<Icon nome='money' />}
          value="+ 6"
          small
        >
          <GaugeMetricChart
            filled={40}
            empty={60}
            valueText="+ 40"
            labelText="Para ganhar recompensas"
          />
        </MetricCard>
      </motion.div>
    </div>
  );
}