import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paqueteService } from '../../api/paqueteService';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function PaqueteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    cargarPaquete();
  }, [id]);

  const cargarPaquete = async () => {
    try {
      setLoading(true);
      const res = await paqueteService.getById(id);
      console.log('Paquete completo:', res.data);
      setPaquete(res.data);
    } catch (error) {
      console.error("Error al cargar paquete:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconoServicio = (tipo) => {
    switch(tipo) {
      case 'TOUR': return '🌄';
      case 'TRANSPORTE': return '🚌';
      case 'HOSPEDAJE': return '🏨';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ height: 70 }} />
        <div style={styles.loading}>Cargando detalles del paquete...</div>
      </>
    );
  }

  if (!paquete) {
    return (
      <>
        <Header />
        <div style={{ height: 70 }} />
        <div style={styles.error}>
          <h2>Paquete no encontrado</h2>
          <button onClick={() => navigate('/paquetes')} style={styles.backBtn}>
            Volver a paquetes
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <div style={styles.container}>
        {/* Galería de imágenes grande */}
        <section style={styles.gallerySection}>
          <div style={styles.mainImage}>
            {paquete.imagenes && paquete.imagenes.length > 0 ? (
              <img 
                src={paquete.imagenes[imagenActiva].url} 
                alt={paquete.nombre}
                style={styles.imageMain}
              />
            ) : (
              <div style={styles.noImageLarge}>Sin imágenes disponibles</div>
            )}
          </div>

          {paquete.imagenes && paquete.imagenes.length > 1 && (
            <div style={styles.thumbnails}>
              {paquete.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Vista ${index + 1}`}
                  style={{
                    ...styles.thumbnail,
                    border: imagenActiva === index ? '3px solid #667eea' : '3px solid transparent'
                  }}
                  onClick={() => setImagenActiva(index)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Información principal */}
        <section style={styles.mainInfo}>
          <div style={styles.headerSection}>
            <div>
              <h1 style={styles.title}>{paquete.nombre}</h1>
              <p style={styles.description}>{paquete.descripcion}</p>
            </div>
            {paquete.esPromocion && (
              <div style={styles.promoBadge}>
                🔥 PROMOCIÓN ESPECIAL
              </div>
            )}
          </div>

          <div style={styles.priceBox}>
            <div style={styles.priceInfo}>
              <span style={styles.priceLabel}>Precio total del paquete</span>
              <span style={styles.priceValue}>S/ {paquete.precioTotal}</span>
            </div>
            <button 
              style={styles.reserveBtn}
              onClick={() => {
                console.log('Reservar paquete:', paquete);
                alert('Paquete añadido al carrito (función pendiente)');
              }}
            >
              RESERVAR AHORA
            </button>
          </div>
        </section>

        {/* Servicios incluidos */}
        <section style={styles.servicesSection}>
          <h2 style={styles.sectionTitle}>📦 Servicios Incluidos en este Paquete</h2>
          
          {paquete.servicios && paquete.servicios.length > 0 ? (
            <div style={styles.servicesList}>
              {paquete.servicios.map((servicio, index) => (
                <div key={index} style={styles.serviceCard}>
                  <div style={styles.serviceHeader}>
                    <div style={styles.serviceTitleBox}>
                      <span style={styles.serviceIcon}>
                        {getIconoServicio(servicio.tipoServicio)}
                      </span>
                      <div>
                        <span style={styles.serviceType}>{servicio.tipoServicio}</span>
                        <h3 style={styles.serviceName}>{servicio.nombreServicio}</h3>
                      </div>
                    </div>
                    <span style={styles.servicePrice}>S/ {servicio.precioBase}</span>
                  </div>

                  {/* Mini galería de imágenes del servicio */}
                  {servicio.imagenes && servicio.imagenes.length > 0 && (
                    <div style={styles.serviceImages}>
                      {servicio.imagenes.slice(0, 3).map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img.url}
                          alt={`${servicio.nombreServicio} ${imgIndex + 1}`}
                          style={styles.serviceImage}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noServices}>No hay servicios configurados</p>
          )}

          {paquete.esPromocion && (
            <div style={styles.savingsBox}>
              💰 ¡Ahorra comprando el paquete completo en lugar de servicios individuales!
            </div>
          )}
        </section>

        {/* Botón fijo inferior en móvil */}
        <div style={styles.floatingBtn}>
          <button 
            style={styles.reserveBtnMobile}
            onClick={() => {
              console.log('Reservar paquete:', paquete);
              alert('Paquete añadido al carrito (función pendiente)');
            }}
          >
            RESERVAR - S/ {paquete.precioTotal}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '80vh'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    color: '#64748b'
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#64748b'
  },
  backBtn: {
    marginTop: '1rem',
    padding: '12px 24px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  gallerySection: {
    marginBottom: '2rem'
  },
  mainImage: {
    width: '100%',
    height: '500px',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  imageMain: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  noImageLarge: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    color: '#94a3b8',
    fontSize: '1.2rem'
  },
  thumbnails: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    padding: '0.5rem 0'
  },
  thumbnail: {
    width: '120px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '10px',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'transform 0.2s'
  },
  mainInfo: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginBottom: '2rem'
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  description: {
    fontSize: '1.1rem',
    color: '#64748b',
    lineHeight: '1.6'
  },
  promoBadge: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
    whiteSpace: 'nowrap'
  },
  priceBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    gap: '2rem'
  },
  priceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  priceLabel: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    opacity: 0.9
  },
  priceValue: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: '800'
  },
  reserveBtn: {
    background: '#fff',
    color: '#667eea',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    whiteSpace: 'nowrap'
  },
  servicesSection: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  serviceCard: {
    background: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '15px',
    border: '2px solid #e2e8f0'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  serviceTitleBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  serviceIcon: {
    fontSize: '2.5rem'
  },
  serviceType: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block'
  },
  serviceName: {
    margin: '0.2rem 0 0 0',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  servicePrice: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#475569',
    background: '#e2e8f0',
    padding: '8px 16px',
    borderRadius: '10px'
  },
  serviceImages: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '1rem'
  },
  serviceImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px'
  },
  noServices: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '3rem',
    fontSize: '1.1rem',
    fontStyle: 'italic'
  },
  savingsBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#92400e'
  },
  floatingBtn: {
    display: 'none',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1rem',
    background: '#fff',
    boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
    zIndex: 100
  },
  reserveBtnMobile: {
    width: '100%',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer'
  }
};