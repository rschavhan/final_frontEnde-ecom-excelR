import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item to the cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    toast.success('Product added successfully to cart!');
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </AppContext.Provider>
  );
};
