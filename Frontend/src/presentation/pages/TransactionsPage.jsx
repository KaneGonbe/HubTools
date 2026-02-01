import React from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import TransactionList from '../components/transaction/TransactionList.jsx';
import TransactionForm from '../components/transaction/TransactionForm.jsx';
import useTransactions from '../hooks/useTransactions.js';
import useGroups from '../hooks/useGroups.js';

/**
 * 取引履歴ページコンポーネント
 */
const TransactionsPage = ({ user }) => {
  const { groups } = useGroups();
  const {
    filteredTransactions,
    categories,
    isModalOpen,
    editingTransaction,
    formData,
    filters,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    openModal,
    updateFilters
  } = useTransactions(user?.id);

  return (
    <div className="transactions-view">
      <div className="transactions-header">
        <h2>取引履歴</h2>
        <Button variant="primary" icon={PlusCircle} onClick={openModal}>
          取引を追加
        </Button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>種別</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value })}
          >
            <option value="all">すべて</option>
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div className="filter-group">
          <label>グループ</label>
          <select
            value={filters.groupId}
            onChange={(e) => updateFilters({ groupId: e.target.value })}
          >
            <option value="all">すべて</option>
            <option value="null">個人</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <TransactionList
        transactions={filteredTransactions}
        categories={categories}
        groups={groups}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={true}
        showDetails={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTransaction ? '取引を編集' : '取引を追加'}
      >
        <TransactionForm
          formData={formData}
          categories={categories}
          groups={groups}
          isEditing={!!editingTransaction}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onChange={setFormData}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
