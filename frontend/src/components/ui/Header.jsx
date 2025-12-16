const Header = () => {
  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>🌙 Killa Travel</h2>

      <nav style={styles.nav}>
        <a href="#inicio">Inicio</a>
        <a href="#paquetes">Paquetes</a>
        <a href="#tours">Tours</a>
        <a href="#hospedaje">Hospedaje</a>
        <a href="#transporte">Transporte</a>
      </nav>
    </header>
  );
};

export default Header;

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    background: '#0f2027',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    zIndex: 100,
  },
  logo: {
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '1.2rem',
  },
};
