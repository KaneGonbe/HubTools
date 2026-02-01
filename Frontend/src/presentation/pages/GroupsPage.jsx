import React from 'react';
import { Users } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import useGroups from '../hooks/useGroups.js';

/**
 * グループページコンポーネント
 */
const GroupsPage = () => {
  const { groups } = useGroups();

  const handleCreateGroup = () => {
    // TODO: グループ作成モーダルを開く
    console.log('Create group clicked');
  };

  return (
    <div className="groups-view">
      <div className="groups-header">
        <h2>グループ</h2>
        <Button variant="primary" icon={Users} onClick={handleCreateGroup}>
          グループを作成
        </Button>
      </div>

      <div className="groups-list">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-icon">
              <Users size={24} />
            </div>
            <div className="group-info">
              <h3>{group.name}</h3>
              <span className="group-role">
                {group.role === 'owner' ? 'オーナー' : 'メンバー'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
