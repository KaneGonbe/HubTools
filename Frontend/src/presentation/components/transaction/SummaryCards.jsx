import React from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { SummaryCard } from '../common/Card.jsx';

/**
 * サマリーカードコンポーネント
 * 収入、支出、残高を表示
 */
const SummaryCards = ({ summary }) => {
  const formatCurrency = (value) => {
    return `¥${value.toLocaleString()}`;
  };

  return (
    <div className="summary-cards">
      <SummaryCard
        icon={TrendingUp}
        label="収入"
        value={formatCurrency(summary.income)}
        variant="income"
      />
      <SummaryCard
        icon={TrendingDown}
        label="支出"
        value={formatCurrency(summary.expense)}
        variant="expense"
      />
      <SummaryCard
        icon={Calendar}
        label="残高"
        value={formatCurrency(summary.balance)}
        variant={summary.balance >= 0 ? 'balance' : 'expense'}
      />
    </div>
  );
};

/**
 * カテゴリ別内訳コンポーネント
 */
export const CategoryBreakdown = ({ breakdown, limit = 5 }) => {
  const displayBreakdown = limit ? breakdown.slice(0, limit) : breakdown;

  return (
    <div className="category-breakdown">
      <h3>カテゴリ別内訳</h3>
      <div className="breakdown-list">
        {displayBreakdown.map(([category, amount]) => (
          <div key={category} className="breakdown-item">
            <span className="breakdown-category">{category}</span>
            <span className="breakdown-amount">¥{amount.toLocaleString()}</span>
          </div>
        ))}
        {breakdown.length === 0 && (
          <div className="empty-state">データがありません</div>
        )}
      </div>
    </div>
  );
};

export default SummaryCards;
