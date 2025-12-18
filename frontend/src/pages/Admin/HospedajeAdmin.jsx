import { useEffect, useState } from 'react';
import { hospedajeService } from '../../api/hospedajeService';
import { destinoService } from '../../api/destinoService';

export default function HospedajeAdmin() {
  const [hospedajes, setHospedajes] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hospedajeToEdit, setHospedajeToEdit] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    idDestino: '',
    rangoPrecio: '',
    capacidad: '',
    serviciosIncluidos: ''
  });

  useEffect(() => {
    cargarHospedajes();
    cargarDestinos();
  }, []);

  const cargarHospedajes = async () => {
    setLoading(true);
    try {
      const res = await hospedajeService.getAll();
      setHospedajes(res.data || []);
    } catch (error) {
      console.error('Error al cargar hospedajes', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarDestinos = async () => {
    try {
      const res = await destinoService.getAll();
      setDestinos(res.data || []);
    } catch (error) {
      console.error('Error al cargar destinos', error);
    }
  };

  const handleOpenCreate = () => {
    setHospedajeToEdit(null);
    setForm({
      nombre: '',
      descripcion: '',
      precioBase: '',
      idDestino: '',
      rangoPrecio: '',
      capacidad: '',
      serviciosIncluidos: ''
    });
    setShowModal(true);
  };

  const handleEdit = (hospedaje) => {
    setHospedajeToEdit(hospedaje);
    setForm({
      nombre: hospedaje.nombre || '',
      descripcion: hospedaje.descripcion || '',
      precioBase: hospedaje.precioBase || '',
      idDestino: hospedaje.idDestino || '',
      rangoPrecio: hospedaje.rangoPrecio || '',
      capacidad: hospedaje.capacidad || '',
      serviciosIncluidos: hospedaje.serviciosIncluidos || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        precioBase: parseFloat(form.precioBase),
        idDestino: parseInt(form.idDestino),
        capacidad: parseInt(form.capacidad)
      };

      if (hospedajeToEdit) {
        await hospedajeService.update(hospedajeToEdit.idHospedaje, data);
      } else {
        await hospedajeService.create(data);
      }

      setShowModal(false);
      setHospedajeToEdit(null);
      cargarHospedajes();
    } catch (error) {
      console.error('Error al guardar hospedaje', error);
      alert('Error al guardar hospedaje');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este hospedaje?')) return;
    try {
      await hospedajeService.delete(id);
      cargarHospedajes();
    } catch (error) {
      console.error('Error al eliminar hospedaje', error);
      alert('Error al eliminar hospedaje');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>🏨 Gestión de Hospedajes</h2>
          <span style={styles.badge}>Total: {hospedajes.length} registros</span>
        </div>

        <button style={styles.createBtn} onClick={handleOpenCreate}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Hospedaje
        </button>
      </header>

      {loading ? (
        <div style={styles.loading}>Cargando...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Destino</th>
                <th style={styles.th}>Capacidad</th>
                <th style={styles.th}>Rango Precio</th>
                <th style={styles.th}>Precio Base</th>
                <th style={styles.thCentered}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hospedajes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
                    No hay hospedajes registrados
                  </td>
                </tr>
              ) : (
                hospedajes.map((h) => (
                  <tr key={h.idHospedaje} style={styles.tr}>
                    <td style={styles.tdBold}>{h.nombre}</td>
                    <td style={styles.td}>{h.nombreDestino || '—'}</td>
                    <td style={styles.td}>{h.capacidad || '—'}</td>
                    <td style={styles.td}>{h.rangoPrecio || '—'}</td>
                    <td style={styles.tdPrice}>S/ {Number(h.precioBase || 0).toFixed(2)}</td>
                    <td style={styles.tdAction}>
                      <div style={styles.actionGroup}>
                        <button style={styles.edit} onClick={() => handleEdit(h)}>
                          Editar
                        </button>
                        <button
                          style={styles.delete}
                          onClick={() => handleDelete(h.idHospedaje)}
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
              {hospedajeToEdit ? 'Editar Hospedaje' : 'Nuevo Hospedaje'}
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
                <label style={styles.label}>Destino</label>
                <select
                  style={styles.input}
                  value={form.idDestino}
                  onChange={(e) => setForm({ ...form, idDestino: e.target.value })}
                  required
                >
                  <option value="">Seleccione un destino</option>
                  {destinos.map((d) => (
                    <option key={d.idDestino} value={d.idDestino}>
                      {d.nombreDestino}
                    </option>
                  ))}
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

              <div style={styles.formRow}>
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

                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacidad</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={form.capacidad}
                    onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rango de Precio</label>
                <input
                  style={styles.input}
                  value={form.rangoPrecio}
                  onChange={(e) => setForm({ ...form, rangoPrecio: e.target.value })}
                  placeholder="Ej: Económico, Medio, Alto"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Servicios Incluidos</label>
                <textarea
                  style={styles.textarea}
                  value={form.serviciosIncluidos}
                  onChange={(e) => setForm({ ...form, serviciosIncluidos: e.target.value })}
                  rows="2"
                  placeholder="Ej: WiFi, Desayuno, Estacionamiento"
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
    maxWidth: '600px',
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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

