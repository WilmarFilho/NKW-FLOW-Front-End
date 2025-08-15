// Libs
import { ReactNode } from 'react';
// Css
import Styles from './MetricCard.module.css';
// Icon 
import Icon from '../../../components/Gerais/Icons/Icons';

interface MetricCardProps {
  title: string;
  icon?: ReactNode;
  value?: string;
  variation?: string;
  variationText?: string;
  dropdown?: ReactNode;
  children?: ReactNode;
  small?: boolean;
}

export default function MetricCard({
  title,
  icon,
  value,
  variation,
  variationText,
  dropdown,
  children,
  small
}: MetricCardProps) {
  const cardClass = small ? Styles.metricCardSmall : Styles.metricCard;

  return (
    <div className={cardClass}>
      <div className={Styles.metricCardHeader}>
        <div className={Styles.metricCardTitles}>
          <h2>{icon} {title}</h2>
          {value && <h3>{value}</h3>}
          {variation && variationText && (
            <div className={Styles.metricCardFooterStat}>
              <strong>{variation}<Icon nome='arrowfine' /></strong>
              <span>{variationText}</span>
            </div>
          )}
        </div>
        {dropdown}
      </div>
      {children}
    </div>
  );
}