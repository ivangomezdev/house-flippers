'use client';
import { useState } from 'react';
import './Login.css';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Usuario o contraseña incorrectos.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img className="login-form__logo" src="https://i.imgur.com/Ql5bBMO.png" alt="Logo" />
        <h2>Iniciar Sesión</h2>
        <div className="login-form__group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-form__group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-form__button">Entrar</button>
      </form>
    </div>
  );
};

export default Login;