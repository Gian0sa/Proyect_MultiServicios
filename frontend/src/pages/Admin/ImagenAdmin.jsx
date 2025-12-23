import { useEffect, useState } from 'react';
import { imagenService } from '../../api/imagenService';

const ENTIDADES = ['HOSPEDAJE', 'TOUR', 'TRANSPORTE', 'PAQUETE'];

export default function ImagenAdmin() {
  const [tipoEntidad, setTipoEntidad] = useState('HOSPEDAJE');
  const [idEntidad, setIdEntidad] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // ID de la imagen a editar
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
    setEditId(null);
    setForm({ url: '', descripcion: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (img) => {
    setEditId(img.idImagen);
    setForm({
      url: img.url,
      descripcion: img.descripcion,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipoEntidad,
      idEntidad: parseInt(idEntidad),
      url: form.url,
      descripcion: form.descripcion,
    };

    try {
      if (editId) {
        await imagenService.update(editId, payload);
      } else {
        await imagenService.create(payload);
      }
      setShowModal(false);
      cargarImagenes();
    } catch (error) {
      console.error('Error al guardar imagen', error);
      alert('Error al procesar la solicitud.');
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
            Asocia y edita imágenes de hospedajes, tours, transportes y paquetes.
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
              <option key={t} value={t}>{t}</option>
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
                    {img.descripcion || <span style={styles.muted}>Sin descripción</span>}
                  </p>
                  <div style={styles.cardActions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleOpenEdit(img)}
                    >
                      Editar
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(img.idImagen)}
                    >
                      Eliminar
                    </button>
                  </div>
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
            <h3 style={styles.modalTitle}>{editId ? '📝 Editar Imagen' : '✨ Nueva Imagen'}</h3>
            <p style={styles.modalSubtitle}>
              {tipoEntidad} · ID {idEntidad} {editId && `(Imagen ID: ${editId})`}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de la imagen</label>
                <input
                  type="url"
                  style={styles.inputModal}
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://tuservidor.com/imagen.jpg"
                  required
                />
              </div>

              {/* Vista previa en tiempo real */}
              {form.url && (
                <div style={styles.previewContainer}>
                  <p style={styles.label}>Vista previa:</p>
                  <img src={form.url} alt="Preview" style={styles.previewImg} />
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  style={styles.textarea}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows="3"
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveBtn}>
                  {editId ? 'Actualizar' : 'Guardar'}
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
    background: 'radial-gradient(circle at top left, #e0f2fe 0, #f8fafc 45%, #e0f2fe 100%)',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
  },
  titleGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  mainTitle: { margin: 0, color: '#0f172a', fontSize: '1.9rem', fontWeight: '800' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '0.95rem' },
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
  filtersRow: { display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', color: '#475569', fontWeight: '600', marginBottom: '4px' },
  select: {
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    backgroundColor: '#fff',
    color: '#1e3a8a',
    minWidth: '200px',
  },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    minWidth: '160px',
  },
  inputModal: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    boxSizing: 'border-box'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #f1f5f9'
  },
  imgWrapper: { position: 'relative', paddingTop: '65%', overflow: 'hidden' },
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  cardBody: { padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '0.3rem 0.7rem',
    borderRadius: '8px',
    fontWeight: '700',
  },
  idTag: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' },
  descText: { fontSize: '0.85rem', color: '#475569', minHeight: '2.5em', margin: 0 },
  cardActions: { display: 'flex', gap: '0.6rem', marginTop: '0.5rem' },
  editBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderRadius: '8px',
    border: '1px solid #dcfce7',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderRadius: '8px',
    border: '1px solid #fee2e2',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  modalTitle: { margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1e293b' },
  modalSubtitle: { margin: '0.5rem 0 1.5rem', fontSize: '0.9rem', color: '#64748b' },
  previewContainer: { marginBottom: '1.5rem', textAlign: 'center' },
  previewImg: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    resize: 'none',
    boxSizing: 'border-box'
  },
  modalActions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  saveBtn: {
    flex: 2,
    padding: '0.8rem',
    background: '#2563eb',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.8rem',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: { textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: '600' },
  emptyState: {
    gridColumn: '1 / -1',
    padding: '4rem 2rem',
    textAlign: 'center',
    color: '#94a3b8',
    backgroundColor: '#fff',
    borderRadius: '20px',
    border: '2px dashed #e2e8f0'
  },
  muted: { color: '#cbd5e1', fontStyle: 'italic' }
};