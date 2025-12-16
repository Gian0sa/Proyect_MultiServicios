const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div>
          <h3 style={styles.logo}>🌙 Killa Travel</h3>
          <p style={styles.text}>
            Vive experiencias únicas con nuestros tours, hospedajes y transporte
            seguro por todo el Perú.
          </p>
        </div>

        <div>
          <h4 style={styles.title}>Servicios</h4>
          <ul style={styles.list}>
            <li>Paquetes</li>
            <li>Tours</li>
            <li>Hospedaje</li>
            <li>Transporte</li>
          </ul>
        </div>

        <div>
          <h4 style={styles.title}>Contacto</h4>
          <p style={styles.text}>📍 Cusco, Perú</p>
          <p style={styles.text}>📞 +51 999 999 999</p>
          <p style={styles.text}>✉ contacto@killatravel.pe</p>
        </div>
      </div>

      <div style={styles.copy}>
        © {new Date().getFullYear()} Killa Travel — Todos los derechos reservados
      </div>
    </footer>
  );
};
const styles = {
  footer: {
    background: '#0f2027',
    color: '#fff',
    marginTop: '4rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    padding: '3rem 2rem',
  },
  logo: {
    marginBottom: '0.5rem',
  },
  title: {
    marginBottom: '0.8rem',
  },
  text: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#d1d5db',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    lineHeight: 1.8,
    fontSize: '0.9rem',
    color: '#d1d5db',
  },
  copy: {
    textAlign: 'center',
    padding: '1rem',
    background: '#08171c',
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
};

export default Footer;
