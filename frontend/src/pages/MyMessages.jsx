// src/pages/MyMessages.jsx
import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyMessages = () => {
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
        const res = await api.get('/messages/my');
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);

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
          <li key={msg._id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '10px' }}>
            <p><strong>Voiture :</strong> {msg.car.brand} {msg.car.model}</p>
            <p><strong>Email de l’expéditeur :</strong> {msg.senderEmail}</p>
            <p><strong>Message :</strong> {msg.content}</p>
            <p><em>Reçu le {new Date(msg.createdAt).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyMessages;
