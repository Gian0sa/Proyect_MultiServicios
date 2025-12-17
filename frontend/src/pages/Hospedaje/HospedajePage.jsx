import { useEffect, useState } from 'react';
import { hospedajeService } from '../../api/hospedajeService';
import HospedajeCard from '../../components/ui/HospedajeCard';
import HospedajeDetailModal from './HospedajeDetailModal'; // ✅ AGREGAR ESTA LÍNEA
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function HospedajePage() {
  const [hospedajes, setHospedajes] = useState([]);
  const [hospedajeActivo, setHospedajeActivo] = useState(null);

  useEffect(() => {
    hospedajeService.getAll()
      .then(res => setHospedajes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <section style={styles.section}>
        <h2 style={styles.title}>🏨 Todos los Hospedajes</h2>

        <div style={styles.grid}>
          {hospedajes.map(h => (
            <HospedajeCard
              key={h.idHospedaje}
              hospedaje={h}
              onClick={() => setHospedajeActivo(h)}
            />
          ))}
        </div>
      </section>

      {/* MODAL */}
      <HospedajeDetailModal
        hospedaje={hospedajeActivo}
        onClose={() => setHospedajeActivo(null)}
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
    minHeight: '80vh'
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '2rem',
    color: '#1e293b'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
    gap: '1.8rem',
    maxWidth: '1200px',
    margin: '0 auto'
  }
};