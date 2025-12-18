import { useEffect, useState } from 'react';
import { imagenService } from '../../api/imagenService';

const ENTIDADES = ['HOSPEDAJE', 'TOUR', 'TRANSPORTE', 'PAQUETE'];

export default function ImagenAdmin() {
  const [tipoEntidad, setTipoEntidad] = useState('HOSPEDAJE');
  const [idEntidad, setIdEntidad] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    url: '',
    descripcion: '',
  });

  useEffect(() => {
    if (idEntidad) {
      cargarImagenes();
    } else {
      setImagenes([]);
    }
  }, [tipoEntidad, idEntidad]);

  const cargarImagenes = async () => {
    if (!idEntidad) return;
    setLoading(true);
    try {
      const { data } = await imagenService.getByEntidad(
        tipoEntidad,
        parseInt(idEntidad)
      );
      setImagenes(data || []);
    } catch (error) {
      console.error('Error al cargar imágenes', error);
      // Si backend responde 404, simplemente consideramos lista vacía
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (!idEntidad) {
      alert('Primero selecciona el ID de la entidad.');
      return;
    }
    setForm({
      url: '',
      descripcion: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tipoEntidad,
        idEntidad: parseInt(idEntidad),
        url: form.url,
        descripcion: form.descripcion,
      };
      await imagenService.create(payload);
      setShowModal(false);
      cargarImagenes();
    } catch (error) {
      console.error('Error al guardar imagen', error);
      alert('Error al guardar imagen (revisa que la URL sea válida).');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta imagen permanentemente?')) return;
    try {
      await imagenService.delete(id);
      cargarImagenes();
    } catch (error) {
      console.error('Error al eliminar imagen', error);
      alert('Error al eliminar imagen');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>🖼️ Gestión de Imágenes</h2>
          <p style={styles.subtitle}>
            Asocia imágenes a hospedajes, tours, transportes y paquetes.
          </p>
        </div>

        <button style={styles.createBtn} onClick={handleOpenCreate}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Nueva Imagen
        </button>
      </header>

      <div style={styles.filtersRow}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Tipo de entidad</label>
          <select
            style={styles.select}
            value={tipoEntidad}
            onChange={(e) => setTipoEntidad(e.target.value)}
          >
            {ENTIDADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>ID de entidad</label>
          <input
            type="number"
            style={styles.input}
            value={idEntidad}
            onChange={(e) => setIdEntidad(e.target.value)}
            placeholder="Ej: 1"
            min="1"
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Cargando imágenes...</div>
      ) : (
        <div style={styles.grid}>
          {imagenes.length === 0 ? (
            <div style={styles.emptyState}>
              {idEntidad
                ? 'No hay imágenes para esta entidad. Crea una nueva.'
                : 'Selecciona tipo e ID de entidad para ver sus imágenes.'}
            </div>
          ) : (
            imagenes.map((img) => (
              <div key={img.idImagen} style={styles.card}>
                <div style={styles.imgWrapper}>
                  <img
                    src={img.url}
                    alt={img.descripcion || 'Imagen'}
                    style={styles.image}
                  />
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardMeta}>
                    <span style={styles.tag}>{img.tipoEntidad}</span>
                    <span style={styles.idTag}>ID {img.idEntidad}</span>
                  </div>
                  <p style={styles.descText}>
                    {img.descripcion || (
                      <span style={styles.muted}>Sin descripción</span>
                    )}
                  </p>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(img.idImagen)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>Nueva Imagen</h3>
            <p style={styles.modalSubtitle}>
              {tipoEntidad} · ID {idEntidad}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de la imagen</label>
                <input
                  type="url"
                  style={styles.input}
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://tuservidor.com/imagen.jpg"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción (opcional)</label>
                <textarea
                  style={styles.textarea}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  rows="3"
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
    background:
      'radial-gradient(circle at top left, #e0f2fe 0, #f8fafc 45%, #e0f2fe 100%)',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  mainTitle: {
    margin: 0,
    color: '#0f172a',
    fontSize: '1.9rem',
    fontWeight: '800',
  },
  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.95rem',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.6rem',
    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
  },
  filtersRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#475569',
    fontWeight: '600',
  },
  select: {
    padding: '0.7rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid #bfdbfe',
    backgroundColor: '#eff6ff',
    color: '#1e3a8a',
    minWidth: '200px',
  },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid #d1d5db',
    minWidth: '160px',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.95rem',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow:
      '0 18px 35px -15px rgba(15,23,42,0.35)',
    display: 'flex',
    flexDirection: 'column',
  },
  imgWrapper: {
    position: 'relative',
    paddingTop: '60%',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '0.9rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tag: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontWeight: '700',
  },
  idTag: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  descText: {
    fontSize: '0.85rem',
    color: '#4b5563',
    minHeight: '2.2em',
  },
  muted: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  deleteBtn: {
    marginTop: '0.25rem',
    alignSelf: 'flex-end',
    padding: '0.4rem 0.9rem',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '999px',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
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
    zIndex: 1200,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '2rem',
    width: '95%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow:
      '0 24px 48px rgba(15,23,42,0.45)',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    margin: '0.2rem 0 1.5rem 0',
    fontSize: '0.9rem',
    color: '#64748b',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
  saveBtn: {
    padding: '0.75rem 1.6rem',
    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    color: '#fff',
    borderRadius: '999px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.75rem 1.6rem',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    borderRadius: '999px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
};


