import { useEffect, useState } from 'react';
import { paqueteService } from '../../api/paqueteService';

export default function PaqueteDetailModal({ paquete: paqueteSimple, onClose, onAdd }) {
  const [paqueteFull, setPaqueteFull] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paqueteSimple?.idPaquete) {
      cargarDetalle();
    }
  }, [paqueteSimple]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const res = await paqueteService.getById(paqueteSimple.idPaquete);
      console.log('Respuesta API Paquete:', res.data);
      setPaqueteFull(res.data);
    } catch (error) {
      console.error("Error al cargar detalles del paquete:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!paqueteSimple) return null;

  const p = paqueteFull || paqueteSimple;

  // Iconos según tipo de servicio
  const getIconoServicio = (tipo) => {
    switch(tipo) {
      case 'TOUR': return '🌄';
      case 'TRANSPORTE': return '🚌';
      case 'HOSPEDAJE': return '🏨';
      default: return '📦';
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✕</button>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalles...</p>
        ) : (
          <>
            {/* Header */}
            <div style={styles.header}>
              <h2 style={styles.title}>{p.nombre}</h2>
              {p.esPromocion && (
                <span style={styles.promoBadge}>
                  🔥 PROMOCIÓN
                </span>
              )}
            </div>

            <p style={styles.description}>{p.descripcion}</p>

            {/* Servicios incluidos */}
            <div style={styles.servicesSection}>
              <h3 style={styles.sectionTitle}>📦 Servicios incluidos</h3>
              
              {p.servicios && p.servicios.length > 0 ? (
                <div style={styles.servicesList}>
                  {p.servicios.map((servicio, index) => (
                    <div key={index} style={styles.serviceCard}>
                      <div style={styles.serviceHeader}>
                        <span style={styles.serviceIcon}>
                          {getIconoServicio(servicio.tipoServicio)}
                        </span>
                        <div style={styles.serviceInfo}>
                          <span style={styles.serviceType}>{servicio.tipoServicio}</span>
                          <h4 style={styles.serviceName}>{servicio.nombre}</h4>
                        </div>
                      </div>
                      <p style={styles.serviceDesc}>{servicio.descripcion}</p>
                      <div style={styles.servicePrice}>
                        <span style={styles.servicePriceLabel}>Precio individual:</span>
                        <span style={styles.servicePriceValue}>S/ {servicio.precioBase}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noServices}>No hay servicios configurados</p>
              )}
            </div>

            {/* Resumen de precio */}
            <div style={styles.priceSection}>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Precio total del paquete</span>
                <span style={styles.priceValue}>S/ {p.precioTotal}</span>
              </div>
              {p.esPromocion && (
                <div style={styles.savingsNote}>
                  ¡Ahorra comprando el paquete completo! 💰
                </div>
              )}
            </div>

            {/* Botón de acción */}
            <button 
              style={styles.addBtn} 
              onClick={() => {
                if (onAdd) {
                  onAdd(p);
                } else {
                  console.log('Paquete para carrito:', p);
                  alert('Paquete añadido al carrito (función pendiente)');
                }
                onClose();
              }}
            >
              Añadir paquete al carrito
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
    width: '600px',
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem',
    gap: '1rem'
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1e293b',
    flex: 1
  },
  promoBadge: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)',
    whiteSpace: 'nowrap'
  },
  description: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  servicesSection: {
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  serviceCard: {
    background: '#f8fafc',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  serviceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.5rem'
  },
  serviceIcon: {
    fontSize: '1.8rem'
  },
  serviceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  serviceType: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  serviceName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  serviceDesc: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0.5rem 0',
    lineHeight: '1.5'
  },
  servicePrice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.5rem',
    borderTop: '1px solid #e2e8f0'
  },
  servicePriceLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  servicePriceValue: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#475569'
  },
  noServices: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '2rem',
    fontStyle: 'italic'
  },
  priceSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1.2rem',
    borderRadius: '12px',
    marginBottom: '1rem'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#fff'
  },
  savingsNote: {
    marginTop: '0.8rem',
    fontSize: '0.85rem',
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500'
  },
  addBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
  }
};