import React, { useState } from 'react';
import useApi from '../../hooks/useAPI';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await request('/users', {
          method: 'POST',
          body: { user: { name, email, password } }
        });
        alert('Usuário criado com sucesso! Faça login.');
        setIsRegister(false);
        setName('');
        setPassword('');
      } else {
        const response = await request('/users/login', {
          method: 'POST',
          body: { email, password }
        });
        
        // A resposta pode vir com diferentes formatos
        const token = response.token || response.jwt || response.access_token;
        const userData = response.user || response.data || { name: response.name, email: response.email };
        
        if (token && userData) {
          onLogin(token, userData);
        } else {
          throw new Error('Resposta de login inválida');
        }
      }
    } catch (error) {
      console.error('Erro de login:', error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegister ? 'Cadastrar' : 'Login'}
        </h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Sua senha"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary login-btn"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {isRegister ? 'Cadastrando...' : 'Entrando...'}
              </>
            ) : (
              isRegister ? 'Cadastrar' : 'Entrar'
            )}
          </button>
        </form>
        
        <div className="login-toggle">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setName('');
              setPassword('');
            }}
            className="toggle-btn"
          >
            {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;