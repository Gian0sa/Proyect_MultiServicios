import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function ClientPage() {
  return (
    <div>
      {/* HEADER */}
      <Header />

      {/* HERO */}
      <section id="inicio" style={styles.hero}>
        <h1>Explora el Perú con Killa Travel</h1>
        <p>Paquetes, tours, hospedaje y transporte en un solo lugar</p>
      </section>

      {/* PAQUETES */}
      <section id="paquetes" style={styles.section}>
        <h2>📦 Paquetes</h2>
        <p>Experiencias completas diseñadas para ti</p>
      </section>

      {/* TOURS */}
      <section id="tours" style={styles.sectionAlt}>
        <h2>🗺️ Tours</h2>
        <p>Descubre destinos increíbles con guías expertos</p>
      </section>

      {/* HOSPEDAJE */}
      <section id="hospedaje" style={styles.section}>
        <h2>🏨 Hospedaje</h2>
        <p>Hoteles y alojamientos verificados</p>
      </section>

      {/* TRANSPORTE */}
      <section id="transporte" style={styles.sectionAlt}>
        <h2>🚌 Transporte</h2>
        <p>Viaja cómodo y seguro a tu destino</p>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = {
  hero: {
    height: '70vh',
    background: 'linear-gradient(120deg, #203a43, #2c5364)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 1rem',
  },
  section: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: '#f9f9f9',
  },
  sectionAlt: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: '#ffffff',
  },
};
