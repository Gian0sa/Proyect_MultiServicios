import { useEffect, useState } from 'react';
import { ventaService } from '../../api/ventaService';

export default function VentaAdmin() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const res = await ventaService.getAll();
      setVentas(res.data || []);
    } catch (error) {
      console.error('Error al cargar ventas', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await ventaService.getById(id);
      setSelectedVenta(res.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error al cargar detalles de venta', error);
      alert('Error al cargar detalles de venta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de anular esta venta?')) return;
    try {
      await ventaService.delete(id);
      cargarVentas();
      if (selectedVenta?.idVenta === id) {
        setShowDetails(false);
        setSelectedVenta(null);
      }
    } catch (error) {
      console.error('Error al anular venta', error);
      alert('Error al anular venta');
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

  const totalVentas = ventas.reduce((sum, v) => sum + Number(v.total || 0), 0);
  const ventasHoy = ventas.filter(v => {
    const fecha = new Date(v.fechaVenta);
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  }).length;

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>💰 Gestión de Ventas</h2>
          <div style={styles.statsRow}>
            <span style={styles.statBadge}>
              Total: {ventas.length} ventas
            </span>
            <span style={styles.statBadge}>
              Hoy: {ventasHoy} ventas
            </span>
            <span style={styles.statBadgeMoney}>
              Total: S/ {totalVentas.toFixed(2)}
            </span>
          </div>
        </div>

        <button style={styles.refreshBtn} onClick={cargarVentas} disabled={loading}>
          {loading ? 'Actualizando...' : '🔄 Actualizar'}
        </button>
      </header>

      {loading && ventas.length === 0 ? (
        <div style={styles.loading}>Cargando ventas...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Items</th>
                <th style={styles.thCentered}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                ventas
                  .sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta))
                  .map((v) => (
                    <tr key={v.idVenta} style={styles.tr}>
                      <td style={styles.tdBold}>#{v.idVenta}</td>
                      <td style={styles.td}>{formatDate(v.fechaVenta)}</td>
                      <td style={styles.td}>{v.nombreUsuario || '—'}</td>
                      <td style={styles.tdPrice}>S/ {Number(v.total || 0).toFixed(2)}</td>
                      <td style={styles.td}>
                        {v.detalles?.length || 0} item(s)
                      </td>
                      <td style={styles.tdAction}>
                        <div style={styles.actionGroup}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => handleViewDetails(v.idVenta)}
                          >
                            Ver
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDelete(v.idVenta)}
                          >
                            Anular
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetails && selectedVenta && (
        <div style={styles.modalOverlay} onClick={() => setShowDetails(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detalles de Venta #{selectedVenta.idVenta}</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div style={styles.detailsSection}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Fecha:</span>
                <span style={styles.detailValue}>{formatDate(selectedVenta.fechaVenta)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Cliente:</span>
                <span style={styles.detailValue}>{selectedVenta.nombreUsuario || '—'}</span>
              </div>
            </div>

            <div style={styles.itemsSection}>
              <h4 style={styles.sectionTitle}>Items de la Venta</h4>
              <table style={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={styles.itemsTh}>Item</th>
                    <th style={styles.itemsTh}>Cantidad</th>
                    <th style={styles.itemsTh}>Precio Unit.</th>
                    <th style={styles.itemsTh}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVenta.detalles?.map((d, idx) => (
                    <tr key={idx}>
                      <td style={styles.itemsTd}>
                        <span style={getTipoBadge(d.tipoItem)}>{d.tipoItem}</span>
                        <br />
                        <small>{d.nombreItem || '—'}</small>
                      </td>
                      <td style={styles.itemsTd}>{d.cantidad}</td>
                      <td style={styles.itemsTd}>S/ {Number(d.precioUnitario || 0).toFixed(2)}</td>
                      <td style={styles.itemsTdPrice}>S/ {Number(d.subtotal || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.totalSection}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalValue}>
                  S/ {Number(selectedVenta.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTipoBadge(tipo) {
  const base = {
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'inline-block',
    marginBottom: '0.25rem',
  };

  if (tipo?.toUpperCase().includes('PAQUETE')) {
    return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
  }
  return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
}

const styles = {
  pageContainer: {
    padding: '2.5rem',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  mainTitle: {
    margin: 0,
    color: '#1e293b',
    fontSize: '1.8rem',
    fontWeight: '700',
  },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  statBadge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  statBadgeMoney: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  refreshBtn: {
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '700',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left',
  },
  thCentered: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '700',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'center',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1.2rem 1.5rem',
    color: '#334155',
    fontSize: '0.95rem',
  },
  tdBold: {
    padding: '1.2rem 1.5rem',
    color: '#0f172a',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  tdPrice: {
    padding: '1.2rem 1.5rem',
    color: '#059669',
    fontSize: '1rem',
    fontWeight: '700',
  },
  tdAction: {
    padding: '1.2rem 1.5rem',
  },
  emptyCell: {
    padding: '3rem',
    textAlign: 'center',
    color: '#94a3b8',
  },
  actionGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  viewBtn: {
    padding: '0.5rem 1rem',
    background: '#f1f5f9',
    color: '#2563eb',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '0.5rem 1rem',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#64748b',
    lineHeight: 1,
  },
  detailsSection: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
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
    color: '#1e293b',
  },
  itemsSection: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  itemsTh: {
    backgroundColor: '#f1f5f9',
    padding: '0.75rem',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#64748b',
  },
  itemsTd: {
    padding: '0.75rem',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
  },
  itemsTdPrice: {
    padding: '0.75rem',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#059669',
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
    color: '#1e293b',
  },
  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#059669',
  },
};

