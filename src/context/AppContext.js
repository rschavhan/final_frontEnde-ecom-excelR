import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../services/api';


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    // Fetch user information from your backend or local storage
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const addToCart = async (item) => {
    if (!user) {
      toast.error('Please log in to add items to the cart.');
      return;
    }

    try {
      // Check if the item is already in the cart
      const existingItem = cart.find(cartItem => cartItem.product_id === item.id);

      if (existingItem) {
        // Update the quantity of the existing item in the cart
        const newQuantity = existingItem.quantity + 1;
        await axios.put(`http://localhost:8080/api/cart/${existingItem.id}`, { quantity: newQuantity });

        // Update the local cart state
        setCart(prevCart =>
          prevCart.map(cartItem =>
            cartItem.product_id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
          )
        );
      } else {
        // Add new item to the cart
        const response = await axios.post('http://localhost:8080/api/cart', {
          product_id: item.id,
          user_id: user.id,
          quantity: 1,
        });

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
      await axios.delete(`http://localhost:8080/api/cart/${id}`);
      setCart(cart.filter(item => item.id !== id));
      toast.success('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item');
    }
  };

  const login = (userData) => {
    setUser(userData);
    toast.success('Login successful!');
  };

  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutMessage(''); // Clear previous message
    try {
      await api.post('/auth/logout');
      setUser(null);
      setCart([]);
      setLogoutMessage('Logged out successfully!');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
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
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, user, login, isLoggingOut,logout,logoutMessage, searchQuery, updateSearchQuery}}>
      {children}
    </AppContext.Provider>
  );
};
