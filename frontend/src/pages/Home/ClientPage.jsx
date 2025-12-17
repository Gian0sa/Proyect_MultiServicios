import { useEffect, useState } from 'react';

import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Carousel from '../../components/ui/carousel';

import TourCard from '../../components/ui/TourCard';
import TourModal from '../Tours/TourModal';
import HospedajeCard from '../../components/ui/HospedajeCard';
import HospedajeDetailModal from '../Hospedaje/HospedajeDetailModal'; // ✅ AGREGAR
import TransporteCard from '../../components/ui/TransporteCard';
import TransporteDetailModal from '../Transporte/TransporteDetailModal';

import { transporteService } from '../../api/transporteService';
import { tourService } from '../../api/tourService';
import { hospedajeService } from '../../api/hospedajeService';

export default function ClientPage() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);

  const [hospedajes, setHospedajes] = useState([]);
  const [hospedajeActivo, setHospedajeActivo] = useState(null); // ✅ AGREGAR

  const [transportes, setTransportes] = useState([]);
  const [transporteActivo, setTransporteActivo] = useState(null);

  const [departamento, setDepartamento] = useState('Todos');
  const [precio, setPrecio] = useState('Todos');

  const toursFiltrados = tours.filter(t => {
    const depOk =
      departamento === 'Todos' || t.nombreDepartamento === departamento;

    const precioOk =
      precio === 'Todos' ||
      (precio === 'Económico' && t.precioBase <= 70) ||
      (precio === 'Regular' && t.precioBase > 70 && t.precioBase <= 110) ||
      (precio === 'VIP' && t.precioBase > 110);

    return depOk && precioOk;
  });

  useEffect(() => {
    tourService.getAll()
      .then(res => setTours(res.data.slice(0, 4)));

    hospedajeService.getAll()
      .then(res => setHospedajes(res.data.slice(0, 4)));

    transporteService.getAll()
      .then(res => setTransportes(res.data.slice(0, 4)));
  }, []);

  return (
    <div style={styles.page}>
      <Header />
      <div style={{ height: 70 }} />

      <Carousel />

      {/* TOURS */}
      <section style={styles.section}>
        <h2 style={styles.title}>🌄 Tours Destacados</h2>
        <div style={styles.grid}>
          {toursFiltrados.map(t => (
            <TourCard
              key={t.idTour}
              tour={t}
              onClick={() => setSelectedTour(t)}
            />
          ))}
        </div>
      </section>

      {selectedTour && (
        <TourModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {/* HOSPEDAJE */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.title}>🏨 Hospedajes</h2>
        <div style={styles.grid}>
          {hospedajes.map(h => (
            <HospedajeCard 
              key={h.idHospedaje} 
              hospedaje={h}
              onClick={() => setHospedajeActivo(h)} // ✅ AGREGAR onClick
            />
          ))}
        </div>
      </section>

      {/* ✅ MODAL HOSPEDAJE */}
      <HospedajeDetailModal
        hospedaje={hospedajeActivo}
        onClose={() => setHospedajeActivo(null)}
        onAdd={(item) => console.log('Añadido al carrito:', item)}
      />

      {/* TRANSPORTE */}
      <section style={styles.section}>
        <h2 style={styles.title}>🚌 Transporte</h2>
        <div style={styles.grid}>
          {transportes.map(t => (
            <TransporteCard
              key={t.idTransporte}
              transporte={t}
              onVerDetalle={setTransporteActivo}
            />
          ))}
        </div>
      </section>

      {/* MODAL TRANSPORTE */}
      <TransporteDetailModal
        transporte={transporteActivo}
        onClose={() => setTransporteActivo(null)}
        onAdd={(item) => console.log('Añadido al carrito:', item)}
      />

      <Footer />
    </div>
  );
}


const styles = {
  page: { 
    background: '#fcfcfc',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflowX: 'hidden'
  },
  filterWrapper: {
    position: 'relative',
    zIndex: 100,
    marginTop: '40px', 
    marginBottom: '20px',
    padding: '0 1rem',
    width: '100%', 
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2.5rem', 
    padding: '1rem 2.5rem',
    background: '#ffffff',
    borderRadius: '50px',
    margin: '0 auto',
    width: 'fit-content',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', 
    flexShrink: 0, 
  },
  filterLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  divider: {
    width: '1px',
    height: '40px',
    background: '#ddd'
  },
  buttons: { 
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'nowrap', 
  },
  btn: {
    padding: '0.5rem 1.2rem',
    borderRadius: '25px',
    border: '1px solid #e0e0e0',
    background: '#fcfcfc',
    color: '#555',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  activeBtn: {
    padding: '0.5rem 1.2rem',
    borderRadius: '25px',
    background: '#b84040',
    color: '#fff',
    border: '1px solid #b84040',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(184,64,64,0.3)',
  },
  section: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: '#fcfcfc',
  },
  sectionAlt: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: '#ffffff',
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '0.5rem', 
    color: '#333',
    fontWeight: '700'
  },
  subtitle: {
    color: '#777',
    marginBottom: '3rem',
    fontSize: '1.1rem'
  },
  grid: { 
    display: 'flex', 
    gap: '1.5rem', 
    justifyContent: 'center', 
    flexWrap: 'nowrap',
    maxWidth: '1250px',
    margin: '0 auto',
    overflowX: 'auto',
  },
  placeholderBox: {
    background: '#f0f0f0',
    padding: '3rem',
    borderRadius: '15px',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#888',
    border: '2px dashed #ccc'
  }
};