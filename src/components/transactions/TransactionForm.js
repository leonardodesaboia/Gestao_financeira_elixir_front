import React, { useState } from 'react';
import useApi from '../../hooks/useAPI';
import './TransactionForm.css';

const TransactionForm = ({ transaction, tags, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    value: transaction?.value || '',
    type: transaction?.type || 'RECEITA',
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
    tag_ids: transaction?.tags?.map(tag => tag.id) || transaction?.tag_ids || []
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

      // Formatação dos dados para enviar para a API
      const dataToSend = {
        transaction: {
          description: formData.description,
          value: parseFloat(formData.value),
          type: formData.type.toUpperCase(),
          date: formData.date + 'T00:00:00Z',
          tag_ids: formData.tag_ids
        }
      };

      console.log('Enviando dados:', dataToSend);

      await request(endpoint, {
        method,
        body: dataToSend
      });

      onSave();
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao salvar transação: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId) => {
    const newTagIds = formData.tag_ids.includes(tagId)
      ? formData.tag_ids.filter(id => id !== tagId)
      : [...formData.tag_ids, tagId];
    
    setFormData({ ...formData, tag_ids: newTagIds });
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
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              min="0"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="input"
              placeholder="0,00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
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
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categorias</label>
          <div className="tags-selector">
            {tags.length === 0 ? (
              <div className="no-tags-available">
                <p>Nenhuma categoria disponível.</p>
                <small>Crie categorias na aba "Categorias" primeiro.</small>
              </div>
            ) : (
              <div className="tags-grid">
                {tags.map((tag) => (
                  <label key={tag.id} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.tag_ids.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                    />
                    <span className="tag-label">{tag.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {formData.tag_ids.length > 0 && (
            <div className="selected-tags">
              <small>Selecionadas: {formData.tag_ids.length} categoria(s)</small>
              <div className="selected-tags-preview">
                {formData.tag_ids.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <span key={tagId} className="selected-tag-badge">
                      {tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
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