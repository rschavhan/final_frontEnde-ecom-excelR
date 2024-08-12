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
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  // Function to calculate the total amount in the cart
  const calculateTotalAmount = () => {
    const amount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setTotalAmount(amount);
  };

  // Call calculateTotalAmount whenever the cart updates
  useEffect(() => {
    calculateTotalAmount();
  }, [cart]);

  // Function to fetch the cart data from the API
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

  // Effect to retrieve user data from local storage on initial load
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

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

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Effect to fetch the cart data whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  // Function to add an item to the cart
  const addToCart = async (item) => {

    console.log("item:",item);
    if (!userId) {
        toast.error('Please log in to add items to the cart.');
        return;
    }

    // Ensure the item has valid product data
    if (!item || !item.price) {
        console.error('Invalid product data:', item);
        return;
    }

    try {
        // Check if the item already exists in the cart
        const existingItem = cart.find(cartItem => cartItem.product.id === item.id);

        if (existingItem) {
            // If item exists, update the quantity
            const newQuantity = existingItem.quantity + 1;
            await api.post(`/cart/add`, null, {
                params: { userId, productId: item.id, quantity: newQuantity },
                withCredentials: true
            });

            setCart(prevCart =>
                prevCart.map(cartItem =>
                    cartItem.product.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
                )
            );
        } else {
            // If item does not exist, add it to the cart
            await api.post(`/cart/add`, null, {
                params: { userId, productId: item.id, quantity: 1 },
                withCredentials: true
            });

            setCart(prevCart => [...prevCart, { product: item, quantity: 1 }]);
        }

        toast.success('Product added successfully to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Error adding to cart');
    }
  };

  // Function to remove an item from the cart
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

  // Function to handle user login
  const login = (userName, userId, roleName) => {
    setUserId(userId);
    setUserRole(roleName);
    setUserName(userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', JSON.stringify(roleName));
    localStorage.setItem('userName', userName);

    fetchCart();
    toast.success('Login successful!');
  };

  // Function to handle user logout
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
      localStorage.removeItem('userName');
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

  // Function to update the search query state
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <AppContext.Provider value={{ totalAmount, cart, addToCart, removeFromCart, userName, userId, userRole, login, isLoggingOut, logout, logoutMessage, searchQuery, updateSearchQuery, fetchCart }}>
      {children}
    </AppContext.Provider>
  );
};
