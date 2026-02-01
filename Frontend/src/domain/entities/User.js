/**
 * ユーザーエンティティ
 * ドメインモデルとしてユーザーの構造を定義
 */
export class User {
  constructor({
    id = null,
    name = '',
    email = '',
    settlement_start_day = 25
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.settlement_start_day = settlement_start_day;
  }

  /**
   * 現在の締め期間の開始日を取得
   */
  getCurrentPeriodStart() {
    const today = new Date();
    const currentDay = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();

    if (currentDay >= this.settlement_start_day) {
      return new Date(year, month, this.settlement_start_day);
    } else {
      return new Date(year, month - 1, this.settlement_start_day);
    }
  }

  /**
   * 現在の締め期間の終了日を取得
   */
  getCurrentPeriodEnd() {
    const start = this.getCurrentPeriodStart();
    const endMonth = start.getMonth() + 1;
    const endYear = endMonth > 11 ? start.getFullYear() + 1 : start.getFullYear();
    return new Date(endYear, endMonth % 12, this.settlement_start_day - 1);
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      settlement_start_day: this.settlement_start_day
    };
  }

  /**
   * プレーンオブジェクトからUserインスタンスを作成
   */
  static fromPlainObject(obj) {
    return new User(obj);
  }
}

/**
 * モックユーザーデータ（開発用）
 */
export const MOCK_USER = new User({
  id: 1,
  name: '山田太郎',
  email: 'yamada@example.com',
  settlement_start_day: 25
});

export default User;
