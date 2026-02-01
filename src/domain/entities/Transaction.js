/**
 * 取引エンティティ
 * ドメインモデルとして取引の構造とバリデーションを定義
 */
export class Transaction {
  constructor({
    id = null,
    type = 'expense',
    amount = 0,
    category_id = null,
    transaction_date = new Date().toISOString().split('T')[0],
    description = '',
    group_id = null,
    is_public = true,
    user_id = null,
    created_at = null
  } = {}) {
    this.id = id;
    this.type = type;
    this.amount = parseFloat(amount) || 0;
    this.category_id = category_id;
    this.transaction_date = transaction_date;
    this.description = description;
    this.group_id = group_id;
    this.is_public = is_public;
    this.user_id = user_id;
    this.created_at = created_at || new Date().toISOString();
  }

  /**
   * 収入かどうかを判定
   */
  isIncome() {
    return this.type === 'income';
  }

  /**
   * 支出かどうかを判定
   */
  isExpense() {
    return this.type === 'expense';
  }

  /**
   * グループ取引かどうかを判定
   */
  isGroupTransaction() {
    return this.group_id !== null;
  }

  /**
   * フォーマットされた金額を取得
   */
  getFormattedAmount() {
    const prefix = this.isIncome() ? '+' : '-';
    return `${prefix}¥${this.amount.toLocaleString()}`;
  }

  /**
   * フォーマットされた日付を取得
   */
  getFormattedDate() {
    return new Date(this.transaction_date).toLocaleDateString('ja-JP');
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject() {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      category_id: this.category_id,
      transaction_date: this.transaction_date,
      description: this.description,
      group_id: this.group_id,
      is_public: this.is_public,
      user_id: this.user_id,
      created_at: this.created_at
    };
  }

  /**
   * フォームデータに変換
   */
  toFormData() {
    return {
      type: this.type,
      amount: this.amount.toString(),
      category_id: this.category_id,
      transaction_date: this.transaction_date,
      description: this.description,
      group_id: this.group_id,
      is_public: this.is_public
    };
  }

  /**
   * プレーンオブジェクトからTransactionインスタンスを作成
   */
  static fromPlainObject(obj) {
    return new Transaction(obj);
  }

  /**
   * 新しいIDでトランザクションを複製
   */
  clone(newId = null) {
    return new Transaction({
      ...this.toPlainObject(),
      id: newId || Date.now()
    });
  }
}

/**
 * トランザクションタイプの定数
 */
export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export default Transaction;
