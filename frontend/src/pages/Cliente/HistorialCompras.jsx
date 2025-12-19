import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ventaService } from '../../api/ventaService';
import { imagenService } from '../../api/imagenService';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function HistorialCompras() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Mostrar mensaje de éxito si viene del checkout
    if (location.state?.mensajeExito) {
      setMensajeExito(location.state.mensajeExito);
      // Limpiar el estado después de mostrar el mensaje
      window.history.replaceState({}, document.title);
    }
    
    cargarVentas();
  }, [user, navigate, location.state]);

  const cargarVentas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ventaService.getAll();
      setVentas(res.data || []);
    } catch (error) {
      console.error('Error al cargar ventas', error);
      setError('No se pudieron cargar tus compras. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = async (id) => {
    try {
      const res = await ventaService.getById(id);
      const venta = res.data;
      
      // Cargar imágenes para cada detalle
      const detallesConImagenes = await Promise.all(
        venta.detalles.map(async (detalle) => {
          let imagenUrl = null;
          try {
            // El backend devuelve el tipoItem como string (ej: "SERVICIO", "PAQUETE")
            // Necesitamos determinar el tipo de entidad basado en el nombre del item
            // o usar un placeholder si no hay imagen disponible
            const tipoEntidad = detalle.tipoItem === 'PAQUETE' ? 'PAQUETE' : 
                               detalle.nombreItem?.toUpperCase().includes('TOUR') ? 'TOUR' :
                               detalle.nombreItem?.toUpperCase().includes('HOSPEDAJE') ? 'HOSPEDAJE' :
                               detalle.nombreItem?.toUpperCase().includes('TRANSPORTE') ? 'TRANSPORTE' : null;
            
            // Si tenemos un ID de servicio o paquete, intentar cargar la imagen
            // Nota: El DTO actual no incluye estos IDs directamente, así que usamos un placeholder
            // En producción, sería ideal que el backend incluya estos IDs en el DTO
            if (tipoEntidad && detalle.idServicio) {
              try {
                const imagenesRes = await imagenService.getByEntidad(tipoEntidad, detalle.idServicio);
                if (imagenesRes.data && imagenesRes.data.length > 0) {
                  imagenUrl = imagenesRes.data[0].url;
                }
              } catch (e) {
                // Si falla, dejamos imagenUrl como null y se mostrará el placeholder
              }
            }
          } catch (imgError) {
            console.log('No se pudo cargar imagen para el item:', detalle.nombreItem);
          }
          
          return { ...detalle, imagenUrl };
        })
      );
      
      setSelectedVenta({ ...venta, detalles: detallesConImagenes });
      setShowDetails(true);
    } catch (error) {
      console.error('Error al cargar detalles de venta', error);
      alert('Error al cargar detalles de la compra');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (value) => {
    const n = Number(value ?? 0);
    return `S/ ${Number.isFinite(n) ? n.toFixed(2) : '0.00'}`;
  };

  const totalGastado = ventas.reduce((sum, v) => sum + Number(v?.total ?? 0), 0);
  const ventasOrdenadas = [...ventas].sort((a, b) => new Date(b?.fechaVenta) - new Date(a?.fechaVenta));

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />
      
      <div style={styles.pageContainer}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📜 Mi Historial de Compras</h1>
            <p style={styles.subtitle}>Aquí puedes ver todas tus compras realizadas</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ← Volver al inicio
          </button>
        </div>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div style={styles.successAlert}>
            <div style={styles.successContent}>
              <span style={styles.successIcon}>✅</span>
              <span>{mensajeExito}</span>
            </div>
            <button
              style={styles.closeSuccessBtn}
              onClick={() => setMensajeExito('')}
            >
              ×
            </button>
          </div>
        )}

        {/* Estadísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div>
              <div style={styles.statValue}>{ventas.length}</div>
              <div style={styles.statLabel}>Compras realizadas</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div>
              <div style={styles.statValue}>{formatMoney(totalGastado)}</div>
              <div style={styles.statLabel}>Total gastado</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            {error}
            <button style={styles.retryBtn} onClick={cargarVentas}>
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}>⏳</div>
            <p>Cargando tus compras...</p>
          </div>
        ) : ventasOrdenadas.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2 style={styles.emptyTitle}>No tienes compras aún</h2>
            <p style={styles.emptyText}>
              Cuando realices tu primera compra, aparecerá aquí.
            </p>
            <button style={styles.shopBtn} onClick={() => navigate('/')}>
              Explorar servicios
            </button>
          </div>
        ) : (
          <div style={styles.ventasContainer}>
            {ventasOrdenadas.map((venta) => (
              <div key={venta.idVenta} style={styles.ventaCard}>
                <div style={styles.ventaHeader}>
                  <div>
                    <div style={styles.ventaId}>Compra #{venta.idVenta}</div>
                    <div style={styles.ventaDate}>{formatDate(venta.fechaVenta)}</div>
                  </div>
                  <div style={styles.ventaTotal}>{formatMoney(venta.total)}</div>
                </div>
                
                <div style={styles.ventaBody}>
                  <div style={styles.ventaPreview}>
                    {venta.detalles && venta.detalles.length > 0 && (
                      <div style={styles.previewImages}>
                        {venta.detalles.slice(0, 3).map((detalle, idx) => (
                          <div key={idx} style={styles.previewImagePlaceholder} title={detalle.nombreItem}>
                            {detalle.tipoItem === 'PAQUETE' ? '📦' : 
                             detalle.tipoItem.includes('TOUR') ? '🗺️' :
                             detalle.tipoItem.includes('HOSPEDAJE') ? '🏨' : '🚌'}
                          </div>
                        ))}
                        {venta.detalles.length > 3 && (
                          <div style={styles.moreItems}>+{venta.detalles.length - 3}</div>
                        )}
                      </div>
                    )}
                    <div style={styles.itemsInfo}>
                      <span style={styles.itemsCount}>
                        {venta.detalles?.length || 0} item{venta.detalles?.length !== 1 ? 's' : ''} comprado{venta.detalles?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    style={styles.detailsBtn}
                    onClick={() => handleVerDetalles(venta.idVenta)}
                  >
                    Ver detalles →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles */}
        {showDetails && selectedVenta && (
          <div style={styles.modalOverlay} onClick={() => setShowDetails(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  Detalles de Compra #{selectedVenta.idVenta}
                </h2>
                <button
                  style={styles.closeBtn}
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.detailSection}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Fecha:</span>
                    <span style={styles.detailValue}>
                      {formatDate(selectedVenta.fechaVenta)}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Número de compra:</span>
                    <span style={styles.detailValue}>#{selectedVenta.idVenta}</span>
                  </div>
                </div>

                <div style={styles.itemsSection}>
                  <h3 style={styles.sectionTitle}>Items comprados</h3>
                  <div style={styles.itemsList}>
                    {selectedVenta.detalles?.map((detalle, idx) => (
                      <div key={idx} style={styles.itemCard}>
                        <div style={styles.itemCardContent}>
                          {detalle.imagenUrl ? (
                            <img 
                              src={detalle.imagenUrl} 
                              alt={detalle.nombreItem}
                              style={styles.itemImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div style={{...styles.itemImagePlaceholder, display: detalle.imagenUrl ? 'none' : 'flex'}}>
                            <span style={styles.placeholderIcon}>📦</span>
                          </div>
                          <div style={styles.itemInfo}>
                            <div style={styles.itemHeader}>
                              <span style={getTipoBadge(detalle.tipoItem)}>
                                {detalle.tipoItem}
                              </span>
                              <span style={styles.itemSubtotal}>
                                {formatMoney(detalle.subtotal)}
                              </span>
                            </div>
                            <div style={styles.itemBody}>
                              <div style={styles.itemName}>
                                {detalle.nombreItem || 'Item sin nombre'}
                              </div>
                              <div style={styles.itemDetails}>
                                <span>Cantidad: {detalle.cantidad}</span>
                                <span>Precio unitario: {formatMoney(detalle.precioUnitario)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.totalSection}>
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total de la compra:</span>
                    <span style={styles.totalValue}>
                      {formatMoney(selectedVenta.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.closeModalBtn}
                  onClick={() => setShowDetails(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

function getTipoBadge(tipo) {
  const base = {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  };

  if (tipo?.toUpperCase().includes('PAQUETE')) {
    return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
  }
  return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
}

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
    padding: '2rem',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: 0,
  },
  backBtn: {
    padding: '0.75rem 1.5rem',
    background: '#ffffff',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  statsContainer: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  errorAlert: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #fecaca',
  },
  retryBtn: {
    padding: '0.5rem 1rem',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successAlert: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    background: '#d1fae5',
    color: '#065f46',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #a7f3d0',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)',
  },
  successContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
  },
  successIcon: {
    fontSize: '1.25rem',
  },
  closeSuccessBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#065f46',
    lineHeight: 1,
    padding: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    maxWidth: '1200px',
    margin: '4rem auto',
    textAlign: 'center',
    color: '#64748b',
  },
  spinner: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyState: {
    maxWidth: '600px',
    margin: '4rem auto',
    textAlign: 'center',
    background: '#ffffff',
    padding: '3rem',
    borderRadius: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#64748b',
    marginBottom: '2rem',
  },
  shopBtn: {
    padding: '0.75rem 2rem',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  ventasContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  ventaCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  ventaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  ventaId: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '0.25rem',
  },
  ventaDate: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  ventaTotal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#10b981',
  },
  ventaBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f1f5f9',
  },
  ventaPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  previewImages: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  previewImagePlaceholder: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '2px solid #e2e8f0',
  },
  moreItems: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    background: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  itemsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  itemsCount: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  detailsBtn: {
    padding: '0.5rem 1.25rem',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '2px solid #f1f5f9',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#64748b',
    lineHeight: 1,
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '1.5rem',
  },
  detailSection: {
    marginBottom: '1.5rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    color: '#0f172a',
    fontWeight: '500',
  },
  itemsSection: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  itemCard: {
    background: '#f8fafc',
    borderRadius: '10px',
    padding: '1rem',
    border: '1px solid #e2e8f0',
  },
  itemCardContent: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  itemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
  },
  itemImagePlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    flexShrink: 0,
  },
  placeholderIcon: {
    fontSize: '3rem',
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  itemSubtotal: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#10b981',
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  itemDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#64748b',
  },
  totalSection: {
    paddingTop: '1.5rem',
    borderTop: '2px solid #e2e8f0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#10b981',
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '2px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  closeModalBtn: {
    padding: '0.75rem 2rem',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

