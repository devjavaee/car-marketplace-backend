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

  // 🆕 états pour la réponse inline
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // 🔖 statut message
  const getStatusLabel = (msg) => {
    if (msg.reply) return { text: 'Répondu', color: '#2ecc71' };
    if (msg.isRead) return { text: 'Lu', color: '#3498db' };
    return { text: 'Nouveau', color: '#e67e22' };
  };

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

  // 💬 répondre à un message
  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      alert('La réponse ne peut pas être vide');
      return;
    }

    try {
      setSendingReply(true);

      const res = await api.post(`/messages/${messageId}/reply`, {
        reply: replyText,
      });

      const updatedMessages = messages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              reply: res.data.reply,
              repliedAt: res.data.repliedAt,
            }
          : msg
      );

      setMessages(updatedMessages);
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la réponse");
    } finally {
      setSendingReply(false);
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
        {messages.map((msg) => {
          const status = getStatusLabel(msg);

          return (
            <li
              key={msg._id}
              style={{
                border: '1px solid #ccc',
                padding: '12px',
                marginBottom: '10px',
                background: msg.isRead ? '#f9f9f9' : '#eef6ff',
              }}
            >
              {/* 🔖 Badge statut */}
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: '8px',
                  padding: '4px 10px',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: status.color,
                  borderRadius: '12px',
                }}
              >
                {status.text}
              </span>

              <p>
                <strong>Voiture :</strong> {msg.car.brand} {msg.car.model}
              </p>

              <p>
                <strong>Email expéditeur :</strong> {msg.senderEmail}
              </p>

              <p>
                <strong>Message :</strong> {msg.content}
              </p>

              {/* 💬 Réponse du vendeur */}
              {msg.reply && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f4f6f8',
                    borderLeft: '4px solid #2ecc71',
                    borderRadius: '4px',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>Votre réponse :</strong>
                  </p>

                  <p style={{ marginTop: '6px' }}>{msg.reply}</p>

                  {msg.repliedAt && (
                    <p style={{ fontSize: '0.85em', color: '#666' }}>
                      Répondu le {new Date(msg.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <p>
                <em>Reçu le {new Date(msg.createdAt).toLocaleString()}</em>
              </p>

              {/* Boutons actions */}
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

              {!msg.reply && (
                <button
                  onClick={() => setReplyingTo(msg._id)}
                  style={{
                    marginRight: '10px',
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Répondre
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

              {/* ✏️ zone réponse inline */}
              {replyingTo === msg._id && (
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Votre réponse..."
                    style={{ width: '100%', padding: '6px' }}
                  />

                  <button
                    onClick={() => handleReply(msg._id)}
                    disabled={sendingReply}
                    style={{
                      marginTop: '6px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    {sendingReply ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyMessages;
