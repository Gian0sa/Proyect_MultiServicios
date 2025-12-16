export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <div style={styles.cards}>
        <div style={styles.card}>🚌 Transportes</div>
        <div style={styles.card}>📦 Paquetes</div>
        <div style={styles.card}>💰 Ventas</div>
        <div style={styles.card}>👤 Usuarios</div>
      </div>
    </>
  );
}

const styles = {
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
};
