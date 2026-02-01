import React from 'react';

/**
 * 再利用可能なカードコンポーネント
 */
const Card = ({
  children,
  className = '',
  padding = '2rem'
}) => {
  return (
    <div className={`card ${className}`} style={{ padding }}>
      {children}
    </div>
  );
};

/**
 * カードヘッダーコンポーネント
 */
export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

/**
 * カードボディコンポーネント
 */
export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

/**
 * サマリーカードコンポーネント
 */
export const SummaryCard = ({
  icon: Icon,
  label,
  value,
  variant = 'default',
  className = ''
}) => {
  const cardClass = `summary-card ${variant}-card ${className}`;
  const valueClass = `card-value ${variant === 'income' ? 'income' : variant === 'expense' ? 'expense' : ''}`;

  return (
    <div className={cardClass}>
      {Icon && (
        <div className="card-icon">
          <Icon size={24} />
        </div>
      )}
      <div className="card-content">
        <div className="card-label">{label}</div>
        <div className={valueClass}>{value}</div>
      </div>
    </div>
  );
};

export default Card;
