import React, { useState } from 'react';
import TagForm from './TagForm';
import useApi from '../../hooks/useAPI';
import './TagsContent.css';

const TagsContent = ({ tags, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const { request } = useApi();

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await request(`/tags/${id}`, { method: 'DELETE' });
        onUpdate();
      } catch (error) {
        alert('Erro ao excluir categoria');
      }
    }
  };

  return (
    <div className="tags-content">
      <div className="tags-header">
        <h2 className="page-title">Categorias</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus"></i>
          Nova Categoria
        </button>
      </div>

      {showForm && (
        <TagForm
          tag={editingTag}
          onSave={() => {
            setShowForm(false);
            setEditingTag(null);
            onUpdate();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingTag(null);
          }}
        />
      )}

      <div className="tags-grid">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-card card">
            <div className="tag-info">
              <div className="tag-indicator"></div>
              <span className="tag-name">{tag.name}</span>
            </div>
            <div className="tag-actions">
              <button
                onClick={() => {
                  setEditingTag(tag);
                  setShowForm(true);
                }}
                className="action-btn edit-btn"
                title="Editar"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(tag.id)}
                className="action-btn delete-btn"
                title="Excluir"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}

        {tags.length === 0 && (
          <div className="no-tags">
            <i className="fas fa-tags"></i>
            <p>Nenhuma categoria cadastrada</p>
            <small>Crie sua primeira categoria clicando no botão acima</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsContent;