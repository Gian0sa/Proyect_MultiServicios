import { useNavigate } from 'react-router-dom';

export default function TransporteCard({ transporte, onVerDetalle }) {

  const navigate = useNavigate();

  const imageUrl =
    transporte.imagenes && transporte.imagenes.length > 0
      ? transporte.imagenes[0].url
      : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957';

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleString([], {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const salida = formatTime(transporte.fechaSalida);
  const llegada = formatTime(transporte.fechaLlegada);

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={styles.imageContainer}>
        <img src={imageUrl} alt={transporte.nombre} style={styles.image} />
        <span
          style={{
            ...styles.tag,
            backgroundColor:
              transporte.categoria === 'VIP' ? '#f59e0b' : '#64748b',
          }}
        >
          {transporte.categoria}
        </span>
      </div>

      <div style={styles.body}>
        <div style={styles.header}>
          <h3 style={styles.name}>{transporte.nombre}</h3>
          <span style={styles.price}>S/ {transporte.precioBase}</span>
        </div>

        <p style={styles.desc}>{transporte.descripcion}</p>

        <div style={styles.infoSection}>
          <div style={styles.routeRow}>
            <span>📍</span>
            <span>
              {transporte.nombreDepartamentoOrigen} →{' '}
              {transporte.nombreDepartamentoDestino}
            </span>
          </div>

          <div style={styles.timeRow}>
            <span>🕒</span>
            <div>
              <div><small>Salida:</small> {salida}</div>
              <div><small>Llegada:</small> {llegada}</div>
            </div>
          </div>
        </div>

        <button
  style={styles.bookingBtn}
  onClick={() => onVerDetalle(transporte)}
>
  Ver detalle
</button>

      </div>
    </div>
  );
}


const styles = {
  card: {
    width: '280px',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease',
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    height: '160px',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  tag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: '#fff',
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  body: {
    padding: '1.2rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#b84040',
  },
  desc: {
    fontSize: '0.85rem',
    color: '#64748b',
    lineHeight: '1.4',
    margin: 0,
  },
  infoSection: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  routeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  routeText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  city: {
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  arrow: {
    color: '#94a3b8',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  icon: {
    fontSize: '0.9rem',
  },
  timeText: {
    fontSize: '0.75rem',
    color: '#475569',
    lineHeight: '1.5',
  },
  timeLabel: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  bookingBtn: {
    marginTop: '5px',
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: '#1e293b',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }
};