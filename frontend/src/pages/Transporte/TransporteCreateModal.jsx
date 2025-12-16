import { useEffect, useState } from 'react';
import { transporteService } from '../../api/transporteService';
import { destinoService } from '../../api/destinoService';

export default function TransporteCreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    idOrigen: '',
    idDestino: '',
    categoria: 'NORMAL',
    fechaSalida: '',
    fechaLlegada: '',
  });

  const [destinos, setDestinos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [deptoOrigen, setDeptoOrigen] = useState('');
  const [deptoDestino, setDeptoDestino] = useState('');

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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.idOrigen === form.idDestino) {
      alert('Origen y destino no pueden ser iguales');
      return;
    }
    try {
      await transporteService.create({
        ...form,
        precioBase: Number(form.precioBase),
        idOrigen: Number(form.idOrigen),
        idDestino: Number(form.idDestino),
      });
      onCreated();
      onClose();
    } catch (error) {
      alert('Error al crear transporte');
    }
  };

  return (
    <div style={styles.overlay}>
      <form style={styles.modal} onSubmit={handleSubmit}>
        <div style={styles.header}>
          <h3 style={styles.title}>➕ Nuevo Transporte</h3>
          <p style={styles.subtitle}>Complete los detalles del itinerario</p>
        </div>

        <div style={styles.scrollContainer}>
          {/* Sección: Información General */}
          <div style={styles.sectionTitle}>Información General</div>
          <input
            name="nombre"
            placeholder="Nombre del servicio (Ej: Bus Premium)"
            style={styles.input}
            required
            onChange={handleChange}
          />

          <textarea
            name="descripcion"
            placeholder="Descripción de la unidad o servicio..."
            style={{ ...styles.input, ...styles.textarea }}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.flex1}>
              <label style={styles.label}>Precio Base (S/)</label>
              <input
                type="number"
                name="precioBase"
                placeholder="0.00"
                style={styles.input}
                required
                onChange={handleChange}
              />
            </div>
            <div style={styles.flex1}>
              <label style={styles.label}>Categoría</label>
              <select name="categoria" style={styles.input} onChange={handleChange}>
                <option value="NORMAL">NORMAL</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          {/* Sección: Ruta */}
          <div style={styles.sectionTitle}>Definición de Ruta</div>
          <div style={styles.routeBox}>
            <div style={styles.row}>
              <div style={styles.flex1}>
                <select style={styles.input} onChange={e => setDeptoOrigen(e.target.value)} required>
                  <option value="">Dep. Origen</option>
                  {departamentos.map(d => (
                    <option key={d.idDepartamento} value={d.idDepartamento}>{d.nombreDepartamento}</option>
                  ))}
                </select>
              </div>
              <div style={styles.flex1}>
                <select name="idOrigen" style={styles.input} onChange={handleChange} required>
                  <option value="">Destino Origen</option>
                  {destinos.filter(d => d.idDepartamento == deptoOrigen).map(d => (
                    <option key={d.idDestino} value={d.idDestino}>{d.nombreDestino}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.flex1}>
                <select style={styles.input} onChange={e => setDeptoDestino(e.target.value)} required>
                  <option value="">Dep. Destino</option>
                  {departamentos.map(d => (
                    <option key={d.idDepartamento} value={d.idDepartamento}>{d.nombreDepartamento}</option>
                  ))}
                </select>
              </div>
              <div style={styles.flex1}>
                <select name="idDestino" style={styles.input} onChange={handleChange} required>
                  <option value="">Destino Final</option>
                  {destinos.filter(d => d.idDepartamento == deptoDestino).map(d => (
                    <option key={d.idDestino} value={d.idDestino}>{d.nombreDestino}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Horarios */}
          <div style={styles.sectionTitle}>Horarios</div>
          <div style={styles.row}>
            <div style={styles.flex1}>
              <label style={styles.label}>Fecha Salida</label>
              <input type="datetime-local" name="fechaSalida" style={styles.input} required onChange={handleChange} />
            </div>
            <div style={styles.flex1}>
              <label style={styles.label}>Fecha Llegada</label>
              <input type="datetime-local" name="fechaLlegada" style={styles.input} required onChange={handleChange} />
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={onClose} style={styles.btnCancel}>Cancelar</button>
          <button type="submit" style={styles.btnSave}>Guardar Transporte</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.75)', // Azul oscuro translúcido
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