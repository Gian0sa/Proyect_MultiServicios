import { useEffect, useState } from 'react';
import { servicioService } from '../../api/servicioService';

export default function ServicioAdmin() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [servicioToEdit, setServicioToEdit] = useState(null);
  const [filterTipo, setFilterTipo] = useState('TODOS');
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    tipoServicio: 'HOSPEDAJE'
  });

  useEffect(() => {
    cargarServicios();
  }, [filterTipo]);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      let res;
      if (filterTipo === 'TODOS') {
        res = await servicioService.getAll();
      } else {
        res = await servicioService.getAll(); // Necesitarías un endpoint de filtro
        // Por ahora filtramos en el cliente
      }
      let data = res.data || [];
      if (filterTipo !== 'TODOS') {
        data = data.filter(s => s.tipoServicio?.toUpperCase() === filterTipo);
      }
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setServicioToEdit(null);
    setForm({
      nombre: '',
      descripcion: '',
      precioBase: '',
      tipoServicio: 'HOSPEDAJE'
    });
    setShowModal(true);
  };

  const handleEdit = (servicio) => {
    setServicioToEdit(servicio);
    setForm({
      nombre: servicio.nombre || '',
      descripcion: servicio.descripcion || '',
      precioBase: servicio.precioBase || '',
      tipoServicio: servicio.tipoServicio || 'HOSPEDAJE'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        precioBase: parseFloat(form.precioBase)
      };

      if (servicioToEdit) {
        await servicioService.update(servicioToEdit.idServicio, data);
      } else {
        await servicioService.create(data);
      }

      setShowModal(false);
      setServicioToEdit(null);
      cargarServicios();
    } catch (error) {
      console.error('Error al guardar servicio', error);
      alert('Error al guardar servicio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await servicioService.delete(id);
      cargarServicios();
    } catch (error) {
      console.error('Error al eliminar servicio', error);
      alert('Error al eliminar servicio');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>⚙️ Gestión de Servicios</h2>
          <span style={styles.badge}>Total: {servicios.length} registros</span>
        </div>

        <div style={styles.actionsGroup}>
          <select
            style={styles.filterSelect}
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="HOSPEDAJE">Hospedaje</option>
            <option value="TOUR">Tour</option>
            <option value="TRANSPORTE">Transporte</option>
          </select>

          <button style={styles.createBtn} onClick={handleOpenCreate}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Servicio
          </button>
        </div>
      </header>

      {loading ? (
        <div style={styles.loading}>Cargando...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Precio Base</th>
                <th style={styles.thCentered}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.emptyCell}>
                    No hay servicios registrados
                  </td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.idServicio} style={styles.tr}>
                    <td style={styles.tdBold}>{s.nombre}</td>
                    <td style={styles.td}>
                      <span style={getTipoBadgeStyle(s.tipoServicio)}>
                        {s.tipoServicio}
                      </span>
                    </td>
                    <td style={styles.td}>{s.descripcion || '—'}</td>
                    <td style={styles.tdPrice}>S/ {Number(s.precioBase || 0).toFixed(2)}</td>
                    <td style={styles.tdAction}>
                      <div style={styles.actionGroup}>
                        <button style={styles.edit} onClick={() => handleEdit(s)}>
                          Editar
                        </button>
                        <button
                          style={styles.delete}
                          onClick={() => handleDelete(s.idServicio)}
                        >
                          Eliminar
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

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {servicioToEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre</label>
                <input
                  style={styles.input}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Servicio</label>
                <select
                  style={styles.input}
                  value={form.tipoServicio}
                  onChange={(e) => setForm({ ...form, tipoServicio: e.target.value })}
                  required
                >
                  <option value="HOSPEDAJE">Hospedaje</option>
                  <option value="TOUR">Tour</option>
                  <option value="TRANSPORTE">Transporte</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  style={styles.textarea}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Precio Base</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  value={form.precioBase}
                  onChange={(e) => setForm({ ...form, precioBase: e.target.value })}
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveBtn}>
                  Guardar
                </button>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getTipoBadgeStyle(tipo) {
  const base = {
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '800',
  };

  switch (tipo?.toUpperCase()) {
    case 'HOSPEDAJE':
      return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' };
    case 'TOUR':
      return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
    case 'TRANSPORTE':
      return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
    default:
      return { ...base, backgroundColor: '#f1f5f9', color: '#475569' };
  }
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
  badge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    width: 'fit-content',
  },
  actionsGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    background: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

