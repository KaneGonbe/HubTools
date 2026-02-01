import { Transaction, TransactionType } from '../entities/Transaction.js';

/**
 * トランザクションドメインサービス
 * 取引に関するビジネスロジックを提供
 */
export class TransactionService {
  /**
   * フィルタリング条件に基づいて取引をフィルタリング
   * @param {Transaction[]} transactions - 取引の配列
   * @param {Object} filters - フィルタリング条件
   * @param {string} filters.groupId - グループID ('all' | 'null' | グループID)
   * @param {string} filters.type - 取引タイプ ('all' | 'income' | 'expense')
   * @returns {Transaction[]} フィルタリングされた取引
   */
  static filterTransactions(transactions, { groupId = 'all', type = 'all' } = {}) {
    return transactions.filter(t => {
      if (groupId !== 'all') {
        if (groupId === 'null') {
          if (t.group_id !== null) return false;
        } else {
          if (t.group_id?.toString() !== groupId) return false;
        }
      }
      if (type !== 'all' && t.type !== type) return false;
      return true;
    });
  }

  /**
   * 取引のサマリー（収入、支出、残高）を計算
   * @param {Transaction[]} transactions - 取引の配列
   * @param {Object} filters - フィルタリング条件
   * @returns {Object} サマリー情報
   */
  static calculateSummary(transactions, filters = {}) {
    const filtered = this.filterTransactions(transactions, filters);

    const income = filtered
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }

  /**
   * カテゴリ別の内訳を計算
   * @param {Transaction[]} transactions - 取引の配列
   * @param {Category[]} categories - カテゴリの配列
   * @param {Object} filters - フィルタリング条件
   * @returns {Array} カテゴリ別内訳（[カテゴリ名, 金額]の配列）
   */
  static getCategoryBreakdown(transactions, categories, filters = {}) {
    const filtered = this.filterTransactions(transactions, filters);
    const breakdown = {};

    filtered.forEach(t => {
      const category = categories.find(c => c.id === t.category_id);
      const categoryName = category?.name || '未分類';
      if (!breakdown[categoryName]) {
        breakdown[categoryName] = 0;
      }
      breakdown[categoryName] += t.amount;
    });

    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  }

  /**
   * 新しい取引を作成
   * @param {Object} formData - フォームデータ
   * @param {number} userId - ユーザーID
   * @param {number|null} editingId - 編集中の取引ID（新規作成の場合はnull）
   * @returns {Transaction} 作成された取引
   */
  static createTransaction(formData, userId, editingId = null) {
    return new Transaction({
      id: editingId || Date.now(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id,
      transaction_date: formData.transaction_date,
      description: formData.description,
      group_id: formData.group_id,
      is_public: formData.is_public,
      user_id: userId,
      created_at: new Date().toISOString()
    });
  }

  /**
   * 取引を更新
   * @param {Transaction[]} transactions - 現在の取引配列
   * @param {Transaction} updatedTransaction - 更新された取引
   * @returns {Transaction[]} 更新後の取引配列
   */
  static updateTransaction(transactions, updatedTransaction) {
    return transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
  }

  /**
   * 取引を削除
   * @param {Transaction[]} transactions - 現在の取引配列
   * @param {number} transactionId - 削除する取引ID
   * @returns {Transaction[]} 削除後の取引配列
   */
  static deleteTransaction(transactions, transactionId) {
    return transactions.filter(t => t.id !== transactionId);
  }

  /**
   * 取引を追加
   * @param {Transaction[]} transactions - 現在の取引配列
   * @param {Transaction} newTransaction - 新しい取引
   * @returns {Transaction[]} 追加後の取引配列
   */
  static addTransaction(transactions, newTransaction) {
    return [newTransaction, ...transactions];
  }

  /**
   * 期間でフィルタリング
   * @param {Transaction[]} transactions - 取引の配列
   * @param {Date} startDate - 開始日
   * @param {Date} endDate - 終了日
   * @returns {Transaction[]} フィルタリングされた取引
   */
  static filterByDateRange(transactions, startDate, endDate) {
    return transactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * 取引を日付でソート
   * @param {Transaction[]} transactions - 取引の配列
   * @param {boolean} ascending - 昇順かどうか
   * @returns {Transaction[]} ソートされた取引
   */
  static sortByDate(transactions, ascending = false) {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.transaction_date);
      const dateB = new Date(b.transaction_date);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }
}

export default TransactionService;
