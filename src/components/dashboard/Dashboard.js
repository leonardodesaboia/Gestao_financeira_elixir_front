import React, { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState(null);
  const { request } = useApi();

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Carregando dados...');
      
      const [transactionsData, tagsData] = await Promise.all([
        request('/transactions'),
        request('/tags')
      ]);
      
      console.log('Dados carregados:', { transactionsData, tagsData });
      
      // Garantir que são arrays
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setTags(Array.isArray(tagsData) ? tagsData : []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(error.message);
      setTransactions([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalReceitas = transactions
    .filter(t => t.type === 'RECEITA')
    .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'DESPESA')
    .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

  const saldo = totalReceitas - totalDespesas;

  if (loading) {
    return (
      <div className="loading">
        <div>Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Header user={user} onLogout={onLogout} />
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>Erro ao carregar dados</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={loadData}
            className="btn btn-primary"
          >
            Tentar novamente
          </button>
        </div>
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

      {/* Componente de Debug - descomente a linha abaixo para ativar */}
      {/* <DataDebug transactions={transactions} tags={tags} /> */}
    </div>
  );
};

export default Dashboard;