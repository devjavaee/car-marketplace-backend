import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // supprime token + user
    navigate('/login');    // redirection immédiate
  };

  return (
    <nav className={styles.nav}>
      <Link className={styles.link} to="/cars">Voitures</Link>

      {isAuthenticated ? (
        <>
          <Link className={styles.link} to="/dashboard">Dashboard</Link>
          <button className={styles.button} onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link className={styles.link} to="/login">Login</Link>
          <Link className={styles.link} to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
