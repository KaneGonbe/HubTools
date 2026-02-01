/**
 * グループエンティティ
 * ドメインモデルとしてグループの構造を定義
 */
export class Group {
  constructor({
    id = null,
    name = '',
    role = 'member'
  } = {}) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  /**
   * オーナーかどうかを判定
   */
  isOwner() {
    return this.role === 'owner';
  }

  /**
   * メンバーかどうかを判定
   */
  isMember() {
    return this.role === 'member';
  }

  /**
   * ロールの表示名を取得
   */
  getRoleDisplayName() {
    return this.isOwner() ? 'オーナー' : 'メンバー';
  }

  /**
   * プレーンオブジェクトに変換
   */
  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      role: this.role
    };
  }

  /**
   * プレーンオブジェクトからGroupインスタンスを作成
   */
  static fromPlainObject(obj) {
    return new Group(obj);
  }
}

/**
 * グループロールの定数
 */
export const GroupRole = {
  OWNER: 'owner',
  MEMBER: 'member'
};

/**
 * モックグループデータ（開発用）
 */
export const MOCK_GROUPS = [
  new Group({ id: 1, name: '家族', role: 'owner' }),
  new Group({ id: 2, name: '友人グループ', role: 'member' })
];

export default Group;
