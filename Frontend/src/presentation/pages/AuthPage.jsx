import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

/**
 * 認証ページコンポーネント
 */
const AuthPage = ({ onLogin, error: externalError, loading: externalLoading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    settlement_start_day: 25
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const displayError = externalError || error;
  const isLoading = externalLoading || loading;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">¥</span>
            <h1>Kakeibo</h1>
          </div>
          <p className="tagline">シンプルで使いやすい家計簿アプリ</p>
        </div>

        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            <LogIn size={18} />
            ログイン
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus size={18} />
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && <div className="error-message">{displayError}</div>}

          {!isLogin && (
            <div className="form-group">
              <label>お名前</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="山田太郎"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>締め日（集計開始日）</label>
              <select
                name="settlement_start_day"
                value={formData.settlement_start_day}
                onChange={handleChange}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}日</option>
                ))}
              </select>
              <small>毎月この日から翌月前日までを1ヶ月として集計します</small>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '処理中...' : (isLogin ? 'ログイン' : '登録')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}
            <button
              className="link-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? '新規登録' : 'ログイン'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
