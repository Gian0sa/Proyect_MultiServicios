import { useEffect, useMemo, useState } from 'react';
import { paqueteService } from '../../api/paqueteService';
import { servicioService } from '../../api/servicioService';

export default function PaqueteAdmin() {
  const [paquetes, setPaquetes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paqueteToEdit, setPaqueteToEdit] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioTotal: '',
    esPromocion: false,
    serviciosSeleccionados: [],
  });

  useEffect(() => {
    cargarPaquetes();
    cargarServicios();
  }, []);

  const cargarPaquetes = async () => {
    setLoading(true);
    try {
      const res = await paqueteService.getAll();
      setPaquetes(res.data || []);
    } catch (error) {
      console.error('Error al cargar paquetes', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await servicioService.getAll();
      setServicios(res.data || []);
    } catch (error) {
      console.error('Error al cargar servicios', error);
    }
  };

  const handleOpenCreate = () => {
    setPaqueteToEdit(null);
    setForm({
      nombre: '',
      descripcion: '',
      precioTotal: '',
      esPromocion: false,
      serviciosSeleccionados: [],
    });
    setShowModal(true);
  };

  const handleEdit = async (paquete) => {
    setPaqueteToEdit(paquete);

    // Si el backend de lista simple no trae servicios, opcionalmente podrías usar getById
    let serviciosPaquete = paquete.servicios || [];
    if (!serviciosPaquete.length) {
      try {
        const { data } = await paqueteService.getById(paquete.idPaquete);
        serviciosPaquete = data.servicios || [];
      } catch (e) {
        console.error('Error al cargar detalle de paquete', e);
      }
    }

    setForm({
      nombre: paquete.nombre || '',
      descripcion: paquete.descripcion || '',
      precioTotal: paquete.precioTotal || '',
      esPromocion: paquete.esPromocion || false,
      serviciosSeleccionados: serviciosPaquete.map((s) => s.idServicio),
    });
    setShowModal(true);
  };

  const handleToggleServicio = (idServicio) => {
    setForm((prev) => {
      const exists = prev.serviciosSeleccionados.includes(idServicio);
      return {
        ...prev,
        serviciosSeleccionados: exists
          ? prev.serviciosSeleccionados.filter((id) => id !== idServicio)
          : [...prev.serviciosSeleccionados, idServicio],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.serviciosSeleccionados.length) {
        alert('Selecciona al menos un servicio para el paquete.');
        return;
      }

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precioTotal: parseFloat(form.precioTotal),
        esPromocion: form.esPromocion,
        servicios: form.serviciosSeleccionados.map((idServicio) => ({
          idServicio,
        })),
      };

      if (paqueteToEdit) {
        await paqueteService.update(paqueteToEdit.idPaquete, payload);
      } else {
        await paqueteService.create(payload);
      }

      setShowModal(false);
      setPaqueteToEdit(null);
      cargarPaquetes();
    } catch (error) {
      console.error('Error al guardar paquete', error);
      alert('Error al guardar paquete');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este paquete?')) return;
    try {
      await paqueteService.delete(id);
      cargarPaquetes();
    } catch (error) {
      console.error('Error al eliminar paquete', error);
      alert('Error al eliminar paquete');
    }
  };

  const totalServicios = useMemo(
    () => paquetes.reduce((acc, p) => acc + (p.servicios?.length || 0), 0),
    [paquetes]
  );

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>📦 Gestión de Paquetes</h2>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>Total: {paquetes.length} paquetes</span>
            <span style={styles.badgeSoft}>
              Servicios incluidos: {totalServicios}
            </span>
          </div>
        </div>

        <button style={styles.createBtn} onClick={handleOpenCreate}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Paquete
        </button>
      </header>

      {loading ? (
        <div style={styles.loading}>Cargando paquetes...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Promoción</th>
                <th style={styles.th}>Precio Total</th>
                <th style={styles.th}>Servicios</th>
                <th style={styles.thCentered}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
                    No hay paquetes registrados
                  </td>
                </tr>
              ) : (
                paquetes.map((p) => (
                  <tr key={p.idPaquete} style={styles.tr}>
                    <td style={styles.tdBold}>{p.nombre}</td>
                    <td style={styles.tdDescription}>
                      {p.descripcion || (
                        <span style={styles.muted}>Sin descripción</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {p.esPromocion ? (
                        <span style={styles.promoBadge}>PROMO</span>
                      ) : (
                        <span style={styles.normalBadge}>Regular</span>
                      )}
                    </td>
                    <td style={styles.tdPrice}>
                      S/ {Number(p.precioTotal || 0).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.serviceCount}>
                        {p.servicios?.length || 0} servicios
                      </span>
                    </td>
                    <td style={styles.tdAction}>
                      <div style={styles.actionGroup}>
                        <button
                          style={styles.edit}
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          style={styles.delete}
                          onClick={() => handleDelete(p.idPaquete)}
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

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>
              {paqueteToEdit ? 'Editar Paquete' : 'Nuevo Paquete'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre</label>
                  <input
                    style={styles.input}
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Precio Total</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={form.precioTotal}
                    onChange={(e) =>
                      setForm({ ...form, precioTotal: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.esPromocion}
                    onChange={(e) =>
                      setForm({ ...form, esPromocion: e.target.checked })
                    }
                  />
                  <span>Marcar como promoción</span>
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  style={styles.textarea}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Servicios incluidos</label>
                <div style={styles.servicesGrid}>
                  {servicios.map((s) => {
                    const checked = form.serviciosSeleccionados.includes(
                      s.idServicio
                    );
                    return (
                      <label
                        key={s.idServicio}
                        style={{
                          ...styles.serviceChip,
                          ...(checked ? styles.serviceChipActive : {}),
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleServicio(s.idServicio)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={styles.serviceName}>{s.nombre}</span>
                        <span style={styles.servicePrice}>
                          S/ {Number(s.precioBase || 0).toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                  {servicios.length === 0 && (
                    <div style={styles.muted}>
                      No hay servicios disponibles. Crea servicios primero.
                    </div>
                  )}
                </div>
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
    background:
      'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 40%, #e0f2fe 100%)',
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
    color: '#0f172a',
    fontSize: '1.9rem',
    fontWeight: '800',
  },
  badgeRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    color: '#1d4ed8',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  badgeSoft: {
    backgroundColor: 'rgba(15,23,42,0.05)',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.8rem 1.6rem',
    background:
      'linear-gradient(135deg, #0ea5e9, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
  },
  tableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow:
      '0 20px 25px -5px rgba(15,23,42,0.08), 0 10px 10px -5px rgba(15,23,42,0.04)',
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
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '700',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left',
  },
  thCentered: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '1rem 1.5rem',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: '700',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '1rem 1.5rem',
    color: '#0f172a',
    fontSize: '0.95rem',
    verticalAlign: 'top',
  },
  tdBold: {
    padding: '1rem 1.5rem',
    color: '#0f172a',
    fontSize: '0.98rem',
    fontWeight: '700',
  },
  tdDescription: {
    padding: '1rem 1.5rem',
    color: '#475569',
    fontSize: '0.9rem',
  },
  tdPrice: {
    padding: '1rem 1.5rem',
    color: '#059669',
    fontSize: '1rem',
    fontWeight: '700',
  },
  tdAction: {
    padding: '1rem 1.5rem',
  },
  emptyCell: {
    padding: '3rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  actionGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  edit: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  delete: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  promoBadge: {
    backgroundColor: '#f97316',
    color: '#fff',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  normalBadge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  serviceCount: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: '0.8rem',
  },
  muted: {
    color: '#9ca3af',
    fontSize: '0.85rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '2rem',
    width: '95%',
    maxWidth: '720px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow:
      '0 24px 48px rgba(15,23,42,0.35)',
  },
  modalTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #dbeafe',
    borderRadius: '10px',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: '#0f172a',
    fontSize: '0.9rem',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.75rem',
  },
  serviceChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.6rem 0.8rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  serviceChipActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#e0f2fe',
  },
  serviceName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  servicePrice: {
    fontSize: '0.8rem',
    color: '#059669',
    fontWeight: '600',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  saveBtn: {
    padding: '0.8rem 1.6rem',
    background:
      'linear-gradient(135deg, #0ea5e9, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.8rem 1.6rem',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};


