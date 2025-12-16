import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../../api/usuarioService';
import { useAuth } from '../../auth/AuthContext'; 
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Nuevo estado para error (solo en styles)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiamos errores antes de intentar el login

    try {
      const { data } = await usuarioService.login(email, password);
      login(data);

      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/cliente');
      }

    } catch (error) {
      // CÓDIGO ORIGINAL, PERO USAMOS setError para una mejor UX con el diseño
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.logo}>🌙 Killa Travel</h1>
        <p style={styles.subtitle}>
          Tours • Hospedaje • Transporte
        </p>

        {/* Muestra el error si existe */}
        {error && (
            <div style={styles.errorAlert}>
                {error}
            </div>
        )}
        
        {/* Campo Correo */}
        <div style={styles.group}>
          <label style={styles.label}>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* Campo Contraseña */}
        <div style={styles.group}>
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Ingresar <LogIn size={20} style={{ marginLeft: '10px' }} />
        </button>
        
        <span
  style={{ textAlign: 'center', cursor: 'pointer', color: '#1e3c72' }}
  onClick={() => navigate('/register')}
>
  ¿No tienes cuenta? Regístrate
</span>


        <span style={styles.copyright}>
          © 2025 Killa Travel
        </span>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(120deg, #1d2b3a, #2f455c, #4a6fa3)', 
  },
  card: {
    background: '#ffffff',
    padding: '2.5rem',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)', 
    borderTop: '5px solid #4a6fa3',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem' 
  },
  logo: {
    textAlign: 'center',
    color: '#4a6fa3', 
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
  errorAlert: {
      padding: '1rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: 'bold',
      textAlign: 'center'
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem', 
  },
  label: {
    fontSize: '0.9rem',
    color: '#333',
    marginBottom: '0.3rem',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    background: '#f8f8f8',
    transition: 'border-color 0.2s',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    ':focus': {
        borderColor: '#4a6fa3',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(74, 111, 163, 0.25)'
    }
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    marginTop: '1.5rem',
    borderRadius: '10px',
    border: 'none',
    background: '#4a6fa3',
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
  },
  copyright: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '1rem'
  }
};