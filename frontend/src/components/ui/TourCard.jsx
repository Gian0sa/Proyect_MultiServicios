export default function TourCard({ tour, onClick }) {
  // Usamos la primera imagen o un placeholder de mejor calidad
  const imageUrl = tour.imagenes?.[0]?.url 
    || 'https://images.unsplash.com/photo-1526481280693-3bfa75ac88b1?q=80&w=500';

  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Contenedor de imagen con badge de departamento */}
      <div style={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={tour.nombre}
          style={styles.image}
        />
        <div style={styles.locationBadge}>
          📍 {tour.nombreDepartamento || 'Perú'}
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.header}>
          <h3 style={styles.name}>{tour.nombre}</h3>
        </div>
        
        <p style={styles.desc}>{tour.descripcion}</p>
        
        <div style={styles.footer}>
          <div style={styles.priceContainer}>
            <span style={styles.priceLabel}>Desde</span>
            <span style={styles.priceValue}>S/ {tour.precioBase}</span>
          </div>
          <button style={styles.actionBtn}>Ver detalles</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '265px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  imageWrapper: {
    position: 'relative',
    height: '180px',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  locationBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#333',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  body: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#333',
    lineHeight: '1.3',
  },
  desc: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden', // Corta el texto largo a 2 líneas
    lineHeight: '1.5',
    minHeight: '2.5rem',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.8rem',
    borderTop: '1px solid #f5f5f5',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '0.65rem',
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#b84040',
  },
  actionBtn: {
    background: '#b84040',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
  }
};