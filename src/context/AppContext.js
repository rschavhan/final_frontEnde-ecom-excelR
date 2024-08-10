import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCart = useCallback(async () => {
    if (!userId) return;

    try {
      console.log('Fetching cart for user ID:', userId);
      const response = await api.get(`/cart/${userId}`, { withCredentials: true });
      console.log('Cart data:', response.data);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error fetching cart');
    }
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (storedUserId) {
      setUserId(storedUserId);
    }
    
    if (storedUserRole) {
      try {
        setUserRole(JSON.parse(storedUserRole));
      } catch (error) {
        console.error('Error parsing userRole from localStorage:', error);
        setUserRole([]); // Default to empty array if parsing fails
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const addToCart = async (item) => {
    if (!userId) {
      toast.error('Please log in to add items to the cart.');
      return;
    }
  
    try {
      const existingItem = cart.find(cartItem => cartItem.product_id === item.id);
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await api.put(`/cart/${existingItem.id}`, { quantity: newQuantity }, { withCredentials: true });
        
        setCart(prevCart => 
          prevCart.map(cartItem => 
            cartItem.product_id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
          )
        );
      } else {
        const response = await api.post('/cart', { product_id: item.id, user_id: userId, quantity: 1 }, { withCredentials: true });
        setCart(prevCart => [...prevCart, { ...response.data, product: item }]);
      }
  
      toast.success('Product added successfully to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
  };
  

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`, { withCredentials: true });
      setCart(cart.filter(item => item.id !== id));
      toast.success('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item');
    }
  };

  const login = (userName,userId, roleName) => {
    setUserId(userId);
    setUserRole(roleName);
    setUserName(userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', JSON.stringify(roleName));
    localStorage.setItem('userRole', JSON.stringify(userName));

    fetchCart();
    toast.success('Login successful!');
  };

  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutMessage('');
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      setUserId(null);
      setUserRole([]);
      setCart([]);
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      setLogoutMessage('Logged out successfully!');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
      setLogoutMessage('Error logging out. Please try again.');
      toast.error('Error logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, userName,userId, userRole, login, isLoggingOut, logout, logoutMessage, searchQuery, updateSearchQuery, fetchCart }}>
      {children}
    </AppContext.Provider>
  );
};
