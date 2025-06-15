import React from 'react';
import './DashboardContent.css';

const DashboardContent = ({ totalReceitas, totalDespesas, saldo, transactions }) => {
  return (
    <div className="dashboard-content-wrapper">
      {/* Cards de resumo */}
      <div className="summary-cards">
        <div className="summary-card receitas">
          <div className="card-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className="card-info">
            <p className="card-label">Receitas</p>
            <p className="card-value">R$ {totalReceitas.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card despesas">
          <div className="card-icon">
            <i className="fas fa-arrow-down"></i>
          </div>
          <div className="card-info">
            <p className="card-label">Despesas</p>
            <p className="card-value">R$ {totalDespesas.toFixed(2)}</p>
          </div>
        </div>

        <div className={`summary-card ${saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo'}`}>
          <div className="card-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="card-info">
            <p className="card-label">Saldo</p>
            <p className="card-value">R$ {saldo.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Transações recentes */}
      <div className="recent-transactions card">
        <div className="section-header">
          <h3>Transações Recentes</h3>
        </div>
        <div className="transactions-list">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <div className={`transaction-indicator ${transaction.tipo.toLowerCase()}`}></div>
                <div className="transaction-details">
                  <p className="transaction-description">{transaction.descricao}</p>
                  <p className="transaction-date">
                    {new Date(transaction.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.tipo.toLowerCase()}`}>
                {transaction.tipo === 'RECEITA' ? '+' : '-'}R$ {parseFloat(transaction.valor).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;