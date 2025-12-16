import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <span>Panel Administrativo</span>
      <button onClick={handleLogout} style={styles.logout}>
        Cerrar sesión
      </button>
    </header>
  );
}

const styles = {
  header: {
    background: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  logout: {
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
