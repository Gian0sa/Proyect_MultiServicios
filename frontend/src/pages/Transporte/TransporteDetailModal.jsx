import { useEffect, useState } from 'react';
import { transporteService } from '../../api/transporteService';

export default function TransporteDetailModal({ transporte: transporteSimple, onClose, onAdd }) {
  const [transporteFull, setTransporteFull] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transporteSimple?.idTransporte) {
      cargarDetalle();
    }
  }, [transporteSimple]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const res = await transporteService.getById(transporteSimple.idTransporte);
      console.log('Respuesta API Transporte:', res.data);
      setTransporteFull(res.data);
    } catch (error) {
      console.error("Error al cargar detalles del transporte:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!transporteSimple) return null;

  const t = transporteFull || transporteSimple;

  // Formatear fechas
  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificado';
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                  <img key={i} src={img.url} style={styles.image} alt="Transporte" />
                ))
              ) : (
                <div style={styles.noImage}>Sin imágenes disponibles</div>
              )}
            </div>

            {/* Header con título y badge de categoría */}
            <div style={styles.header}>
              <h2 style={styles.title}>{t.nombre}</h2>
              <span style={{
                ...styles.categoriaBadge,
                background: t.categoria === 'VIP' 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : t.categoria === 'PREMIUM'
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              }}>
                {t.categoria}
              </span>
            </div>

            <p style={styles.description}>{t.descripcion}</p>

            {/* Detalles en grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.label}>🚩 Origen</span>
                <span style={styles.value}>
                  {t.nombreOrigen}, {t.nombreDepartamentoOrigen}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>🏁 Destino</span>
                <span style={styles.value}>
                  {t.nombreDestino}, {t.nombreDepartamentoDestino}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>📅 Salida</span>
                <span style={styles.value}>{formatFecha(t.fechaSalida)}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>🕐 Llegada</span>
                <span style={styles.value}>{formatFecha(t.fechaLlegada)}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>🎫 Categoría</span>
                <span style={styles.value}>{t.categoria}</span>
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
                  console.log('Transporte para carrito:', t);
                  alert('Transporte añadido al carrito (función pendiente)');
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
  categoriaBadge: {
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
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
    background: '#1e293b',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(30, 41, 59, 0.2)'
  }
};