import { useEffect, useState } from 'react';
import { hospedajeService } from '../../api/hospedajeService';
import { useCart } from '../Carrito/CartContext';

export default function HospedajeDetailModal({ hospedaje: hospedajeSimple, onClose }) {
  const { addItem } = useCart(); 
  const [hospedajeFull, setHospedajeFull] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hospedajeSimple?.idHospedaje) {
      cargarDetalle();
    }
  }, [hospedajeSimple]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const res = await hospedajeService.getById(hospedajeSimple.idHospedaje);
      setHospedajeFull(res.data);
    } catch (error) {
      console.error('Error al cargar detalles del hospedaje:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hospedajeSimple) return null;

  const h = hospedajeFull || hospedajeSimple;

  const handleAddToCart = () => {
    addItem(h, 'HOSPEDAJE'); 
    onClose();              
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✕</button>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            Cargando detalles...
          </p>
        ) : (
          <>
            {/* IMÁGENES */}
            <div style={styles.images}>
              {h.imagenes?.length > 0 ? (
                h.imagenes.slice(0, 2).map((img, i) => (
                  <img key={i} src={img.url} style={styles.image} alt="Hospedaje" />
                ))
              ) : (
                <div style={styles.noImage}>Sin imágenes disponibles</div>
              )}
            </div>

            {/* HEADER */}
            <div style={styles.header}>
              <h2 style={styles.title}>{h.nombre}</h2>
              <span
                style={{
                  ...styles.rangoBadge,
                  background:
                    h.rangoPrecio === 'VIP'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : h.rangoPrecio === 'Premium'
                      ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                      : 'linear-gradient(135deg, #3b82f6, #2563eb)'
                }}
              >
                {h.rangoPrecio}
              </span>
            </div>

            <p style={styles.description}>{h.descripcion}</p>

            {/* DETALLES */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.label}>📍 Ubicación</span>
                <span style={styles.value}>
                  {h.nombreDestino}, {h.nombreDepartamento}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>👥 Capacidad</span>
                <span style={styles.value}>{h.capacidad} personas</span>
              </div>

              {h.serviciosIncluidos && (
                <div style={styles.detailRowFull}>
                  <span style={styles.label}>✨ Servicios incluidos</span>
                  <span style={styles.valueServices}>{h.serviciosIncluidos}</span>
                </div>
              )}

              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Precio por noche</span>
                <span style={styles.priceValue}>S/ {h.precioBase}</span>
              </div>
            </div>

            {/* BOTÓN */}
            <button style={styles.addBtn} onClick={handleAddToCart}>
              Añadir al carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'relative'
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
    cursor: 'pointer'
  },
  images: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '1rem'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px'
  },
  noImage: {
    gridColumn: 'span 2',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    borderRadius: '12px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700
  },
  rangoBadge: {
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  description: {
    margin: '1rem 0',
    color: '#64748b'
  },
  detailsGrid: {
    background: '#f8fafc',
    padding: '1rem',
    borderRadius: '12px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.6rem'
  },
  detailRowFull: {
    marginBottom: '0.6rem'
  },
  label: {
    fontWeight: 600,
    color: '#64748b'
  },
  value: {
    fontWeight: 600
  },
  valueServices: {
    fontSize: '0.85rem'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.6rem'
  },
  priceLabel: {
    fontWeight: 600
  },
  priceValue: {
    fontSize: '1.3rem',
    fontWeight: 800,
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
    fontSize: '1rem',
    cursor: 'pointer'
  }
};
