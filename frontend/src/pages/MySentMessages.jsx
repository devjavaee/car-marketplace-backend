import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MySentMessages = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get('/messages/my-sent');
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer vos messages envoyés");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  if (!isAuthenticated)
    return <p>Veuillez vous connecter</p>;

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (messages.length === 0) return <p>Aucun message envoyé.</p>;

  return (
    <div className="container">
      <h1>Mes messages envoyés</h1>

      {messages.map((msg) => (
        <div key={msg._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 10 }}>
          <p><strong>Annonce :</strong> {msg.car?.brand} {msg.car?.model}</p>
          <p><strong>Votre message :</strong> {msg.content}</p>

          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Envoyé le {new Date(msg.createdAt).toLocaleString()}
          </p>

          {/* Réponse vendeur */}
          {msg.reply && (
            <div style={{ marginTop: 10, padding: 10, background: '#eef9f1', borderLeft: '4px solid #2ecc71' }}>
              <strong>💬 Réponse du vendeur</strong>
              <p>{msg.reply}</p>
              <small>Répondu le {new Date(msg.repliedAt).toLocaleString()}</small>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MySentMessages;
