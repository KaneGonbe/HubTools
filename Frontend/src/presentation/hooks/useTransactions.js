import { useState, useCallback, useMemo } from 'react';
import { Transaction } from '../../domain/entities/Transaction.js';
import { MOCK_CATEGORIES } from '../../domain/entities/Category.js';
import TransactionService from '../../domain/services/TransactionService.js';

/**
 * 取引の初期フォームデータ
 */
const getInitialFormData = () => ({
  type: 'expense',
  amount: '',
  category_id: '',
  transaction_date: new Date().toISOString().split('T')[0],
  description: '',
  group_id: null,
  is_public: true
});

/**
 * 取引の状態を管理するカスタムフック
 */
export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [categories] = useState(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());
  const [filters, setFilters] = useState({
    groupId: 'all',
    type: 'all'
  });

  /**
   * サマリーを計算
   */
  const summary = useMemo(() => {
    return TransactionService.calculateSummary(transactions, filters);
  }, [transactions, filters]);

  /**
   * カテゴリ別内訳を計算
   */
  const categoryBreakdown = useMemo(() => {
    return TransactionService.getCategoryBreakdown(transactions, categories, filters);
  }, [transactions, categories, filters]);

  /**
   * フィルタリングされた取引を取得
   */
  const filteredTransactions = useMemo(() => {
    return TransactionService.filterTransactions(transactions, filters);
  }, [transactions, filters]);

  /**
   * フォームをリセット
   */
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setEditingTransaction(null);
    setIsModalOpen(false);
  }, []);

  /**
   * 取引を追加または更新
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const transaction = TransactionService.createTransaction(
      formData,
      userId,
      editingTransaction?.id
    );

    if (editingTransaction) {
      setTransactions(prev => TransactionService.updateTransaction(prev, transaction));
    } else {
      setTransactions(prev => TransactionService.addTransaction(prev, transaction));
    }

    resetForm();
  }, [formData, userId, editingTransaction, resetForm]);

  /**
   * 編集モードを開始
   */
  const handleEdit = useCallback((transaction) => {
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
  }, []);

  /**
   * 取引を削除
   */
  const handleDelete = useCallback((id) => {
    if (window.confirm('この取引を削除しますか?')) {
      setTransactions(prev => TransactionService.deleteTransaction(prev, id));
    }
  }, []);

  /**
   * モーダルを開く
   */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * フィルターを更新
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    transactions,
    filteredTransactions,
    categories,
    summary,
    categoryBreakdown,
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
  };
};

export default useTransactions;
