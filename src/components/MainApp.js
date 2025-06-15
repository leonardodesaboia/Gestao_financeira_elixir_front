import React from 'react';
import { useAuth } from '../contexts/authContext';
import Login from './auth/Login';
import Dashboard from './dashboard/Dashboard';

const MainApp = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
};

export default MainApp;