import React, { useState } from 'react';
import useApi from '../../hooks/useAPI';
import './TransactionForm.css';

const TransactionForm = ({ transaction, tags, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    descricao: transaction?.descricao || '',
    valor: transaction?.valor || '',
    tipo: transaction?.tipo || 'RECEITA',
    data: transaction?.data || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const { request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = transaction 
        ? `/transactions/${transaction.id}` 
        : '/transactions';
      
      const method = transaction ? 'PUT' : 'POST';

      await request(endpoint, {
        method,
        body: { transaction: formData }
      });

      onSave();
    } catch (error) {
      alert('Erro ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-container card">
      <h3 className="form-title">
        {transaction ? 'Editar' : 'Nova'} Transação
      </h3>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label className="form-label">Descrição</label>
          <input
            type="text"
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            className="input"
            placeholder="Ex: Salário, Supermercado, Combustível..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Valor</label>
            <input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({...formData, valor: e.target.value})}
              className="input"
              placeholder="0,00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="input"
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Data</label>
          <input
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({...formData, data: e.target.value})}
            className="input"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;