export default function PaqueteCard({ paquete, onClick }) {
  // Imagen por defecto para paquetes
  const imageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=500';

  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Imagen con badge de promoción */}
      <div style={styles.imageWrapper}>
        <img src={imageUrl} alt={paquete.nombre} style={styles.image} />
        {paquete.esPromocion && (
          <div style={styles.promoBadge}>
            🔥 PROMO
          </div>
        )}
      </div>

      <div style={styles.body}>
        <h3 style={styles.name}>{paquete.nombre}</h3>
        <p style={styles.desc}>{paquete.descripcion}</p>

        {/* Info rápida */}
        <div style={styles.infoBox}>
          <div style={styles.infoItem}>
            <span style={styles.icon}>📦</span>
            <span style={styles.infoText}>Paquete completo</span>
          </div>
          {paquete.esPromocion && (
            <div style={styles.infoItem}>
              <span style={styles.icon}>💰</span>
              <span style={styles.infoText}>Precio especial</span>
            </div>
          )}
        </div>

        {/* Footer con precio */}
        <div style={styles.footer}>
          <div style={styles.priceContainer}>
            <span style={styles.priceLabel}>Precio total</span>
            <span style={styles.priceValue}>S/ {paquete.precioTotal}</span>
          </div>
          <button style={styles.detailBtn}>Ver detalles</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '300px',
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
    height: '200px',
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.9
  },
  promoBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    animation: 'pulse 2s infinite'
  },
  body: {
    padding: '1.3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    flexGrow: 1,
  },
  name: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.3',
  },
  desc: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0',
    lineHeight: '1.5',
    minHeight: '2.5rem',
  },
  infoBox: {
    background: '#f8fafc',
    padding: '10px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  icon: {
    fontSize: '0.9rem',
  },
  infoText: {
    fontSize: '0.8rem',
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.8rem',
    borderTop: '1px solid #f1f5f9',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#b84040',
  },
  detailBtn: {
    background: '#667eea',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }
};