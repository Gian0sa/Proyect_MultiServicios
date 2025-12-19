import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Carrito/CartContext';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/api';

import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import qrYape from '../../img/qr_yape1.png';

// ENUM backend
const VentaItemType = {
  SERVICIO: 0,
  PAQUETE: 1
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();

  const [metodoPago, setMetodoPago] = useState('YAPE');
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [idVenta, setIdVenta] = useState(null);
  const [error, setError] = useState('');

  /* ============================
     🔴 REDIRECCIÓN
     ============================ */
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  /* ============================
     CONFIRMAR PAGO
     ============================ */
  const handleConfirmarPago = async () => {
    setConfirmado(true);
    setLoading(true);
    setError('');

    try {
      const ventaDto = {
        detalles: items.map(item => ({
          tipoItem:
            item.tipo === 'PAQUETE'
              ? VentaItemType.PAQUETE
              : VentaItemType.SERVICIO,

          idServicio:
            item.tipo !== 'PAQUETE'
              ? item.data.idServicio ||
                item.data.idTour ||
                item.data.idHospedaje ||
                item.data.idTransporte
              : null,

          idPaquete:
            item.tipo === 'PAQUETE'
              ? item.data.idPaquete
              : null,

          cantidad: item.cantidad
        }))
      };

      // 🔥 AXIOS CON INTERCEPTOR (TOKEN AUTOMÁTICO)
      const { data } = await api.post('/Venta', ventaDto);

      setIdVenta(data.idVenta);
      setPagoExitoso(true);
      clearCart();

    } catch (error) {
      console.error('Error venta:', error);
      setError('❌ Error al procesar la venta. Por favor, intenta nuevamente.');
      setConfirmado(false);
      setLoading(false);
    }
  };

  const qrImages = {
    YAPE: qrYape,
    PLIN: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=QR+PLIN',
    TRANSFERENCIA: 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=QR+BANCO'
  };

  const totalConIGV = total * 1.18;

  /* ============================
     RENDER
     ============================ */
  
  // Si el pago fue exitoso, mostrar pantalla de confirmación
  if (pagoExitoso) {
    return (
      <>
        <Header />
        <div style={{ height: 70 }} />
        <div style={styles.confirmationContainer}>
          <div style={styles.confirmationCard}>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.confirmationTitle}>¡Pago Confirmado!</h1>
            <p style={styles.confirmationMessage}>
              Tu compra ha sido procesada exitosamente
            </p>
            <div style={styles.confirmationDetails}>
              <p style={styles.orderId}>ID de Compra: <strong>#{idVenta}</strong></p>
              <p style={styles.redirectMessage}>
                Serás redirigido a tu historial de compras en unos segundos...
              </p>
            </div>
            <div style={styles.checkmarkAnimation}>
              <div style={styles.checkmarkCircle}>
                <svg style={styles.checkmarkSvg} viewBox="0 0 52 52">
                  <circle 
                    style={styles.checkmarkCircleFill} 
                    cx="26" 
                    cy="26" 
                    r="25" 
                    fill="none"
                  />
                  <path 
                    style={styles.checkmarkCheck} 
                    fill="none" 
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/mis-compras', { 
                state: { 
                  mensajeExito: `✅ Compra realizada exitosamente. ID de compra: #${idVenta}` 
                } 
              })}
              style={styles.goToHistoryBtn}
            >
              Ver mi historial de compras
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <div style={styles.container}>
        <h1 style={styles.title}>💳 Finalizar Compra</h1>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <div style={styles.content}>
          {/* RESUMEN */}
          <div style={styles.orderSection}>
            <h2 style={styles.sectionTitle}>Tu pedido</h2>

            {items.map(item => (
              <div key={item.id} style={styles.orderItem}>
                <span>{item.nombre} x{item.cantidad}</span>
                <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}

            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div style={styles.totalRow}>
                <span>IGV (18%)</span>
                <span>S/ {(total * 0.18).toFixed(2)}</span>
              </div>
              <div style={styles.totalFinal}>
                <span>Total</span>
                <span>S/ {totalConIGV.toFixed(2)}</span>
              </div>
            </div>

            <div style={styles.clientInfo}>
              <p><strong>Cliente:</strong> {user?.nombre}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </div>

          {/* PAGO */}
          <div style={styles.paymentSection}>
            <h2 style={styles.sectionTitle}>Método de pago</h2>

            <div style={styles.paymentMethods}>
              {['YAPE', 'PLIN', 'TRANSFERENCIA'].map(m => (
                <button
                  key={m}
                  onClick={() => setMetodoPago(m)}
                  style={{
                    ...styles.methodBtn,
                    ...(metodoPago === m ? styles.methodBtnActive : {})
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div style={styles.qrSection}>
              <img src={qrImages[metodoPago]} alt="QR" style={styles.qrImage} />
              <p>Monto: <strong>S/ {totalConIGV.toFixed(2)}</strong></p>
            </div>

            <button
              onClick={handleConfirmarPago}
              disabled={confirmado || loading}
              style={styles.confirmBtn}
            >
              {loading ? 'Procesando...' : 'Ya realicé el pago'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ============================
   STYLES
   ============================ */
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '80vh'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '2rem'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  orderSection: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '1.5rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.8rem',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  totals: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '1rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  totalFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.4rem',
    fontWeight: '800',
    marginTop: '1rem'
  },
  clientInfo: {
    marginTop: '2rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '10px'
  },
  paymentSection: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  paymentMethods: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  methodBtn: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  methodBtnActive: {
    borderColor: '#667eea',
    background: '#f0f4ff'
  },
  qrSection: {
    textAlign: 'center',
    padding: '2rem',
    background: '#f8fafc',
    borderRadius: '15px',
    marginBottom: '1.5rem'
  },
  qrImage: {
    width: '300px',
    height: '300px',
    borderRadius: '15px'
  },
  confirmBtn: {
    width: '100%',
    padding: '16px',
    background: '#10b981',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s'
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    border: '1px solid #fecaca',
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  confirmationContainer: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem'
  },
  confirmationCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'fadeInScale 0.5s ease-out',
  },
  successIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    animation: 'bounceIn 0.6s ease-out',
  },
  confirmationTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  confirmationMessage: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem'
  },
  confirmationDetails: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  orderId: {
    fontSize: '1.1rem',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  redirectMessage: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic'
  },
  checkmarkAnimation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmarkCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    animation: 'scaleIn 0.5s ease-out 0.3s both',
  },
  checkmarkSvg: {
    width: '50px',
    height: '50px'
  },
  checkmarkCircleFill: {
    stroke: '#10b981',
    strokeWidth: 2,
    strokeDasharray: 166,
    strokeDashoffset: 166,
    animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
  },
  checkmarkCheck: {
    stroke: '#ffffff',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: 48,
    strokeDashoffset: 48,
    animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards',
  },
  goToHistoryBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
  },
};
