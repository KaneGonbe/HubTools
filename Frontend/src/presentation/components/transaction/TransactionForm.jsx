import React from 'react';
import Button from '../common/Button.jsx';

/**
 * 取引フォームコンポーネント
 * 取引の追加・編集に使用
 */
const TransactionForm = ({
  formData,
  categories,
  groups,
  isEditing = false,
  onSubmit,
  onCancel,
  onChange
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <form onSubmit={onSubmit} className="transaction-form">
      <div className="form-row">
        <div className="form-group">
          <label>種別</label>
          <div className="radio-group">
            <label className={formData.type === 'income' ? 'active' : ''}>
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleFieldChange('type', e.target.value)}
              />
              収入
            </label>
            <label className={formData.type === 'expense' ? 'active' : ''}>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleFieldChange('type', e.target.value)}
              />
              支出
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>金額 *</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleFieldChange('amount', e.target.value)}
            placeholder="10000"
            required
          />
        </div>

        <div className="form-group">
          <label>日付 *</label>
          <input
            type="date"
            value={formData.transaction_date}
            onChange={(e) => handleFieldChange('transaction_date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>カテゴリ *</label>
        <select
          value={formData.category_id}
          onChange={(e) => handleFieldChange('category_id', parseInt(e.target.value))}
          required
        >
          <option value="">選択してください</option>
          {filteredCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>メモ</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="説明を入力..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>グループ</label>
        <select
          value={formData.group_id || ''}
          onChange={(e) => handleFieldChange('group_id', e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">個人</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.is_public}
            onChange={(e) => handleFieldChange('is_public', e.target.checked)}
          />
          グループメンバーに公開
        </label>
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button variant="primary" type="submit">
          {isEditing ? '更新' : '追加'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
