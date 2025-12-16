import { useState, useEffect } from 'react';

export default function TransporteModal({ open, onClose, onSave, transporte }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    idOrigen: '',
    idDestino: '',
    categoria: '',
    fechaSalida: '',
    fechaLlegada: '',
  });

  useEffect(() => {
    if (transporte) setForm(transporte);
  }, [transporte]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{transporte ? 'Editar Transporte' : 'Crear Transporte'}</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            style={styles.input}
          />
        ))}

        <div style={styles.actions}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>
            {transporte ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    width: '400px',
  },
  input: {
    width: '100%',
    marginBottom: '0.8rem',
    padding: '0.5rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
};
