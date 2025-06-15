import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="header-title">Gestão Financeira</h1>
          <div className="header-user">
            <span className="user-name">Olá, {user.name}</span>
            <button onClick={onLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;