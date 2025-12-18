import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Carrito/CartContext';
import { useAuth } from '../../auth/AuthContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import qrYape from '../../img/qr_yape1.png';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [metodoPago, setMetodoPago] = useState('YAPE'); // YAPE, PLIN, TRANSFERENCIA
  const [confirmado, setConfirmado] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleConfirmarPago = () => {
    setConfirmado(true);
    // Aquí irá la llamada al backend para registrar la venta
    setTimeout(() => {
      alert('¡Pago registrado! Recibirás un email de confirmación');
      clearCart();
      navigate('/');
    }, 2000);
  };

  const qrImages = {
    YAPE: qrYape,
    PLIN: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=QR+PLIN',
    TRANSFERENCIA: 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=QR+BANCO'
  };

  const totalConIGV = total * 1.18;

  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <div style={styles.container}>
        <h1 style={styles.title}>💳 Finalizar Compra</h1>

        <div style={styles.content}>
          {/* Resumen del pedido */}
          <div style={styles.orderSection}>
            <h2 style={styles.sectionTitle}>Tu pedido</h2>
            
            <div style={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} style={styles.orderItem}>
                  <div>
                    <span style={styles.orderItemName}>{item.nombre}</span>
                    <span style={styles.orderItemQty}> x{item.cantidad}</span>
                  </div>
                  <span style={styles.orderItemPrice}>
                    S/ {(item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

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
                <span>Total a pagar</span>
                <span>S/ {totalConIGV.toFixed(2)}</span>
              </div>
            </div>

            {/* Datos del cliente */}
            <div style={styles.clientInfo}>
              <h3 style={styles.clientTitle}>Datos de contacto</h3>
              <p style={styles.clientData}>
                <strong>Nombre:</strong> {user?.nombre || 'Usuario'}
              </p>
              <p style={styles.clientData}>
                <strong>Email:</strong> {user?.email || 'email@ejemplo.com'}
              </p>
            </div>
          </div>

          {/* Método de pago */}
          <div style={styles.paymentSection}>
            <h2 style={styles.sectionTitle}>Método de pago</h2>

            <div style={styles.paymentMethods}>
              <button
                onClick={() => setMetodoPago('YAPE')}
                style={{
                  ...styles.methodBtn,
                  ...(metodoPago === 'YAPE' ? styles.methodBtnActive : {})
                }}
              >
                💜 YAPE
              </button>
              <button
                onClick={() => setMetodoPago('PLIN')}
                style={{
                  ...styles.methodBtn,
                  ...(metodoPago === 'PLIN' ? styles.methodBtnActive : {})
                }}
              >
                💙 PLIN
              </button>
              <button
                onClick={() => setMetodoPago('TRANSFERENCIA')}
                style={{
                  ...styles.methodBtn,
                  ...(metodoPago === 'TRANSFERENCIA' ? styles.methodBtnActive : {})
                }}
              >
                🏦 Transferencia
              </button>
            </div>

            {/* QR Code */}
            <div style={styles.qrSection}>
              <h3 style={styles.qrTitle}>Escanea el código QR</h3>
              <img 
                src={qrImages[metodoPago]} 
                alt={`QR ${metodoPago}`}
                style={styles.qrImage}
              />
              <p style={styles.qrInstructions}>
                1. Abre tu app de {metodoPago}<br />
                2. Escanea el código QR<br />
                3. Ingresa el monto: <strong>S/ {totalConIGV.toFixed(2)}</strong><br />
                4. Confirma el pago y presiona el botón abajo
              </p>
            </div>

            {/* Botón de confirmación */}
            <button
              onClick={handleConfirmarPago}
              disabled={confirmado}
              style={{
                ...styles.confirmBtn,
                ...(confirmado ? styles.confirmBtnDisabled : {})
              }}
            >
              {confirmado ? '✓ Procesando pago...' : 'Ya realicé el pago'}
            </button>

            <p style={styles.disclaimer}>
              * Al confirmar, nuestro equipo verificará tu pago y recibirás un email de confirmación en las próximas horas.
            </p>
          </div>
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
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1e293b',
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    height: 'fit-content'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.8rem',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  orderItemName: {
    fontSize: '0.95rem',
    color: '#1e293b',
    fontWeight: '600'
  },
  orderItemQty: {
    fontSize: '0.85rem',
    color: '#64748b'
  },
  orderItemPrice: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  totals: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '1rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    fontSize: '0.95rem',
    color: '#64748b'
  },
  totalFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1e293b',
    borderTop: '2px solid #e2e8f0',
    marginTop: '0.5rem'
  },
  clientInfo: {
    marginTop: '2rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '10px'
  },
  clientTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.8rem'
  },
  clientData: {
    fontSize: '0.9rem',
    color: '#475569',
    margin: '0.3rem 0'
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
    gap: '1rem',
    marginBottom: '2rem'
  },
  methodBtn: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    background: '#fff',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  methodBtnActive: {
    borderColor: '#667eea',
    background: '#f0f4ff',
    color: '#667eea'
  },
  qrSection: {
    textAlign: 'center',
    padding: '2rem',
    background: '#f8fafc',
    borderRadius: '15px',
    marginBottom: '1.5rem'
  },
  qrTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  qrImage: {
    width: '300px',
    height: '300px',
    borderRadius: '15px',
    marginBottom: '1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  qrInstructions: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.8',
    textAlign: 'left',
    maxWidth: '350px',
    margin: '0 auto'
  },
  confirmBtn: {
    width: '100%',
    padding: '16px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  confirmBtnDisabled: {
    background: '#94a3b8',
    cursor: 'not-allowed'
  },
  disclaimer: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '1rem',
    fontStyle: 'italic'
  }
};