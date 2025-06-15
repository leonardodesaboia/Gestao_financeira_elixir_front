import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import DashboardContent from './DashboardContent';
import TransactionsContent from '../transactions/TransactionsContent';
import TagsContent from '../tags/TagsContent';
import useApi from '../../hooks/useAPI';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, tagsData] = await Promise.all([
        request('/transactions'),
        request('/tags')
      ]);
      setTransactions(transactionsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReceitas = transactions
    .filter(t => t.tipo === 'RECEITA')
    .reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);

  const totalDespesas = transactions
    .filter(t => t.tipo === 'DESPESA')
    .reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);

  const saldo = totalReceitas - totalDespesas;

  if (loading) {
    return (
      <div className="loading">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      
      <div className="dashboard-content">
        <div className="container">
          {/* Navegação */}
          <nav className="dashboard-nav">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
              { id: 'transactions', label: 'Transações', icon: 'fas fa-exchange-alt' },
              { id: 'tags', label: 'Categorias', icon: 'fas fa-tags' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Conteúdo das abas */}
          <div className="tab-content">
            {activeTab === 'dashboard' && (
              <DashboardContent 
                totalReceitas={totalReceitas}
                totalDespesas={totalDespesas}
                saldo={saldo}
                transactions={transactions}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsContent 
                transactions={transactions}
                tags={tags}
                onUpdate={loadData}
              />
            )}

            {activeTab === 'tags' && (
              <TagsContent 
                tags={tags}
                onUpdate={loadData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;