import { useNavigate } from 'react-router-dom';
import { useCart } from '../Carrito/CartContext';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const getIcon = (tipo) => {
    switch(tipo) {
      case 'TOUR': return '🌄';
      case 'TRANSPORTE': return '🚌';
      case 'HOSPEDAJE': return '🏨';
      case 'PAQUETE': return '📦';
      default: return '📦';
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div style={{ height: 70 }} />
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🛒</span>
          <h2 style={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p style={styles.emptyText}>Agrega servicios o paquetes para continuar</p>
          <button onClick={() => navigate('/')} style={styles.continueBtn}>
            Explorar servicios
          </button>
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
        <h1 style={styles.title}>🛒 Mi Carrito</h1>

        <div style={styles.content}>
          {/* Lista de items */}
          <div style={styles.itemsSection}>
            {items.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemIcon}>{getIcon(item.tipo)}</span>
                  <div style={styles.itemDetails}>
                    <span style={styles.itemType}>{item.tipo}</span>
                    <h3 style={styles.itemName}>{item.nombre}</h3>
                    <span style={styles.itemPrice}>S/ {item.precio}</span>
                  </div>
                </div>

                <div style={styles.itemActions}>
                  <div style={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      style={styles.quantityBtn}
                    >
                      -
                    </button>
                    <span style={styles.quantity}>{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      style={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>

                  <span style={styles.subtotal}>
                    S/ {(item.precio * item.cantidad).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={styles.removeBtn}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Resumen de compra</h2>
            
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>IGV (18%)</span>
              <span>S/ {(total * 0.18).toFixed(2)}</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>S/ {(total * 1.18).toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={styles.checkoutBtn}
            >
              Proceder al pago
            </button>

            <button
              onClick={clearCart}
              style={styles.clearBtn}
            >
              Vaciar carrito
            </button>
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
    gridTemplateColumns: '1fr 400px',
    gap: '2rem'
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    gap: '1rem'
  },
  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1
  },
  itemIcon: {
    fontSize: '2.5rem'
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  itemType: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  itemName: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  itemPrice: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500'
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f1f5f9',
    borderRadius: '10px',
    padding: '0.3rem'
  },
  quantityBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    background: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#475569'
  },
  quantity: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1rem'
  },
  subtotal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#1e293b',
    minWidth: '100px',
    textAlign: 'right'
  },
  removeBtn: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1.3rem',
    padding: '0.5rem',
    opacity: 0.6,
    transition: 'opacity 0.2s'
  },
  summary: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    height: 'fit-content',
    position: 'sticky',
    top: '90px'
  },
  summaryTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.8rem 0',
    fontSize: '0.95rem',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1e293b',
    marginTop: '0.5rem'
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '1.5rem',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  clearBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '0.8rem',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    opacity: 0.3
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  emptyText: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '2rem'
  },
  continueBtn: {
    padding: '14px 32px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
};