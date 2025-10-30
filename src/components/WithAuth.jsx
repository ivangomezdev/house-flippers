'use client';
import { useState, useEffect } from 'react';
import Login from './Login';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loggedIn = sessionStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(loggedIn);
      setIsLoading(false);
    }, []);

    const handleLogin = () => {
      sessionStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    };

    if (isLoading) {
        return null; 
    }

    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;