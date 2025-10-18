import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await API.get('/api/cart');
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post('/api/cart', { productId, quantity });
      setCart(data);
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/api/cart/${productId}`);
      setCart(data);
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;