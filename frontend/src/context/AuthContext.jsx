import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Initialisation au chargement de l'app
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Pour l’instant on ne décode pas le token
      // On sait juste qu’il existe
      setUser({ token });
    }

    setLoading(false);
  }, []);

  // ✅ Login
  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  // ✅ Logout (ce que tu avais déjà, bien vu 👍)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
