import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, YAxis, PieChart, Pie, Cell,
  LabelList
} from 'recharts';
import Button from '../../components/Gerais/Buttons/Button';
import PageStyles from '../PageStyles.module.css';

import CalendarIcon from './assets/HeroiconsCalendarDays20Solid.svg';
import ChatOnIcon from './assets/CarbonChatLaunch.svg';
import ChatOffIcon from './assets/CarbonChatOff.svg';
import ArrowIcon from './assets/IcRoundArrowOutward.svg';
import UserListIcon from './assets/PhUserList.svg'
import ConnectIcon from './assets/IcRoundCastConnected.svg'
import CashIcon from './assets/CarbonMoney.svg'
import { useNavigate } from 'react-router-dom';

type ViewType = 'weekly' | 'monthly';
type DropdownId = 'novos' | 'fechados' | null;

export default function DashboardPage() {
  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [open, setOpen] = useState<DropdownId>(null);

  const navigate = useNavigate();

  const options = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
  ];

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

  // Segunda linha
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

  const heightAtedentes = dataAtendentes.length * 50

  const widthConexoes = Math.max(dataConexoes.length * 120, 300)

  const renderDropdown = (
    view: ViewType,
    setView: React.Dispatch<React.SetStateAction<ViewType>>,
    id: DropdownId
  ) => (
    <div className={PageStyles.containerSelect} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(open === id ? null : id)}
      >
        <CalendarIcon />
        {options.find(o => o.value === view)?.label}
      </button>

      <AnimatePresence>
        {open === id && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className={PageStyles.ulDropDown}
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  setView(opt.value as ViewType);
                  setOpen(null);
                }}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={PageStyles.containerDashboard}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Veja seu resumo</h2>
          <h3>Resumos de produtividade para acompanhamento fácil.</h3>
        </div>
        <Button onClick={() => navigate('/ajuda')} label="Quero Ajuda" />
      </motion.div>

      {/* Linha 1 */}
      <motion.div className={PageStyles.containerRow}>
        {/* Chats Novos */}
        <div className={PageStyles.containerColumnLarge}>
          <div className={PageStyles.headerBoxDashboard}>
            <div className={PageStyles.titlesBoxDashboard}>
              <h2><ChatOnIcon /> Chats Novos</h2>
              <h3>+ 230</h3>
              <div className={PageStyles.rodapeNumero}>
                <strong>12% <ArrowIcon /></strong>
                <span>+231 comparado ao período anterior</span>
              </div>
            </div>
            {renderDropdown(viewChatsNovos, setViewChatsNovos, 'novos')}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataNovos} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8, border: 'none' }} />
              <Bar dataKey="chats" className={PageStyles.barraGraficoPrimary} radius={[8, 8, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chats Fechados */}
        <div className={PageStyles.containerColumnLarge}>
          <div className={PageStyles.headerBoxDashboard}>
            <div className={PageStyles.titlesBoxDashboard}>
              <h2><ChatOffIcon /> Chats Fechados</h2>
              <h3>+ 180</h3>
              <div className={PageStyles.rodapeNumero}>
                <strong>-5% <ArrowIcon /></strong>
                <span>-10 comparado ao período anterior</span>
              </div>
            </div>
            {renderDropdown(viewChatsFechados, setViewChatsFechados, 'fechados')}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataFechados} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8, border: 'none' }} />
              <Bar dataKey="chats" className={PageStyles.barraGraficoPrimary} radius={[8, 8, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Linha 2 */}
      <motion.div className={PageStyles.containerRowSmall}>

        {/* Chats por atendente - scroll vertical */}
        <div className={PageStyles.containerColumnSmall}>
          <div className={PageStyles.titlesBoxDashboard}>
            <h2><UserListIcon /> Chats por Atendentes</h2>
          </div>
          <div style={{ height: 200, overflowY: 'auto', paddingRight: 8, width: '100%', scrollbarWidth: 'none' }}>
            <ResponsiveContainer width="100%" height={heightAtedentes}>
              <BarChart
                layout="vertical"
                data={dataAtendentes}
                margin={{ top: 0, right: 60, left: 0, bottom: 0 }} // Ajustei a margem direita para garantir espaço
                barSize={36}
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />

                <Bar
                  dataKey="chats"
                  className={PageStyles.barraGraficoSecondary}
                  radius={[8, 8, 8, 8]}
                >
                  {/* LabelList para os NOMES com className */}
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={10}
                    // Adicionada a classe CSS
                    className={PageStyles.labelNomeAtendente}
                  />

                  {/* LabelList para os NÚMEROS com className */}
                  <LabelList
                    dataKey="chats"
                    position="right"
                    offset={8}
                    formatter={(label: unknown) => {
                      if (typeof label === 'number') {
                        return `${label} chats`;
                      }
                      return null;
                    }}
                    // Adicionada a classe CSS
                    className={PageStyles.labelChatsContagem}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chats por conexão - scroll horizontal */}
        <div className={PageStyles.containerColumnSmall}>
          <div className={PageStyles.titlesBoxDashboard}>
            <h2><ConnectIcon /> Chats por Conexões</h2>
          </div>
          <div style={{ width: '450px', overflowX: 'auto', height: 200, scrollbarWidth: 'none' }}>
            <ResponsiveContainer width={widthConexoes} height="100%">
              <LineChart
                data={dataConexoes}
                margin={{ top: 60, right: 50, left: 50, bottom: 5 }}
              >
                <XAxis interval={0} dataKey="name" axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />

                <Line
                  type="natural"
                  dataKey="value"
                  stroke="#9ca3af"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    stroke: '#9ca3af',
                    strokeWidth: 2,
                    fill: 'white'
                  }}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    // 1. ESPAÇAMENTO AUMENTADO:
                    //    Aumentei o valor para 15 para dar mais "respiro" entre o ponto e o número.
                    offset={15}
                    // 2. CLASSE PERSONALIZADA ADICIONADA:
                    //    Removi o 'style' e adicionei a 'className' para estilização via CSS.
                    className={PageStyles.labelValorConexao}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Convidados - Gauge semicircular */}
        <div className={PageStyles.containerColumnSmall}>
          <div className={PageStyles.headerBoxDashboard}>
            <div className={PageStyles.titlesBoxDashboard}>
              <h2><CashIcon /> Convidados na Semana</h2>
              <h3>+ 6</h3>
            </div>
          </div>

          {/* Contêiner do gráfico */}
          <div
            style={{
              width: '100%',
              height: 160, // altura maior
              position: 'relative',
              marginTop: '-20px'
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'preenchido', value: 40 },
                    { name: 'vazio', value: 60 }
                  ]}
                  cx="50%"
                  cy="100%" // mais baixo, aumenta o arco
                  outerRadius="180%" // aumenta a largura e altura do arco
                  innerRadius="125%"
                  startAngle={200} // abre mais para os lados
                  endAngle={-20} // abre mais para os lados
                  dataKey="value"
                  stroke="none"
                >
                  <Cell className={PageStyles.gaugePreenchido} />
                  <Cell className={PageStyles.gaugeVazio} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Texto central */}
            <div className={PageStyles.gaugeFooter}>
              <div className={PageStyles.gaugeNumero}>+ 40</div>
              <div className={PageStyles.gaugeLabel}>Para ganhar recompensas</div>
            </div>
          </div>
        </div>


      </motion.div>
    </div>
  );
}
