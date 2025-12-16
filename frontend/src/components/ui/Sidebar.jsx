import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>🌙 Admin</h2>

      <nav style={styles.menu}>
        <NavLink to="/admin" style={styles.link}>📊 Dashboard</NavLink>
        <NavLink to="/admin/transportes" style={styles.link}>🚌 Transporte</NavLink>
        <NavLink to="/admin/paquetes" style={styles.link}>📦 Paquetes</NavLink>
        <NavLink to="/admin/tours" style={styles.link}>🗺️ Tours</NavLink>
        <NavLink to="/admin/ventas" style={styles.link}>💰 Ventas</NavLink>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '230px',
    background: '#0f2027',
    color: '#fff',
    padding: '1.5rem 1rem',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};
