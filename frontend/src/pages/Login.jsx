import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
  const res = await api.post('/auth/login', { email, password });
  login(res.data.token);
  setError(''); // 👈 important
  navigate('/dashboard');
} catch (err) {
  
  if (err.response?.status === 401) {
    setError('Identifiant ou mot de passe incorrect');
  } else {
    setError('Erreur serveur');
  }
} finally {
  setLoading(false);
}
};
  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Login'}
        </button>

      </form>
    </div>
  );
}

export default Login;
