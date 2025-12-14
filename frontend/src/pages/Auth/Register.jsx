import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../../api/usuarioService';

export default function Register() {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Nuevo estado para el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState(null); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null); // Limpiamos mensajes anteriores
    
    try {
      await usuarioService.register({ dni, nombre, apellido, email, password });
      
      // Si el registro es exitoso:
      setSuccessMessage('✅ ¡Registro Exitoso! Serás redirigido al inicio de sesión...');
      
      // Limpiar el formulario
      setDni('');
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');

      // Redirigir al Login después de 3 segundos para que el usuario vea el mensaje
      setTimeout(() => {
          navigate('/login');
      }, 3000); 

    } catch (error) {
      // Si la API devuelve un error (ej. email ya existe)
      alert("Error al registrarse. Revise si el email ya está en uso.");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.logo}>🌙 Killa Travel</h2>
        <p style={styles.subtitle}>Crea tu cuenta y vive la experiencia</p>

        {/* 2. Mostrar Mensaje de Éxito o Error */}
        {successMessage && (
            <div style={styles.successAlert}>
                {successMessage}
            </div>
        )}
        
        <div style={styles.group}>
          <label style={styles.label}>DNI</label>
          <input 
            style={styles.input} 
            value={dni} 
            onChange={e => setDni(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Nombre</label>
          <input 
            style={styles.input} 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Apellido</label>
          <input 
            style={styles.input} 
            value={apellido} 
            onChange={e => setApellido(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Correo</label>
          <input 
            type="email" 
            style={styles.input} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Contraseña</label>
          <input 
            type="password" 
            style={styles.input} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" style={styles.button}>Registrarse</button>

        {/* CÓDIGO CORREGIDO: Envolvemos el span en un párrafo con el estilo "footer" (centrado) */}
        <p style={styles.footer}>
          <span
              style={styles.link} // Usamos el estilo 'link' para el color y el cursor
              onClick={() => navigate('/login')}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </span>
        </p>

      </form>
    </div>
  );
}
const styles = {
  // ... (Estilos anteriores)
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Color de fondo más suave y moderno
    background: 'linear-gradient(120deg, #1d2b3a, #2f455c, #4a6fa3)', 
  },
  card: {
    background: '#ffffff',
    padding: '2.5rem',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '450px', // Aumentamos un poco el ancho
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)', // Sombra más intensa
    borderTop: '5px solid #4a6fa3' // Borde superior de color
  },
  // 3. Estilo para el aviso de éxito
  successAlert: {
      padding: '1rem',
      backgroundColor: '#d4edda', // Fondo verde claro
      color: '#155724', // Texto verde oscuro
      border: '1px solid #c3e6cb',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center'
  },
  logo: {
    textAlign: 'center',
    color: '#4a6fa3', // Color primario
    marginBottom: '0.5rem',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '2rem',
    fontSize: '1rem',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem', // Más espacio entre grupos
  },
  label: {
    fontSize: '0.9rem',
    color: '#333',
    marginBottom: '0.3rem',
    fontWeight: '600'
  },
  input: {
    // ESTILOS CLAROS PARA LOS INPUTS - ELIMINA EL PROBLEMA DE LA VISIBILIDAD
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc', // Borde visible
    background: '#f8f8f8', // Ligero color de fondo para distinguirse
    transition: 'border-color 0.2s',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    // Añadimos foco más llamativo
    ':focus': {
        borderColor: '#4a6fa3',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(74, 111, 163, 0.25)'
    }
  },
  button: {
    width: '100%',
    padding: '1rem',
    marginTop: '1.5rem',
    borderRadius: '10px',
    border: 'none',
    background: '#4a6fa3', // Botón principal
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.3s',
    ':hover': {
        background: '#3a5f93'
    }
  },
  footer: {
        // Estilo que garantiza el centrado del texto
    textAlign: 'center', 
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#4a6fa3',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
        textDecoration: 'underline'
    }
  }
};