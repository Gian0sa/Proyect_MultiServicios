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

      alert(`✅ Venta registrada correctamente\nID Venta: ${data.idVenta}`);
      clearCart();
      navigate('/');

    } catch (error) {
      console.error('Error venta:', error);
      alert('❌ Error al procesar la venta');
      setConfirmado(false);
    } finally {
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
  return (
    <>
      <Header />
      <div style={{ height: 70 }} />

      <div style={styles.container}>
        <h1 style={styles.title}>💳 Finalizar Compra</h1>

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
    cursor: 'pointer'
  }
};
