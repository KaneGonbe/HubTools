import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Users, Calendar, Filter, X, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

// モックデータ（後でAPIと接続）
const MOCK_USER = {
  id: 1,
  name: '山田太郎',
  email: 'yamada@example.com',
  settlement_start_day: 25
};

const MOCK_CATEGORIES = [
  { id: 1, name: '給料', type: 'income', is_default: true },
  { id: 2, name: '副業', type: 'income', is_default: true },
  { id: 3, name: '食費', type: 'expense', is_default: true },
  { id: 4, name: '交通費', type: 'expense', is_default: true },
  { id: 5, name: '光熱費', type: 'expense', is_default: true },
  { id: 6, name: '娯楽費', type: 'expense', is_default: true },
];

const MOCK_GROUPS = [
  { id: 1, name: '家族', role: 'owner' },
  { id: 2, name: '友人グループ', role: 'member' }
];

const KakeiboApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // フォーム状態
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    group_id: null,
    is_public: true
  });

  // 集計データ計算
  const calculateSummary = () => {
    const filtered = transactions.filter(t => {
      if (filterGroup !== 'all' && t.group_id?.toString() !== filterGroup) return false;
      if (filterType !== 'all' && t.type !== filterType) return false;
      return true;
    });

    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  };

  const summary = calculateSummary();

  // カテゴリ別集計
  const getCategoryBreakdown = () => {
    const breakdown = {};
    transactions
      .filter(t => filterType === 'all' || t.type === filterType)
      .forEach(t => {
        const category = categories.find(c => c.id === t.category_id);
        const categoryName = category?.name || '未分類';
        if (!breakdown[categoryName]) {
          breakdown[categoryName] = 0;
        }
        breakdown[categoryName] += t.amount;
      });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  };

  // トランザクション追加・編集
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      id: editingTransaction?.id || Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      user_id: MOCK_USER.id,
      created_at: new Date().toISOString()
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? newTransaction : t
      ));
    } else {
      setTransactions([newTransaction, ...transactions]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      description: '',
      group_id: null,
      is_public: true
    });
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category_id: transaction.category_id,
      transaction_date: transaction.transaction_date,
      description: transaction.description,
      group_id: transaction.group_id,
      is_public: transaction.is_public
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('この取引を削除しますか?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="app-container">
      {/* ヘッダー */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="logo-icon">¥</span>
            Kakeibo
          </h1>
          <div className="user-info">
            <span className="user-name">{MOCK_USER.name}</span>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="app-nav">
        <button 
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          ダッシュボード
        </button>
        <button 
          className={currentView === 'transactions' ? 'active' : ''}
          onClick={() => setCurrentView('transactions')}
        >
          取引履歴
        </button>
        <button 
          className={currentView === 'groups' ? 'active' : ''}
          onClick={() => setCurrentView('groups')}
        >
          グループ
        </button>
      </nav>

      <main className="app-main">
        {/* ダッシュボードビュー */}
        {currentView === 'dashboard' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h2>今月の収支</h2>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <PlusCircle size={20} />
                取引を追加
              </button>
            </div>

            {/* サマリーカード */}
            <div className="summary-cards">
              <div className="summary-card income-card">
                <div className="card-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="card-content">
                  <div className="card-label">収入</div>
                  <div className="card-value income">¥{summary.income.toLocaleString()}</div>
                </div>
              </div>

              <div className="summary-card expense-card">
                <div className="card-icon">
                  <TrendingDown size={24} />
                </div>
                <div className="card-content">
                  <div className="card-label">支出</div>
                  <div className="card-value expense">¥{summary.expense.toLocaleString()}</div>
                </div>
              </div>

              <div className="summary-card balance-card">
                <div className="card-icon">
                  <Calendar size={24} />
                </div>
                <div className="card-content">
                  <div className="card-label">残高</div>
                  <div className={`card-value ${summary.balance >= 0 ? 'income' : 'expense'}`}>
                    ¥{summary.balance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリ別内訳 */}
            <div className="category-breakdown">
              <h3>カテゴリ別内訳</h3>
              <div className="breakdown-list">
                {getCategoryBreakdown().slice(0, 5).map(([category, amount]) => (
                  <div key={category} className="breakdown-item">
                    <span className="breakdown-category">{category}</span>
                    <span className="breakdown-amount">¥{amount.toLocaleString()}</span>
                  </div>
                ))}
                {getCategoryBreakdown().length === 0 && (
                  <div className="empty-state">データがありません</div>
                )}
              </div>
            </div>

            {/* 最近の取引 */}
            <div className="recent-transactions">
              <h3>最近の取引</h3>
              <div className="transactions-list">
                {transactions.slice(0, 5).map(transaction => {
                  const category = categories.find(c => c.id === transaction.category_id);
                  return (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-category">{category?.name || '未分類'}</div>
                        <div className="transaction-description">{transaction.description}</div>
                        <div className="transaction-date">
                          {new Date(transaction.transaction_date).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
                {transactions.length === 0 && (
                  <div className="empty-state">取引がまだありません</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 取引履歴ビュー */}
        {currentView === 'transactions' && (
          <div className="transactions-view">
            <div className="transactions-header">
              <h2>取引履歴</h2>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                <PlusCircle size={20} />
                取引を追加
              </button>
            </div>

            {/* フィルター */}
            <div className="filters">
              <div className="filter-group">
                <label>種別</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">すべて</option>
                  <option value="income">収入</option>
                  <option value="expense">支出</option>
                </select>
              </div>
              <div className="filter-group">
                <label>グループ</label>
                <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
                  <option value="all">すべて</option>
                  <option value="null">個人</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 取引リスト */}
            <div className="transactions-table">
              {transactions.map(transaction => {
                const category = categories.find(c => c.id === transaction.category_id);
                const group = groups.find(g => g.id === transaction.group_id);
                return (
                  <div key={transaction.id} className="transaction-row">
                    <div className="transaction-date-col">
                      {new Date(transaction.transaction_date).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="transaction-type-col">
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type === 'income' ? '収入' : '支出'}
                      </span>
                    </div>
                    <div className="transaction-category-col">{category?.name || '未分類'}</div>
                    <div className="transaction-description-col">{transaction.description}</div>
                    <div className="transaction-group-col">
                      {group?.name || '個人'}
                      {!transaction.is_public && <EyeOff size={14} className="private-icon" />}
                    </div>
                    <div className={`transaction-amount-col ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                    </div>
                    <div className="transaction-actions-col">
                      <button className="btn-icon" onClick={() => handleEdit(transaction)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="empty-state">取引がまだありません</div>
              )}
            </div>
          </div>
        )}

        {/* グループビュー */}
        {currentView === 'groups' && (
          <div className="groups-view">
            <div className="groups-header">
              <h2>グループ</h2>
              <button className="btn-primary">
                <Users size={20} />
                グループを作成
              </button>
            </div>

            <div className="groups-list">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-icon">
                    <Users size={24} />
                  </div>
                  <div className="group-info">
                    <h3>{group.name}</h3>
                    <span className="group-role">{group.role === 'owner' ? 'オーナー' : 'メンバー'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* モーダル - 取引追加/編集 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? '取引を編集' : '取引を追加'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
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
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      />
                      収入
                    </label>
                    <label className={formData.type === 'expense' ? 'active' : ''}>
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={formData.type === 'expense'}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="10000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>日付 *</label>
                  <input
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>カテゴリ *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                  required
                >
                  <option value="">選択してください</option>
                  {categories
                    .filter(c => c.type === formData.type)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label>メモ</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="説明を入力..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>グループ</label>
                <select
                  value={formData.group_id || ''}
                  onChange={(e) => setFormData({...formData, group_id: e.target.value ? parseInt(e.target.value) : null})}
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
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                  />
                  グループメンバーに公開
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  キャンセル
                </button>
                <button type="submit" className="btn-primary">
                  {editingTransaction ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .app-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
          font-size: 1.75rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-weight: 600;
          color: #4a5568;
        }

        .app-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .app-nav button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .app-nav button:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .app-nav button.active {
          background: white;
          color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .app-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 2rem 2rem;
        }

        .dashboard-header,
        .transactions-header,
        .groups-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h2,
        .transactions-header h2,
        .groups-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
          padding: 0.875rem 1.5rem;
          background: #e5e7eb;
          color: #4a5568;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .income-card .card-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .expense-card .card-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .balance-card .card-icon {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .card-content {
          flex: 1;
        }

        .card-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .card-value.income {
          color: #10b981;
        }

        .card-value.expense {
          color: #ef4444;
        }

        .category-breakdown,
        .recent-transactions {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .category-breakdown h3,
        .recent-transactions h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .breakdown-item:hover {
          background: #f3f4f6;
        }

        .breakdown-category {
          font-weight: 600;
          color: #4a5568;
        }

        .breakdown-amount {
          font-weight: 700;
          color: #2d3748;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: #f9fafb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .transaction-item:hover {
          background: #f3f4f6;
        }

        .transaction-info {
          flex: 1;
        }

        .transaction-category {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .transaction-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .transaction-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .transaction-amount {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .transaction-amount.income {
          color: #10b981;
        }

        .transaction-amount.expense {
          color: #ef4444;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-group {
          flex: 1;
        }

        .filter-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }

        .filter-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #10b981;
          background: white;
        }

        .transactions-table {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .transaction-row {
          display: grid;
          grid-template-columns: 100px 80px 120px 1fr 120px 120px 80px;
          gap: 1rem;
          align-items: center;
          padding: 1.25rem;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .transaction-row:last-child {
          border-bottom: none;
        }

        .transaction-row:hover {
          background: #f9fafb;
        }

        .type-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .type-badge.income {
          background: #d1fae5;
          color: #059669;
        }

        .type-badge.expense {
          background: #fee2e2;
          color: #dc2626;
        }

        .transaction-actions-col {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          padding: 0.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: #e5e7eb;
          color: #2d3748;
        }

        .private-icon {
          color: #9ca3af;
          margin-left: 0.5rem;
        }

        .groups-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .group-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .group-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .group-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .group-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .group-role {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .btn-close {
          padding: 0.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .btn-close:hover {
          background: #e5e7eb;
          color: #2d3748;
        }

        .transaction-form {
          padding: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .form-group input[type="number"],
        .form-group input[type="date"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #10b981;
        }

        .radio-group {
          display: flex;
          gap: 1rem;
        }

        .radio-group label {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .radio-group label.active {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .radio-group input {
          display: none;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-group input {
          width: auto;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #9ca3af;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 1rem;
          }

          .app-title {
            font-size: 1.5rem;
          }

          .app-nav {
            padding: 0 1rem;
            overflow-x: auto;
          }

          .app-main {
            padding: 0 1rem 1rem;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .transaction-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default KakeiboApp;
