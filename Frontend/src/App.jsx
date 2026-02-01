import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import AuthPage from './presentation/pages/AuthPage.jsx';
import DashboardPage from './presentation/pages/DashboardPage.jsx';
import TransactionsPage from './presentation/pages/TransactionsPage.jsx';
import GroupsPage from './presentation/pages/GroupsPage.jsx';
import useAuth from './presentation/hooks/useAuth.js';

const App = () => {
  const { user, loading, error, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={login} error={error} loading={loading} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage user={user} />;
      case 'transactions':
        return <TransactionsPage user={user} />;
      case 'groups':
        return <GroupsPage />;
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="logo-icon">¥</span>
            Kakeibo
          </h1>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button
              className="btn-icon"
              onClick={logout}
              title="ログアウト"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          ダッシュボード
        </button>
        <button
          className={currentView === 'transactions' ? 'active' : ''}
          onClick={() => setCurrentView('transactions')}
        >
          取引履歴
        </button>
        <button
          className={currentView === 'groups' ? 'active' : ''}
          onClick={() => setCurrentView('groups')}
        >
          グループ
        </button>
      </nav>

      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default App;
