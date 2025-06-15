import React, { useState, useMemo } from 'react';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import useApi from '../../hooks/useAPI';
import './TransactionsContent.css';

const TransactionsContent = ({ transactions, tags, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const { request } = useApi();

  // Filtrar transações baseado nos filtros selecionados
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtro por tipo
      if (selectedType && transaction.type !== selectedType) {
        return false;
      }

      // Filtro por tags
      if (selectedTags.length > 0) {
        const transactionTagIds = transaction.tags?.map(tag => tag.id) || [];
        const hasSelectedTag = selectedTags.some(tagId => 
          transactionTagIds.includes(tagId)
        );
        if (!hasSelectedTag) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedTags, selectedType]);

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

  const totalFiltered = filteredTransactions.length;
  const totalOriginal = transactions.length;

  return (
    <div className="transactions-content">
      <div className="transactions-header">
        <h2 className="page-title">
          Transações
          {totalFiltered !== totalOriginal && (
            <span className="filtered-count">
              ({totalFiltered} de {totalOriginal})
            </span>
          )}
        </h2>
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

      <TransactionFilters
        tags={tags}
        selectedTags={selectedTags}
        onTagFilter={setSelectedTags}
        selectedType={selectedType}
        onTypeFilter={setSelectedType}
      />

      <div className="transactions-table-container card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Categorias</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
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
                <td className="transaction-tags">
                  {transaction.tags && transaction.tags.length > 0 ? (
                    <div className="tags-list">
                      {transaction.tags.map((tag) => (
                        <span key={tag.id} className="tag-badge">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="no-tags">Sem categorias</span>
                  )}
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

        {filteredTransactions.length === 0 && transactions.length > 0 && (
          <div className="no-transactions">
            <i className="fas fa-filter"></i>
            <p>Nenhuma transação encontrada com os filtros aplicados</p>
            <small>Tente ajustar os filtros para ver mais resultados</small>
          </div>
        )}

        {transactions.length === 0 && (
          <div className="no-transactions">
            <i className="fas fa-exchange-alt"></i>
            <p>Nenhuma transação cadastrada</p>
            <small>Crie sua primeira transação clicando no botão acima</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsContent;