import { useState, useCallback } from 'react';
import { MOCK_GROUPS } from '../../domain/entities/Group.js';

/**
 * グループの状態を管理するカスタムフック
 */
export const useGroups = () => {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * グループを作成
   */
  const createGroup = useCallback(async (groupData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await groupAPI.create(groupData);
      // const newGroup = Group.fromPlainObject(response.data);
      // setGroups(prev => [...prev, newGroup]);
      // return newGroup;

      // モック実装
      const newGroup = {
        id: Date.now(),
        name: groupData.name,
        role: 'owner'
      };
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (err) {
      const message = err.response?.data?.message || 'グループの作成に失敗しました';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * グループを更新
   */
  const updateGroup = useCallback(async (groupId, groupData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await groupAPI.update(groupId, groupData);
      // setGroups(prev => prev.map(g => g.id === groupId ? Group.fromPlainObject(response.data) : g));

      // モック実装
      setGroups(prev => prev.map(g =>
        g.id === groupId ? { ...g, ...groupData } : g
      ));
    } catch (err) {
      const message = err.response?.data?.message || 'グループの更新に失敗しました';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * グループを削除
   */
  const deleteGroup = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // await groupAPI.delete(groupId);
      // setGroups(prev => prev.filter(g => g.id !== groupId));

      // モック実装
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err) {
      const message = err.response?.data?.message || 'グループの削除に失敗しました';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    clearError
  };
};

export default useGroups;
