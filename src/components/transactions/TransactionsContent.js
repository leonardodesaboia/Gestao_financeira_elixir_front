import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import useApi from '../../hooks/useAPI';
import './TransactionsContent.css';

const TransactionsContent = ({ transactions, tags, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { request } = useApi();

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await request(`/transactions/${id}`, { method: 'DELETE' });
        onUpdate();
      } catch (error) {
        alert('Erro ao excluir transação');
      }
    }
  };

  return (
    <div className="transactions-content">
      <div className="transactions-header">
        <h2 className="page-title">Transações</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nova Transação
        </button>
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          tags={tags}
          onSave={() => {
            setShowForm(false);
            setEditingTransaction(null);
            onUpdate();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      <div className="transactions-table-container card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="transaction-description">
                  {transaction.description}
                </td>
                <td>
                  <span className={`transaction-type ${transaction.type.toLowerCase()}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="transaction-value">
                  R$ {parseFloat(transaction.value).toFixed(2)}
                </td>
                <td className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="transaction-actions">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowForm(true);
                    }}
                    className="action-btn edit-btn"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="action-btn delete-btn"
                    title="Excluir"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsContent;