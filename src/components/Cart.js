import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart } = useContext(AppContext);
    const [localCart, setLocalCart] = useState(cart);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        setLocalCart(cart); // Sync local state with context state
    }, [cart]);

    const handleQuantityChange = async (id, quantity) => {
        try {
            // Ensure quantity is valid
            if (quantity < 1) {
                setFeedbackMessage('Quantity must be at least 1.');
                return;
            }

            // Update quantity in backend using api instance
            await api.put(`/cart/${id}`, { quantity });

            // Update local cart state
            setLocalCart(prevCart =>
                prevCart.map(item =>
                    item.id === id ? { ...item, quantity } : item
                )
            );
            setFeedbackMessage('Quantity updated successfully!');
            toast.success('Quantity updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
            setFeedbackMessage('Error updating quantity.');
            toast.error('Error updating quantity');
        }
    };

    return (
        <div className="cart">
            <h1>Cart</h1>
            {feedbackMessage && <p>{feedbackMessage}</p>}
            {localCart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {localCart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.imgSrc} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>₹ {item.price}</p>
                                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`quantity-${item.id}`}
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                />
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
