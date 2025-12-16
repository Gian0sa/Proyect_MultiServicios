import { useEffect, useState } from 'react';
import { transporteService } from '../../api/transporteService';
import TransporteCreateModal from './TransporteCreateModal';

export default function TransporteAdmin() {
  const [transportes, setTransportes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    cargarTransportes();
  }, []);

  const cargarTransportes = async () => {
    try {
      const { data } = await transporteService.getAll();
      setTransportes(data);
    } catch (error) {
      console.error('Error al cargar transportes', error);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Deseas eliminar este servicio de transporte de forma permanente?')) return;

    try {
      await transporteService.delete(id);
      cargarTransportes();
    } catch (error) {
      console.error('Error al eliminar transporte', error);
      alert('Error al eliminar transporte');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>🚌 Gestión de Transportes</h2>
          <span style={styles.badge}>Total: {transportes.length} registros</span>
        </div>

        <button
          style={styles.createBtn}
          onClick={() => setShowCreate(true)}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Transporte
        </button>
      </header>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre del Servicio</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Precio Base</th>
              <th style={styles.th}>Ruta del Viaje</th>
              <th style={styles.th}>Horario Salida</th>
              <th style={styles.th}>Horario Llegada</th>
              <th style={styles.thCentered}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {transportes.map((t) => (
              <tr key={t.idServicio} style={styles.tr}>
                <td style={styles.tdBold}>{t.nombre}</td>
                <td style={styles.td}>
                  <span style={t.categoria === 'VIP' ? styles.vipBadge : styles.normalBadge}>
                    {t.categoria}
                  </span>
                </td>
                <td style={styles.tdPrice}>S/ {t.precioBase.toFixed(2)}</td>
                <td style={styles.td}>
                  <div style={styles.routeContainer}>
                    <span style={styles.routeName}>{t.nombreOrigen}</span>
                    <span style={styles.arrow}>→</span>
                    <span style={styles.routeName}>{t.nombreDestino}</span>
                  </div>
                </td>
                <td style={styles.tdDate}>{new Date(t.fechaSalida).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td style={styles.tdDate}>{new Date(t.fechaLlegada).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td style={styles.tdAction}>
                  <div style={styles.actionGroup}>
                    <button style={styles.edit}>Editar</button>
                    <button
                      style={styles.delete}
                      onClick={() => eliminar(t.idTransporte)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <TransporteCreateModal
          onClose={() => setShowCreate(false)}
          onCreated={cargarTransportes}
        />
      )}
    </div>
  );
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
  badge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    width: 'fit-content',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
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
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #f1f5f9',
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
  tdDate: {
    padding: '1.2rem 1.5rem',
    color: '#64748b',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  tdAction: {
    padding: '1.2rem 1.5rem',
  },
  actionGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  edit: {
    padding: '0.5rem 1rem',
    background: '#f1f5f9',
    color: '#2563eb',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  delete: {
    padding: '0.5rem 1rem',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  routeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  routeName: {
    fontWeight: '500',
  },
  arrow: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  vipBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  normalBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '800',
  }
};