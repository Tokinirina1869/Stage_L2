import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>; // ou un spinner

  if (!token) return <Navigate to="/login" replace />;

  return element;
};

export default ProtectedRoute;
