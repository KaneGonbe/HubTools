import React from 'react';
import { Edit2, Trash2, EyeOff } from 'lucide-react';
import { IconButton } from '../common/Button.jsx';

/**
 * 取引リストコンポーネント
 * ダッシュボードとトランザクション画面で使用
 */
const TransactionList = ({
  transactions,
  categories,
  groups = [],
  onEdit,
  onDelete,
  showActions = true,
  showDetails = false,
  limit = null
}) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '未分類';
  };

  const getGroupName = (groupId) => {
    if (!groupId) return '個人';
    const group = groups.find(g => g.id === groupId);
    return group?.name || '個人';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}¥${amount.toLocaleString()}`;
  };

  if (transactions.length === 0) {
    return <div className="empty-state">取引がまだありません</div>;
  }

  if (showDetails) {
    return (
      <div className="transactions-table">
        {displayTransactions.map(transaction => (
          <div key={transaction.id} className="transaction-row">
            <div className="transaction-date-col">
              {formatDate(transaction.transaction_date)}
            </div>
            <div className="transaction-type-col">
              <span className={`type-badge ${transaction.type}`}>
                {transaction.type === 'income' ? '収入' : '支出'}
              </span>
            </div>
            <div className="transaction-category-col">
              {getCategoryName(transaction.category_id)}
            </div>
            <div className="transaction-description-col">
              {transaction.description}
            </div>
            <div className="transaction-group-col">
              {getGroupName(transaction.group_id)}
              {!transaction.is_public && <EyeOff size={14} className="private-icon" />}
            </div>
            <div className={`transaction-amount-col ${transaction.type}`}>
              {formatAmount(transaction.amount, transaction.type)}
            </div>
            {showActions && (
              <div className="transaction-actions-col">
                <IconButton icon={Edit2} onClick={() => onEdit(transaction)} />
                <IconButton icon={Trash2} onClick={() => onDelete(transaction.id)} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="transactions-list">
      {displayTransactions.map(transaction => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-info">
            <div className="transaction-category">
              {getCategoryName(transaction.category_id)}
            </div>
            <div className="transaction-description">
              {transaction.description}
            </div>
            <div className="transaction-date">
              {formatDate(transaction.transaction_date)}
            </div>
          </div>
          <div className={`transaction-amount ${transaction.type}`}>
            {formatAmount(transaction.amount, transaction.type)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
