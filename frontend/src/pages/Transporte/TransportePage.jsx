import { useEffect, useState } from 'react';
import { transporteService } from '../../api/transporteService';
import TransporteCard from '../../components/ui/TransporteCard';
import TransporteDetailModal from './TransporteDetailModal';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function TransportePage() {
  const [transportes, setTransportes] = useState([]);
  const [transporteActivo, setTransporteActivo] = useState(null);

  useEffect(() => {
    transporteService.getAll()
      .then(res => setTransportes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <section style={styles.section}>
        <h2 style={styles.title}>🚌 Todos los Transportes</h2>

        <div style={styles.grid}>
          {transportes.map(t => (
            <TransporteCard
              key={t.idTransporte}
              transporte={t}
              onVerDetalle={setTransporteActivo} // 🔥 CLAVE
            />
          ))}
        </div>
      </section>

      {/* MODAL */}
      <TransporteDetailModal
        transporte={transporteActivo}
        onClose={() => setTransporteActivo(null)}
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
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.8rem',
    maxWidth: '1200px',
    margin: '0 auto'
  }
};
