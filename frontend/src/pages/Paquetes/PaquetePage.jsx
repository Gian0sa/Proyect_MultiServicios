import { useEffect, useState } from 'react';
import { paqueteService } from '../../api/paqueteService';
import PaqueteCard from '../../components/ui/PaqueteCard';
import PaqueteDetailModal from './PaqueteDetailModal';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function PaquetePage() {
  const [paquetes, setPaquetes] = useState([]);
  const [paqueteActivo, setPaqueteActivo] = useState(null);

  useEffect(() => {
    paqueteService.getAll()
      .then(res => setPaquetes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <section style={styles.section}>
        <div style={styles.headerSection}>
          <h2 style={styles.title}>📦 Paquetes Turísticos</h2>
          <p style={styles.subtitle}>
            Descubre nuestras ofertas especiales que combinan tours, transporte y hospedaje
          </p>
        </div>

        <div style={styles.grid}>
          {paquetes.map(p => (
            <PaqueteCard
              key={p.idPaquete}
              paquete={p}
              onClick={() => setPaqueteActivo(p)}
            />
          ))}
        </div>

        {paquetes.length === 0 && (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📦</span>
            <p style={styles.emptyText}>No hay paquetes disponibles</p>
          </div>
        )}
      </section>

      {/* MODAL */}
      <PaqueteDetailModal
        paquete={paqueteActivo}
        onClose={() => setPaqueteActivo(null)}
        onAdd={(item) => console.log('Añadido al carrito:', item)}
      />

      <Footer />
    </>
  );
}

const styles = {
  section: {
    padding: '4rem 2rem',
    textAlign: 'center',
    minHeight: '80vh',
    background: 'linear-gradient(180deg, #f8fafc 0%, #fff 50%)'
  },
  headerSection: {
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    color: '#1e293b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  emptyState: {
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  emptyIcon: {
    fontSize: '4rem',
    opacity: 0.3
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    fontWeight: '500'
  }
};