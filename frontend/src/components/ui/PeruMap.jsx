import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../../pages/Carrito/CartContext';
export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
const { itemCount } = useCart();
  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate('/')}>
      Killa's Travel
      </div>


      <nav style={styles.nav}>
  <Link to="/" style={styles.navLink}>Inicio</Link>
  <Link to="/paquetes" style={styles.navLink}>Packs</Link>
  <Link to="/hospedajes" style={styles.navLink}>Alojamiento</Link>
  <Link to="/transportes" style={styles.navLink}>Transporte</Link>
  <Link to="/tours" style={styles.navLink}>Tours</Link>
</nav>
<div 
  onClick={() => navigate('/cart')} 
  style={styles.cartIcon}
>
  🛒
  {itemCount > 0 && (
    <span style={styles.cartBadge}>{itemCount}</span>
  )}
</div>

      <div style={styles.userBox}>
        {!user ? (
          <div style={styles.authButtons}>
            <button
              style={styles.btn}
              onClick={() => navigate('/login')}
            >
              Login
            </button>

            <button
              style={styles.btnOutline}
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        ) : (
          <div style={styles.userMenu}>
            <div
              onClick={() => setOpen(!open)}
              style={styles.userTrigger}
            >
              <span style={styles.avatar}>👤</span>
              <span style={styles.userName}>{user.nombre}</span>
              <span style={{ fontSize: '0.7rem', marginLeft: '5px' }}>{open ? '▲' : '▼'}</span>
            </div>

            {open && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownInfo}>
                   <small style={{ color: '#888' }}>Conectado como</small>
                   <div style={{ fontWeight: '600' }}>{user.nombre}</div>
                </div>
                <div style={styles.divider}></div>
                <button
                  onClick={() => {
                    navigate('/mis-compras');
                    setOpen(false);
                  }}
                  style={styles.menuItem}
                >
                  📜 Mis Compras
                </button>
                <div style={styles.divider}></div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  style={styles.logout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '70px',
    background: 'rgba(184, 64, 64, 0.9)', // Rojo Killa con transparencia
    backdropFilter: 'blur(10px)', // Efecto de cristal esmerilado
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 3rem',
    zIndex: 2000,
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '800',
    letterSpacing: '-1px',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'opacity 0.2s',
    opacity: 0.9,
  },
  userBox: {
    position: 'relative',
  },
  authButtons: {
    display: 'flex',
    gap: '10px',
  },
  userMenu: {
    position: 'relative',
  },
  userTrigger: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.15)',
    padding: '8px 15px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  avatar: {
    marginRight: '8px',
    fontSize: '1.1rem',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '50px',
    background: '#fff',
    color: '#333',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    minWidth: '180px',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out',
  },
  dropdownInfo: {
    padding: '12px 15px',
    fontSize: '0.85rem',
  },
  divider: {
    height: '1px',
    background: '#eee',
    width: '100%',
  },
  menuItem: {
    border: 'none',
    background: 'none',
    padding: '12px 15px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#333',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  logout: {
    border: 'none',
    background: 'none',
    padding: '12px 15px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#b84040',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  btn: {
    background: '#fff',
    color: '#b84040',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  btnOutline: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1.5px solid #fff',
    padding: '8px 20px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cartIcon: {
  position: 'relative',
  fontSize: '1.5rem',
  cursor: 'pointer',
  marginRight: '1.5rem'
},
cartBadge: {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  background: '#ef4444',
  color: '#fff',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: '700'
}
};