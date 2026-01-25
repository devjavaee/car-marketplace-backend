// src/pages/MyMessages.jsx
import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyMessages = () => {
  const { isAuthenticated, setUnreadCount } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔄 recalcul du nombre de messages non lus
  const updateUnreadCount = (msgs) => {
    const count = msgs.filter((msg) => !msg.isRead).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/messages/my');
        setMessages(res.data.messages);
        updateUnreadCount(res.data.messages);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  // 🗑️ supprimer message
  const handleDelete = async (messageId) => {
    if (!window.confirm('Supprimer ce message ?')) return;

    try {
      await api.delete(`/messages/${messageId}`);

      const updatedMessages = messages.filter(
        (msg) => msg._id !== messageId
      );

      setMessages(updatedMessages);
      updateUnreadCount(updatedMessages);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du message");
    }
  };

  // ✅ marquer comme lu
  const handleMarkAsRead = async (messageId) => {
    try {
      await api.patch(`/messages/${messageId}/read`);

      const updatedMessages = messages.map((msg) =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      );

      setMessages(updatedMessages);
      updateUnreadCount(updatedMessages);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du marquage comme lu");
    }
  };

  if (!isAuthenticated)
    return (
      <p>
        Vous devez <Link to="/login">vous connecter</Link> pour voir vos messages.
      </p>
    );

  if (loading) return <p>Chargement des messages...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (messages.length === 0) return <p>Aucun message reçu.</p>;

  return (
    <div className="container">
      <h1>Mes messages reçus</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((msg) => (
          <li
            key={msg._id}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              marginBottom: '10px',
              background: msg.isRead ? '#f9f9f9' : '#eef6ff',
            }}
          >
            <p>
              <strong>Voiture :</strong> {msg.car.brand} {msg.car.model}
            </p>

            <p>
              <strong>Email expéditeur :</strong> {msg.senderEmail}
            </p>

            <p>
              <strong>Message :</strong> {msg.content}
            </p>

            <p>
              <em>Reçu le {new Date(msg.createdAt).toLocaleString()}</em>
            </p>

            {!msg.isRead && (
              <button
                onClick={() => handleMarkAsRead(msg._id)}
                style={{
                  marginRight: '10px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Marquer comme lu
              </button>
            )}

            <button
              onClick={() => handleDelete(msg._id)}
              style={{
                background: '#c0392b',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyMessages;
