// src/pages/CarDetail.jsx
import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data);
      } catch (err) {
        console.error(err);
        setError('Voiture introuvable ou erreur serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSending(true);
      setError('');
      setSuccess('');

      await api.post(`/cars/${id}/contact`, {
        message,
      });

      setSuccess('Message envoyé au vendeur');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error && !car) return <p style={{ color: 'red' }}>{error}</p>;
  if (!car) return <p>Aucune voiture trouvée</p>;

  return (
    <div className="container">
      <Link to="/cars">← Retour aux voitures</Link>

      <div className="card">
        <h1>{car.brand} {car.model}</h1>
        <p><strong>Année :</strong> {car.year}</p>
        <p><strong>Prix :</strong> {car.price} €</p>
        {car.description && <p>{car.description}</p>}
      </div>

      <div className="card">
        <h3>Photos</h3>
        {car.images?.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {car.images.map(img => (
              <img key={img._id} src={img.url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
            ))}
          </div>
        ) : (
          <p>Aucune photo disponible</p>
        )}
      </div>

      <div className="card">
        <h3>Contacter le vendeur</h3>

        {!isAuthenticated ? (
          <p>
            <Link to="/login">Connexion</Link> ou <Link to="/register">Inscription</Link> requise.
          </p>
        ) : (
          <form onSubmit={handleContact}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
              placeholder="Votre message"
            />

            <button type="submit" disabled={sending}>
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CarDetail;
