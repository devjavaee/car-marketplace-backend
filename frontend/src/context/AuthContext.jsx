import { createContext, useEffect, useState } from 'react';
import api from '../api/axios'; // pour récupérer le nombre de messages non lus

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // <-- nouveau

  // Au montage, vérifier token et charger les messages non lus
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
      fetchUnreadCount(token);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
    fetchUnreadCount(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUnreadCount(0);
  };

  // 🔹 fonction pour récupérer le nombre de messages non lus
  const fetchUnreadCount = async (token) => {
    try {
      const res = await api.get('/messages/my'); // backend renvoie tous les messages
      const count = res.data.messages.filter(msg => !msg.isRead).length;
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur récupération messages non lus:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        unreadCount,       // exposer le nombre de messages non lus
        setUnreadCount,    // exposer pour pouvoir mettre à jour depuis MyMessages
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
