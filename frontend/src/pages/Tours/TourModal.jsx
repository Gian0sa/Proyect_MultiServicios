import { useEffect, useState } from 'react';
import { tourService } from '../../api/tourService';

export default function TourModal({ tour: tourSimple, onClose, onAdd }) {
  const [tourFull, setTourFull] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tourSimple?.idTour) {
      cargarDetalle();
    }
  }, [tourSimple]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const res = await tourService.getById(tourSimple.idTour);
      console.log('Respuesta API Tour:', res.data);
      setTourFull(res.data);
    } catch (error) {
      console.error("Error al cargar detalles del tour:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!tourSimple) return null;

  const t = tourFull || tourSimple;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✕</button>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalles...</p>
        ) : (
          <>
            {/* Galería de imágenes */}
            <div style={styles.images}>
              {(t.imagenes && t.imagenes.length > 0) ? (
                t.imagenes.slice(0, 2).map((img, i) => (
                  <img 
                    key={i} 
                    src={img.url} 
                    style={styles.image} 
                    alt="Tour" 
                  />
                ))
              ) : (
                <div style={styles.noImage}>Sin imágenes disponibles</div>
              )}
            </div>

            {/* Header con título y badge de ubicación */}
            <div style={styles.header}>
              <h2 style={styles.title}>{t.nombre}</h2>
              <span style={styles.locationBadge}>
                📍 {t.nombreDepartamento || 'Perú'}
              </span>
            </div>

            <p style={styles.description}>{t.descripcion}</p>

            {/* Detalles en grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.label}>🗺️ Ubicación</span>
                <span style={styles.value}>{t.nombreDepartamento}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.label}>📍 Destino</span>
                <span style={styles.value}>{t.nombreDestino || 'No especificado'}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>⏱️ Duración</span>
                <span style={styles.value}>{t.duracion || 'Consultar'}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>👨‍🏫 Guía incluido</span>
                <span style={{
                  ...styles.value,
                  color: t.guiaIncluido ? '#10b981' : '#ef4444'
                }}>
                  {t.guiaIncluido ? '✓ Sí incluido' : '✗ No incluido'}
                </span>
              </div>

              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Precio por persona</span>
                <span style={styles.priceValue}>S/ {t.precioBase}</span>
              </div>
            </div>

            {/* Botón de acción */}
            <button 
              style={styles.addBtn} 
              onClick={() => {
                if (onAdd) {
                  onAdd(t);
                } else {
                  console.log('Tour seleccionado para carrito:', t);
                  alert('Tour añadido al carrito (función pendiente)');
                }
                onClose();
              }}
            >
              Añadir al carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    width: '540px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '20px',
    padding: '2rem',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
  },
  close: {
    position: 'absolute',
    top: 15,
    right: 15,
    border: 'none',
    background: '#f1f5f9',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#64748b',
    transition: 'background 0.2s',
    zIndex: 10
  },
  images: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '1.5rem'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px',
    background: '#f1f5f9'
  },
  noImage: {
    gridColumn: 'span 2',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    borderRadius: '12px',
    color: '#64748b',
    fontSize: '0.9rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem',
    gap: '1rem'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    flex: 1
  },
  locationBadge: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
    whiteSpace: 'nowrap'
  },
  description: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  detailsGrid: {
    background: '#f8fafc',
    padding: '1.2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid #e2e8f0'
  },
  label: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600'
  },
  value: {
    fontSize: '0.9rem',
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.5rem'
  },
  priceLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#b84040'
  },
  addBtn: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#b84040',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(184, 64, 64, 0.2)'
  }
};