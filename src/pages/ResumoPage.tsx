import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Gerais/Buttons/Button';
import MetricCard from '../components/Resumo/MetricCard/MetricCard';
import DropdownPeriod from '../components/Resumo/DropdownPeriod/DropdownPeriod';
import BarMetricChart from '../components/Resumo/BarMetricChart/BarMetricChart';
import LineMetricChart from '../components/Resumo/LineMetricChart/LineMetricChart';
import GaugeMetricChart from '../components/Resumo/GaugeMetricChart/GaugeMetricChart';
import GlobalStyles from '../global.module.css';
import Icon from '../components/Gerais/Icons/Icons';
import { useResumoPage } from '../hooks/pages/useResumoPage';
import { useMediaQuery } from 'react-responsive';

export default function ResumoPage() {
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 429.98 });

  function getMobileData<T>(data: T[] | undefined): T[] {
    if (!data) return [];
    return isMobile ? data.slice(-3) : data;
  }

  const {
    viewChatsNovos,
    setViewChatsNovos,
    viewChatsFechados,
    setViewChatsFechados,
    openDropdown,
    setOpenDropdown,
    dataNovos,
    dataFechados,
    dataConexoes,
    dataAtendentes,
    heightAtedentes,
    widthConexoes
  } = useResumoPage();

  return (
    <div className={GlobalStyles.pageContainer}>
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

      <motion.div className={GlobalStyles.pageRow}>
        <MetricCard
          title="Chats Novos"
          icon={<Icon nome='chaton' />}
          value={`+ ${dataNovos?.total ?? 0}`}
          variation={`${dataNovos?.percent.toFixed(1) ?? 0}%`}
          variationText={`${(dataNovos?.diff ?? 0) >= 0 ? '+' : ''}${dataNovos?.diff ?? 0} comparado ao período anterior`}
          dropdown={
            <DropdownPeriod
              value={viewChatsNovos}
              onChange={setViewChatsNovos}
              id="novos"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
            />
          }
          isMobile={isMobile} // 👈 passa para o MetricCard
        >
          <BarMetricChart
            data={getMobileData(dataNovos?.labels)}
            dataKey="chats"
           
          />
        </MetricCard>

        <MetricCard
          title="Chats Fechados"
          icon={<Icon nome='chatoff' />}
          value={`+ ${dataFechados?.total ?? 0}`}
          variation={`${dataFechados?.percent.toFixed(1) ?? 0}%`}
          variationText={`${(dataFechados?.diff ?? 0) >= 0 ? '+' : ''}${dataFechados?.diff ?? 0} comparado ao período anterior`}
          dropdown={
            <DropdownPeriod
              value={viewChatsFechados}
              onChange={setViewChatsFechados}
              id="fechados"
              openId={openDropdown}
              setOpenId={setOpenDropdown}
            />
          }
          isMobile={isMobile}
        >
          <BarMetricChart
            data={getMobileData(dataFechados?.labels)}
            dataKey="chats"
           
          />
        </MetricCard>
      </motion.div>

      <motion.div className={GlobalStyles.pageRowVariant}>
        <MetricCard
          title="Chats por Atendentes"
          icon={<Icon nome='userlist' />}
          small
          isMobile={isMobile}
        >
          <div style={{ height: 200, overflowY: 'auto', paddingRight: 8, width: '100%', scrollbarWidth: 'none' }}>
            <BarMetricChart
              data={getMobileData(dataAtendentes)}
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
          isMobile={isMobile}
        >
          <div className={GlobalStyles.chartContainer}>
            <LineMetricChart
              data={getMobileData(dataConexoes)}
              dataKey="value"
              width={widthConexoes}
             
            />
          </div>
        </MetricCard>

        <MetricCard
          title="Convidados na Semana"
          icon={<Icon nome='money' />}
          value="+0"
          small
          isMobile={isMobile}
        >
          <GaugeMetricChart
            filled={0}
            empty={100}
            valueText="+ 0"
            labelText="Para ganhar recompensas"
          />
        </MetricCard>
      </motion.div>
    </div>
  );
}