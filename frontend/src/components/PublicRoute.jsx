import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
