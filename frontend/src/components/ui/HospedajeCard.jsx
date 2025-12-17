import React from 'react';

export default function HospedajeCard({ hospedaje, onClick }) {
  const imageUrl =
    hospedaje.imagenes && hospedaje.imagenes.length > 0
      ? hospedaje.imagenes[0].url
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500';

  return (
    <div 
      style={styles.card} 
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Contenedor de Imagen con Badge de Rango de Precio */}
      <div style={styles.imageWrapper}>
        <img src={imageUrl} alt={hospedaje.nombre} style={styles.image} />
        <div style={{
          ...styles.priceTag,
          backgroundColor: hospedaje.rangoPrecio === 'VIP' ? '#f59e0b' : '#3b82f6'
        }}>
          {hospedaje.rangoPrecio}
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.header}>
          <h3 style={styles.name}>{hospedaje.nombre}</h3>
        </div>

        <p style={styles.desc}>{hospedaje.descripcion}</p>

        {/* Info de Ubicación Estilizada */}
        <div style={styles.locationContainer}>
          <span style={styles.pin}>📍</span>
          <span style={styles.locationText}>{hospedaje.nombreDepartamento}</span>
        </div>

        <div style={styles.footer}>
          <div style={styles.priceContainer}>
            <span style={styles.priceAmount}>S/ {hospedaje.precioBase}</span>
            <span style={styles.priceUnit}>/ noche</span>
          </div>
          <button style={styles.bookBtn}>Reservar</button>
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
    boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
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
  priceTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
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
    alignItems: 'center',
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.2',
  },
  desc: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '2.5rem',
    lineHeight: '1.5',
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: '#f8fafc',
    padding: '6px 10px',
    borderRadius: '8px',
    width: 'fit-content',
  },
  pin: {
    fontSize: '0.8rem',
  },
  locationText: {
    fontSize: '0.8rem',
    color: '#475569',
    fontWeight: '600',
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
    alignItems: 'baseline',
    gap: '2px',
  },
  priceAmount: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#b84040',
  },
  priceUnit: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '500',
  },
  bookBtn: {
    background: '#1e293b',
    color: '#fff',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }
};