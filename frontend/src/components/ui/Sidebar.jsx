import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>🌙 Admin</h2>

      <nav style={styles.menu}>
        <NavLink to="/admin" end style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/admin/servicios" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          ⚙️ Servicios
        </NavLink>
        <NavLink to="/admin/hospedajes" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          🏨 Hospedajes
        </NavLink>
        <NavLink to="/admin/tours" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          🗺️ Tours
        </NavLink>
        <NavLink to="/admin/transportes" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          🚌 Transportes
        </NavLink>
        <NavLink to="/admin/paquetes" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          📦 Paquetes
        </NavLink>
        <NavLink to="/admin/ventas" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          💰 Ventas
        </NavLink>
        <NavLink to="/admin/imagenes" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          🖼️ Imágenes
        </NavLink>
        <NavLink to="/admin/usuarios" style={({ isActive }) => ({...styles.link, ...(isActive ? styles.linkActive : {})})}>
          👥 Usuarios
        </NavLink>
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
    color: '#cbd5e1',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    display: 'block',
  },
  linkActive: {
    backgroundColor: '#1e293b',
    color: '#fff',
    fontWeight: '600',
  },
};
