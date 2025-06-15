import React, { useState } from 'react';
import useApi from '../../hooks/useAPI';
import './TagForm.css';

const TagForm = ({ tag, onSave, onCancel }) => {
  const [nome, setNome] = useState(tag?.nome || '');
  const [loading, setLoading] = useState(false);
  const { request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = tag ? `/tags/${tag.id}` : '/tags';
      const method = tag ? 'PUT' : 'POST';

      await request(endpoint, {
        method,
        body: { tag: { nome } }
      });

      onSave();
    } catch (error) {
      alert('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tag-form-container card">
      <h3 className="form-title">
        {tag ? 'Editar' : 'Nova'} Categoria
      </h3>

      <form onSubmit={handleSubmit} className="tag-form">
        <div className="form-group">
          <label className="form-label">Nome da Categoria</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input"
            placeholder="Ex: Alimentação, Transporte, Lazer..."
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

export default TagForm;