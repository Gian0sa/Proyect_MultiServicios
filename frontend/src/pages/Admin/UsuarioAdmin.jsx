import { useState } from 'react';

export default function UsuarioAdmin() {
  const [message] = useState('La gestión completa de usuarios requiere endpoints adicionales en el backend.');

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.mainTitle}>👥 Gestión de Usuarios</h2>
          <span style={styles.badge}>Funcionalidad en desarrollo</span>
        </div>
      </header>

      <div style={styles.infoCard}>
        <div style={styles.infoIcon}>ℹ️</div>
        <h3 style={styles.infoTitle}>Información</h3>
        <p style={styles.infoText}>
          {message}
        </p>
        <p style={styles.infoText}>
          Actualmente el backend solo expone endpoints para:
        </p>
        <ul style={styles.infoList}>
          <li>Registro de usuarios (POST /api/Usuario/registrar)</li>
          <li>Login de usuarios (POST /api/Usuario/login)</li>
        </ul>
        <p style={styles.infoText}>
          Para habilitar la gestión completa de usuarios, se necesitan agregar endpoints adicionales:
        </p>
        <ul style={styles.infoList}>
          <li>GET /api/Usuario - Listar todos los usuarios</li>
          <li>GET /api/Usuario/{'{id}'} - Obtener usuario por ID</li>
          <li>PUT /api/Usuario/{'{id}'} - Actualizar usuario</li>
          <li>DELETE /api/Usuario/{'{id}'} - Eliminar usuario</li>
          <li>PUT /api/Usuario/{'{id}'}/rol - Cambiar rol de usuario</li>
        </ul>
      </div>
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
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    width: 'fit-content',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  infoIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  infoTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  infoText: {
    color: '#64748b',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  infoList: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.8',
    textAlign: 'left',
    marginLeft: '1.5rem',
    marginBottom: '1rem',
  },
};

