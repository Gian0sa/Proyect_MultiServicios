import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Agregar item al carrito
  const addItem = (item, tipo) => {
    const newItem = {
      id: `${tipo}-${item.idTour || item.idTransporte || item.idHospedaje || item.idPaquete}`,
      tipo, // 'TOUR', 'TRANSPORTE', 'HOSPEDAJE', 'PAQUETE'
      data: item,
      cantidad: 1,
      precio: item.precioBase || item.precioTotal,
      nombre: item.nombre
    };

    // Verificar si ya existe
    const existente = items.find(i => i.id === newItem.id);
    if (existente) {
      setItems(items.map(i => 
        i.id === newItem.id 
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));
    } else {
      setItems([...items, newItem]);
    }
  };

  // Eliminar item del carrito
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Actualizar cantidad
  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeItem(id);
      return;
    }
    setItems(items.map(item => 
      item.id === id ? { ...item, cantidad } : item
    ));
  };

  // Limpiar carrito
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  // Calcular total
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount: items.length
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}