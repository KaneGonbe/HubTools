import { useState, useEffect, useCallback } from 'react';
import { User, MOCK_USER } from '../../domain/entities/User.js';

/**
 * 認証状態を管理するカスタムフック
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: トークンの検証とユーザー情報の取得
      // authAPI.getProfile().then(response => {
      //   setUser(User.fromPlainObject(response.data));
      // }).catch(() => {
      //   localStorage.removeItem('token');
      // });

      // モックユーザー（後で実装）
      setUser(MOCK_USER);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (formData) => {
    setError('');
    setLoading(true);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await authAPI.login({
      //   email: formData.email,
      //   password: formData.password
      // });
      // localStorage.setItem('token', response.data.token);
      // setUser(User.fromPlainObject(response.data.user));

      // モック認証
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);

      const userData = new User({
        id: 1,
        name: formData.name || '山田太郎',
        email: formData.email,
        settlement_start_day: formData.settlement_start_day || 25
      });

      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'エラーが発生しました';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setError('');
    setLoading(true);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await authAPI.register(formData);
      // localStorage.setItem('token', response.data.token);
      // setUser(User.fromPlainObject(response.data.user));

      // モック登録
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);

      const userData = new User({
        id: 1,
        name: formData.name,
        email: formData.email,
        settlement_start_day: formData.settlement_start_day
      });

      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'エラーが発生しました';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError
  };
};

export default useAuth;
