import { useEffect, useState } from 'react';
import { transporteService } from '../../api/transporteService';
import { destinoService } from '../../api/destinoService';

export default function TransporteCreateModal({ onClose, onCreated, transporteToEdit }) {
  const [destinos, setDestinos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [deptoOrigen, setDeptoOrigen] = useState('');
  const [deptoDestino, setDeptoDestino] = useState('');

  const [form, setForm] = useState({
    idTransporte: transporteToEdit?.idTransporte || null,
    nombre: transporteToEdit?.nombre || '',
    descripcion: transporteToEdit?.descripcion || '',
    precioBase: transporteToEdit?.precioBase || '',
    idOrigen: transporteToEdit?.idOrigen || '',
    idDestino: transporteToEdit?.idDestino || '',
    categoria: transporteToEdit?.categoria || 'NORMAL',
    fechaSalida: transporteToEdit
      ? new Date(transporteToEdit.fechaSalida).toISOString().slice(0, 16)
      : '',
    fechaLlegada: transporteToEdit
      ? new Date(transporteToEdit.fechaLlegada).toISOString().slice(0, 16)
      : '',
  });

  /* ===============================
     CARGAR DESTINOS (UNA SOLA VEZ)
     =============================== */
  useEffect(() => {
    cargarDestinos();
  }, []);

  const cargarDestinos = async () => {
    try {
      const { data } = await destinoService.getAll();
      setDestinos(data);

      const unicos = [
        ...new Map(
          data.map(d => [
            d.idDepartamento,
            {
              idDepartamento: d.idDepartamento,
              nombreDepartamento: d.nombreDepartamento,
            },
          ])
        ).values(),
      ];
      setDepartamentos(unicos);
    } catch (error) {
      console.error('Error cargando destinos', error);
    }
  };

  /* ======================================================
     🔑 CUANDO EDITO: SETEAR DEPARTAMENTOS Y DESTINOS
     ====================================================== */
  useEffect(() => {
  if (!transporteToEdit || destinos.length === 0) return;

  const destinoOrigen = destinos.find(
    d => d.idDestino === transporteToEdit.idOrigen
  );

  const destinoFinal = destinos.find(
    d => d.idDestino === transporteToEdit.idDestino
  );

  if (!destinoOrigen || !destinoFinal) return;

  setDeptoOrigen(String(destinoOrigen.idDepartamento));
  setDeptoDestino(String(destinoFinal.idDepartamento));

  setForm(prev => ({
    ...prev,
    idOrigen: String(destinoOrigen.idDestino),
    idDestino: String(destinoFinal.idDestino),
  }));
}, [transporteToEdit, destinos]);


  /* ===============================
     HANDLERS
     =============================== */
  const handleDeptoOrigenChange = (e) => {
    const value = e.target.value;
    setDeptoOrigen(value);

    // 🔴 SOLO RESETEAR SI ESTOY CREANDO
    if (!transporteToEdit) {
      setForm(prev => ({ ...prev, idOrigen: '' }));
    }
  };

  const handleDeptoDestinoChange = (e) => {
    const value = e.target.value;
    setDeptoDestino(value);

    if (!transporteToEdit) {
      setForm(prev => ({ ...prev, idDestino: '' }));
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ===============================
     SUBMIT
     =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.idOrigen === form.idDestino) {
      alert('Origen y destino no pueden ser iguales');
      return;
    }

    const dataToSend = {
      ...form,
      precioBase: Number(form.precioBase),
      idOrigen: Number(form.idOrigen),
      idDestino: Number(form.idDestino),
    };

    try {
      if (transporteToEdit) {
        await transporteService.update(form.idTransporte, dataToSend);
      } else {
        await transporteService.create(dataToSend);
      }

      onCreated();
      onClose();
    } catch (error) {
      alert(`Error al ${transporteToEdit ? 'actualizar' : 'crear'} transporte`);
      console.error(error);
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.modal} onSubmit={handleSubmit}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {transporteToEdit ? '✏️ Editar Transporte' : '➕ Nuevo Transporte'}
          </h3>
          <p style={styles.subtitle}>Complete los detalles del itinerario</p>
        </div>

        <div style={styles.scrollContainer}>
          <div style={styles.sectionTitle}>Información General</div>

          <input
            name="nombre"
            placeholder="Nombre del servicio"
            style={styles.input}
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción del servicio"
            style={{ ...styles.input, ...styles.textarea }}
            value={form.descripcion}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.flex1}>
              <label style={styles.label}>Precio Base</label>
              <input
                type="number"
                name="precioBase"
                style={styles.input}
                value={form.precioBase}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.flex1}>
              <label style={styles.label}>Categoría</label>
              <select
                name="categoria"
                style={styles.input}
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          <div style={styles.sectionTitle}>Definición de Ruta</div>

          <div style={styles.routeBox}>
            <div style={styles.row}>
              <select style={styles.input} value={deptoOrigen} onChange={handleDeptoOrigenChange}>
                <option value="">Dep. Origen</option>
                {departamentos.map(d => (
                  <option key={d.idDepartamento} value={d.idDepartamento}>
                    {d.nombreDepartamento}
                  </option>
                ))}
              </select>

              <select
                name="idOrigen"
                style={styles.input}
                value={form.idOrigen}
                onChange={handleChange}
              >
                <option value="">Destino Origen</option>
                {destinos
                  .filter(d => d.idDepartamento == deptoOrigen)
                  .map(d => (
                    <option key={d.idDestino} value={d.idDestino}>
                      {d.nombreDestino}
                    </option>
                  ))}
              </select>
            </div>

            <div style={styles.row}>
              <select style={styles.input} value={deptoDestino} onChange={handleDeptoDestinoChange}>
                <option value="">Dep. Destino</option>
                {departamentos.map(d => (
                  <option key={d.idDepartamento} value={d.idDepartamento}>
                    {d.nombreDepartamento}
                  </option>
                ))}
              </select>

              <select
                name="idDestino"
                style={styles.input}
                value={form.idDestino}
                onChange={handleChange}
              >
                <option value="">Destino Final</option>
                {destinos
                  .filter(d => d.idDepartamento == deptoDestino)
                  .map(d => (
                    <option key={d.idDestino} value={d.idDestino}>
                      {d.nombreDestino}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div style={styles.sectionTitle}>Horarios</div>

          <div style={styles.row}>
            <input
              type="datetime-local"
              name="fechaSalida"
              style={styles.input}
              value={form.fechaSalida}
              onChange={handleChange}
              required
            />
            <input
              type="datetime-local"
              name="fechaLlegada"
              style={styles.input}
              value={form.fechaLlegada}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={onClose} style={styles.btnCancel}>
            Cancelar
          </button>
          <button type="submit" style={styles.btnSave}>
            {transporteToEdit ? 'Actualizar Transporte' : 'Guardar Transporte'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '550px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  header: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#1e293b',
    fontWeight: '700',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '0.875rem',
    color: '#64748b',
  },
  scrollContainer: {
    overflowY: 'auto',
    paddingRight: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#3b82f6',
    marginTop: '0.5rem',
  },
  routeBox: {
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  flex1: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  btnCancel: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnSave: {
    padding: '10px 20px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    transition: 'background 0.2s',
  },
};