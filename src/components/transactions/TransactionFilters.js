import React from 'react';
import './TransactionFilters.css';

const TransactionFilters = ({ tags, selectedTags, onTagFilter, selectedType, onTypeFilter }) => {
  const handleTagToggle = (tagId) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagFilter(newSelectedTags);
  };

  const clearAllFilters = () => {
    onTagFilter([]);
    onTypeFilter('');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedType !== '';

  return (
    <div className="transaction-filters card">
      <div className="filters-header">
        <h4>Filtros</h4>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="clear-filters-btn">
            <i className="fas fa-times"></i>
            Limpar filtros
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Filtro por tipo */}
        <div className="filter-group">
          <label className="filter-label">Tipo</label>
          <div className="type-filters">
            <button
              onClick={() => onTypeFilter('')}
              className={`type-filter-btn ${selectedType === '' ? 'active' : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => onTypeFilter('RECEITA')}
              className={`type-filter-btn receita ${selectedType === 'RECEITA' ? 'active' : ''}`}
            >
              Receitas
            </button>
            <button
              onClick={() => onTypeFilter('DESPESA')}
              className={`type-filter-btn despesa ${selectedType === 'DESPESA' ? 'active' : ''}`}
            >
              Despesas
            </button>
          </div>
        </div>

        {/* Filtro por categorias */}
        <div className="filter-group">
          <label className="filter-label">Categorias</label>
          {tags.length === 0 ? (
            <div className="no-tags-filter">
              <small>Nenhuma categoria disponível</small>
            </div>
          ) : (
            <div className="tags-filters">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`tag-filter-btn ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                >
                  {tag.name}
                  {selectedTags.includes(tag.id) && (
                    <i className="fas fa-check"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;