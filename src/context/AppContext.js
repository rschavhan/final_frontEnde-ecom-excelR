import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null); // Store userId here
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch cart if userId is available
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) return;

    try {
      console.log('Fetching cart for user ID:', userId); // Debugging line
      const response = await api.get(`/cart/${userId}`, { withCredentials: true });
      console.log('Cart data:', response.data); // Debugging line
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error fetching cart');
    }
  };

  const addToCart = async (item) => {
    if (!userId) {
      toast.error('Please log in to add items to the cart.');
      return;
    }

    try {
      // Check if the item is already in the cart
      const existingItem = cart.find(cartItem => cartItem.product_id === item.id);

      if (existingItem) {
        // Update the quantity of the existing item in the cart
        const newQuantity = existingItem.quantity + 1;
        await api.put(`/cart/${existingItem.id}`, { quantity: newQuantity }, { withCredentials: true });

        // Update the local cart state
        setCart(prevCart =>
          prevCart.map(cartItem =>
            cartItem.product_id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
          )
        );
      } else {
        // Add new item to the cart
        const response = await api.post('/cart', {
          product_id: item.id,
          user_id: userId,
          quantity: 1,
        }, { withCredentials: true });

        // Update the local cart state
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

  const login = (userId) => {
    setUserId(userId); // Store userId in state
    localStorage.setItem('userId', userId);
    fetchCart(); // Fetch cart data after setting userId
    toast.success('Login successful!');
  };

//  const logout = async () => {
//    setIsLoggingOut(true);
//    setLogoutMessage(''); // Clear previous message
//    try {
//        // Send a POST request to the logout endpoint
//        await api.post('/auth/logout', {}, { withCredentials: true });

//        // Clear userId and other states
//        setUserId(null); // If you use `user` instead of `userId` for state management
//        setCart([]);
//        localStorage.removeItem('userId');
//        setLogoutMessage('Logged out successfully!');
//        toast.success('Logged out successfully!');
//    } catch (error) {
//        console.error('Error logging out:', error.response ? error.response.data : error.message);
//        setLogoutMessage('Error logging out. Please try again.');
//        toast.error('Error logging out');
//    } finally {
//        setIsLoggingOut(false);
//    }
//};

const logout = async () => {
  setIsLoggingOut(true);
  setLogoutMessage(''); // Clear previous message
  try {
      // Send a POST request to the logout endpoint
      await api.post('/auth/logout', {}, { withCredentials: true });

      // Clear userId and other frontend states
      setUserId(null); // Clear userId
      setCart([]); // Clear cart for frontend
      localStorage.removeItem('userId');

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
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, userId, login, isLoggingOut, logout, logoutMessage, searchQuery, updateSearchQuery, fetchCart }}>
      {children}
    </AppContext.Provider>
  );
};
