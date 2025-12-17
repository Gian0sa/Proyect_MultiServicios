import { useEffect, useState, useCallback } from 'react';

import hero1 from '../../img/machu.jpg';
import hero2 from '../../img/volcano.jpg';
import hero3 from '../../img/huacachina.webp';

const images = [
  { src: hero1, title: 'Descubre el Perú', subtitle: 'Viaja con experiencias únicas', btnText: 'Ver Destinos' },
  { src: hero2, title: 'Aventura y Cultura', subtitle: 'Paquetes hechos para ti', btnText: 'Explorar Tours' },
  { src: hero3, title: 'Viaja Seguro', subtitle: 'Transporte cómodo y confiable', btnText: 'Reservar Ahora' },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % images.length);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div style={styles.carouselWrapper}>
      <div style={styles.carouselContainer}>
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              opacity: index === current ? 1 : 0,
              visibility: index === current ? 'visible' : 'hidden',
            }}
          >
            <div style={{
              ...styles.background,
              backgroundImage: `url(${img.src})`,
              transform: index === current ? 'scale(1.05)' : 'scale(1)',
            }} />
            
            <div style={styles.overlay}>
              <div style={{
                ...styles.content,
                transform: index === current ? 'translateY(0)' : 'translateY(20px)',
                opacity: index === current ? 1 : 0,
              }}>
                <h1 style={styles.title}>{img.title}</h1>
                <p style={styles.subtitle}>{img.subtitle}</p>
                <button style={styles.button}>{img.btnText}</button>
              </div>
            </div>
          </div>
        ))}

        <button style={{ ...styles.arrow, left: '15px' }} onClick={prevSlide}>❮</button>
        <button style={{ ...styles.arrow, right: '15px' }} onClick={nextSlide}>❯</button>

        <div style={styles.dots}>
          {images.map((_, i) => (
            <div
              key={i}
              style={styles.dotWrapper}
              onClick={() => setCurrent(i)}
            >
              <span style={{
                ...styles.dot,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                width: i === current ? '25px' : '8px',
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  carouselWrapper: {
    padding: '20px 0', // Espacio arriba y abajo
    display: 'flex',
    justifyContent: 'center',
    background: '#fcfcfc',
  },
  carouselContainer: {
    position: 'relative',
    width: '95%', // No ocupa el 100% total
    maxWidth: '1200px', // Ancho máximo profesional
    height: '500px', // Altura fija para no ocupar toda la pantalla
    overflow: 'hidden',
    borderRadius: '24px', // Bordes redondeados elegantes
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    backgroundColor: '#000',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 1s ease-in-out, visibility 1s',
  },
  background: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'transform 6s ease-out',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end', // Texto abajo para no tapar la imagen
    paddingBottom: '60px',
    zIndex: 2,
  },
  content: {
    textAlign: 'center',
    color: '#fff',
    padding: '0 20px',
    transition: 'all 0.6s ease-out 0.2s',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 10px 0',
    textShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.1rem',
    fontWeight: '400',
    margin: '0 0 20px 0',
    opacity: 0.9,
  },
  button: {
    padding: '10px 25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#b84040', // Color Killa Travel
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 10,
  },
  dotWrapper: {
    cursor: 'pointer',
    padding: '5px',
  },
  dot: {
    display: 'block',
    height: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
};