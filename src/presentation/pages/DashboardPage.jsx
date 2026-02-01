import React from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import Card from '../components/common/Card.jsx';
import SummaryCards, { CategoryBreakdown } from '../components/transaction/SummaryCards.jsx';
import TransactionList from '../components/transaction/TransactionList.jsx';
import TransactionForm from '../components/transaction/TransactionForm.jsx';
import useTransactions from '../hooks/useTransactions.js';
import useGroups from '../hooks/useGroups.js';

/**
 * ダッシュボードページコンポーネント
 */
const DashboardPage = ({ user }) => {
  const { groups } = useGroups();
  const {
    transactions,
    categories,
    summary,
    categoryBreakdown,
    isModalOpen,
    editingTransaction,
    formData,
    setFormData,
    handleSubmit,
    resetForm,
    openModal
  } = useTransactions(user?.id);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>今月の収支</h2>
        <Button variant="primary" icon={PlusCircle} onClick={openModal}>
          取引を追加
        </Button>
      </div>

      <SummaryCards summary={summary} />

      <Card className="category-breakdown">
        <CategoryBreakdown breakdown={categoryBreakdown} limit={5} />
      </Card>

      <Card className="recent-transactions">
        <h3>最近の取引</h3>
        <TransactionList
          transactions={transactions}
          categories={categories}
          limit={5}
          showActions={false}
        />
      </Card>

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

export default DashboardPage;
