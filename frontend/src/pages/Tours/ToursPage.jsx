import { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TourCard from '../../components/ui/TourCard';
import TourModal from './TourModal';
import { tourService } from '../../api/tourService';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    tourService.getAll()
      .then(res => setTours(res.data)) // 👈 SIN slice
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header/>
      <div style={{ height: '70px' }}></div>

      <section style={styles.section}>
        <h2 style={styles.title}>🌄 Todos los Tours</h2>
        <div style={styles.grid}>
          {tours.map(t => (
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

      <Footer />
    </>
  );
}

const styles = {
  section: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  grid: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};
