// Libs
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, LabelList } from 'recharts';
// Css
import Styles from './LineMetricChart.module.css';

interface LineMetricChartProps {
  data: unknown[];
  dataKey: string;
  width?: number;
}

export default function LineMetricChart({
  data,
  dataKey,
  width = 400
}: LineMetricChartProps) {
  return (
    <ResponsiveContainer width={width} height="100%">
      <LineChart data={data} margin={{ top: 60, right: 50, left: 50, bottom: 5 }}>
        <XAxis interval={0} dataKey="name" axisLine={false} tickLine={false} dy={10} />
        <YAxis hide />
        <Line
          type="natural"
          dataKey={dataKey}
          stroke="#9ca3af"
          strokeWidth={3}
          dot={{ r: 6, stroke: '#9ca3af', strokeWidth: 2, fill: 'white' }}
          isAnimationActive={false}
        >
          <LabelList dataKey={dataKey} position="top" offset={15} className={Styles.chartLabelConnectionValue} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}