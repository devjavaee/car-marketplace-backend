// src/pages/MySentMessages.jsx
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
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/messages/sent');
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer vos messages envoyés.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

  if (!isAuthenticated)
    return (
      <p>
        Vous devez <Link to="/login">vous connecter</Link> pour voir vos messages envoyés.
      </p>
    );

  if (loading) return <p>Chargement des messages...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (messages.length === 0) return <p>Aucun message envoyé.</p>;

  return (
    <div className="container">
      <h1>📤 Mes messages envoyés</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((msg) => (
          <li
            key={msg._id}
            style={{
              border: '1px solid #ddd',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              backgroundColor: '#fdfdfd',
            }}
          >
            <p>
              <strong>🚗 Voiture :</strong> {msg.car?.brand} {msg.car?.model}
            </p>

            <p>
              <strong>💬 Votre message :</strong> {msg.content}
            </p>

            <p>
              <em>Envoyé le {new Date(msg.createdAt).toLocaleString()}</em>
            </p>

            {/* ================= RÉPONSE DU VENDEUR ================= */}
            {msg.reply && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#e8f5ff',
                  borderLeft: '5px solid #3498db',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {/* Badge */}
                <span
                  style={{
                    display: 'inline-block',
                    marginBottom: '6px',
                    padding: '4px 10px',
                    fontSize: '0.8em',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: '#3498db',
                    borderRadius: '12px',
                  }}
                >
                  Réponse du vendeur
                </span>

                <p style={{ marginTop: '6px' }}>
                  <strong>🧑‍💼 Vendeur :</strong>
                </p>

                <p style={{ marginTop: '6px', fontStyle: 'italic' }}>
                  “{msg.reply}”
                </p>

                {msg.repliedAt && (
                  <p style={{ fontSize: '0.85em', color: '#555' }}>
                    Répondu le {new Date(msg.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MySentMessages;
