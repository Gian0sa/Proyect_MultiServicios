import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
        <div style={styles.brandColumn}>
          <h3 style={styles.logo}>🌙 Killa Travel</h3>
          <p style={styles.text}>
            Vive experiencias únicas con nuestros tours, hospedajes y transporte
            seguro por todo el Perú. Tu aventura comienza aquí.
          </p>
          <div style={styles.socialIcons}>
            {/* Espacio para futuros íconos de redes sociales */}
            <span style={styles.socialPlaceholder}>FB</span>
            <span style={styles.socialPlaceholder}>IG</span>
            <span style={styles.socialPlaceholder}>TW</span>
          </div>
        </div>

        {/* COLUMNA 2: SERVICIOS */}
        <div>
          <h4 style={styles.title}>Servicios</h4>
          <ul style={styles.list}>
            {['Paquetes', 'Tours', 'Hospedaje', 'Transporte'].map((item) => (
              <li 
                key={item} 
                style={styles.listItem}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA 3: CONTACTO */}
        <div>
          <h4 style={styles.title}>Contacto</h4>
          <div style={styles.contactItem}>
            <span style={styles.icon}>📍</span>
            <span style={styles.text}>Lima, Perú</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.icon}>📞</span>
            <span style={styles.text}>+51 927 734 632</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.icon}>✉</span>
            <span style={styles.text}>contacto@killatravel.pe</span>
          </div>
        </div>
      </div>

      {/* LÍNEA DIVISORIA */}
      <div style={styles.divider}></div>

      {/* COPYRIGHT */}
      <div style={styles.copyContainer}>
        <div style={styles.copy}>
          © {new Date().getFullYear()} <span style={{ fontWeight: '700' }}>Killa Travel</span> — Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'linear-gradient(180deg, #0f2027 0%, #08171c 100%)', // Gradiente para mayor profundidad
    color: '#fff',
    marginTop: '6rem', // Más espacio con la sección anterior
    paddingTop: '4rem',
    borderTop: '4px solid #b84040', // Línea de acento con el color de la marca
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    padding: '0 2rem',
  },
  brandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '800',
    letterSpacing: '-1px',
    margin: 0,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#fff',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#d1d5db',
    margin: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  listItem: {
    fontSize: '0.95rem',
    color: '#d1d5db',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1rem',
  },
  icon: {
    fontSize: '1.2rem',
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  socialPlaceholder: {
    width: '35px',
    height: '35px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  divider: {
    maxWidth: '1200px',
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '3rem auto 0 auto',
  },
  copyContainer: {
    background: '#050c0f',
    padding: '1.5rem 0',
    marginTop: '2rem',
  },
  copy: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
};

export default Footer;