import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>404</h2>
      <p>Page introuvable</p>

      <Link to="/cars">⬅️ Retour aux voitures</Link>
    </div>
  );
}

export default NotFound;
