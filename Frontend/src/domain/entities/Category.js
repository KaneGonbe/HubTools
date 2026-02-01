/**
 * カテゴリエンティティ
 * ドメインモデルとしてカテゴリの構造を定義
 */
export class Category {
  constructor({
    id = null,
    name = '',
    type = 'expense',
    is_default = false
  } = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.is_default = is_default;
  }

  /**
   * 収入カテゴリかどうかを判定
   */
  isIncomeCategory() {
    return this.type === 'income';
  }

  /**
   * 支出カテゴリかどうかを判定
   */
  isExpenseCategory() {
    return this.type === 'expense';
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      is_default: this.is_default
    };
  }

  /**
   * プレーンオブジェクトからCategoryインスタンスを作成
   */
  static fromPlainObject(obj) {
    return new Category(obj);
  }
}

/**
 * カテゴリタイプの定数
 */
export const CategoryType = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

/**
 * モックカテゴリデータ（開発用）
 */
export const MOCK_CATEGORIES = [
  new Category({ id: 1, name: '給料', type: 'income', is_default: true }),
  new Category({ id: 2, name: '副業', type: 'income', is_default: true }),
  new Category({ id: 3, name: '食費', type: 'expense', is_default: true }),
  new Category({ id: 4, name: '交通費', type: 'expense', is_default: true }),
  new Category({ id: 5, name: '光熱費', type: 'expense', is_default: true }),
  new Category({ id: 6, name: '娯楽費', type: 'expense', is_default: true }),
];

export default Category;
