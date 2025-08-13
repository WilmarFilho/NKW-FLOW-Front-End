import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, YAxis, PieChart, Pie, Cell
} from 'recharts';
import Button from '../../components/Gerais/Buttons/Button';
import PageStyles from '../PageStyles.module.css';

import CalendarIcon from './assets/HeroiconsCalendarDays20Solid.svg';
import ChatOnIcon from './assets/CarbonChatLaunch.svg';
import ChatOffIcon from './assets/CarbonChatOff.svg';
import ArrowIcon from './assets/IcRoundArrowOutward.svg';

type ViewType = 'weekly' | 'monthly';
type DropdownId = 'novos' | 'fechados' | null;

export default function DashboardPage() {
  const [viewChatsNovos, setViewChatsNovos] = useState<ViewType>('weekly');
  const [viewChatsFechados, setViewChatsFechados] = useState<ViewType>('weekly');
  const [open, setOpen] = useState<DropdownId>(null);

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
    { name: 'Conexão 1', value: 12 },
    { name: 'Conexão 2', value: 8 },
    { name: 'Conexão 3', value: 15 },
    { name: 'Conexão 1', value: 12 },
    { name: 'Conexão 2', value: 8 },
    { name: 'Conexão 3', value: 15 },
  ];

  const dataAtendentes = [
    { name: 'João', value: 20 },
    { name: 'Maria', value: 15 },
    { name: 'Pedro', value: 10 },
    { name: 'João', value: 20 },
    { name: 'Maria', value: 15 },
    { name: 'Pedro', value: 10 },
  ];

  const heightAtedentes = dataAtendentes.length * 50

  const widthConexoes = Math.max(dataConexoes.length * 120, 300)

  const dataConvidados = [
    { name: 'Aceitos', value: 45 },
    { name: 'Pendentes', value: 20 },
    { name: 'Recusados', value: 5 },
  ];

  const COLORS = ['#4f46e5', '#22c55e', '#ef4444'];

  const renderDropdown = (
    view: ViewType,
    setView: React.Dispatch<React.SetStateAction<ViewType>>,
    id: DropdownId
  ) => (
    <div className={PageStyles.containerSelect} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(open === id ? null : id)}
        style={{
          background: '#f3f4f6',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
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
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              listStyle: 'none',
              padding: '4px 0',
              margin: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              zIndex: 100
            }}
          >
            {options.map(opt => (
              <li
                key={opt.value}
                onClick={() => {
                  setView(opt.value as ViewType);
                  setOpen(null);
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  background: opt.value === view ? '#e0e7ff' : 'transparent'
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
        <Button label='Quero Ajuda' />
      </motion.div>

      {/* Linha 1 */}
      <motion.div className={PageStyles.containerRow}>
        {/* Chats Novos */}
        <div className={PageStyles.containerColumnLarge}>
          <div className={PageStyles.headerBoxDashboard}>
            <div className={PageStyles.titlesBoxDashboard}>
              <h2><ChatOnIcon /> Chats Novos</h2>
              <h3>230</h3>
              <div className={PageStyles.rodapeNumero}>
                <span>12% <ArrowIcon /></span>
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
              <h3>180</h3>
              <div className={PageStyles.rodapeNumero}>
                <span>-5% <ArrowIcon /></span>
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
            <h2><ChatOffIcon /> Chats por Atendentes</h2>
            <div className={PageStyles.rodapeNumero}>
              <span>-5% <ArrowIcon /></span>
              <span>-10 comparado ao período anterior</span>
            </div>
          </div>
          <div style={{ height: 200, overflowY: 'auto', paddingRight: 8, width: '100%', scrollbarWidth: 'none' }}>
            <ResponsiveContainer width="100%" height={heightAtedentes} >
              <BarChart layout="vertical" data={dataAtendentes}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" className={PageStyles.barraGraficoSecondary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chats por conexão - scroll horizontal */}
        <div className={PageStyles.containerColumnSmall}>
          <h2>Chats por conexão</h2>
          <div style={{ width: '450px', overflowX: 'scroll', height: 200, scrollbarWidth: 'none' }}>
            <ResponsiveContainer width={widthConexoes} height="100%">
              <LineChart data={dataConexoes}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1b214a90" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Convidados - Gauge semicircular */}
        <div className={PageStyles.containerColumnSmall}>
          <h2>Convidados</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'preenchido', value: 40 },  // exemplo: 65%
                  { name: 'vazio', value: 100 - 40 }
                ]}
                cx="50%"
                cy="90%"              // abaixa o centro para virar meia lua
                innerRadius={60}      // raio interno - controla a espessura
                outerRadius={100}      // raio externo - controla a espessura
                startAngle={180}      // começa do lado esquerdo
                endAngle={0}          // termina do lado direito
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#4f46e5" />                     {/* parte cheia */}
                <Cell fill="rgba(79, 70, 229, 0.2)" />      {/* parte vazia */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Texto central */}
          <div style={{
            position: 'relative',
            top: '-60px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#4f46e5'
          }}>
            40
          </div>
        </div>


      </motion.div>
    </div>
  );
}
