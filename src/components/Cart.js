import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { userId, cart, removeFromCart } = useContext(AppContext);
    const [localCart, setLocalCart] = useState(cart);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchCartItems(); // Fetch the latest cart items on component mount
    }, []);

    useEffect(() => {
        setLocalCart(cart); // Sync local state with context state
    }, [cart]);

    const fetchCartItems = async () => {
        try {
            const response = await api.get(`/cart/${userId}`, { withCredentials: true });
            setLocalCart(response.data);
            console.log('Fetched the cart from DB:', response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error('Error fetching cart items.');
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        try {
            if (quantity < 1) {
                setFeedbackMessage('Quantity must be at least 1.');
                return;
            }

            // Update quantity in backend using product ID in the query parameters
            await api.put(`/cart/${productId}?quantity=${quantity}`, {}, { withCredentials: true });

            // Update local cart state
            setLocalCart(prevCart =>
                prevCart.map(item =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
            );
            setFeedbackMessage('Quantity updated successfully!');
            toast.success('Quantity updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
            setFeedbackMessage('Error updating quantity.');
            toast.error('Error updating quantity.');
        }
    };

    // Handle checkout button click
    const handleCheckout = () => {
        navigate('/checkout'); // Redirect to the checkout page
    };

    return (
        <div className="cart">
            <h1>Cart</h1>
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
            {localCart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {localCart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.product.imgSrc} alt={item.product.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.product.name}</h3>
                                <p>₹ {item.product.price}</p>
                                <label htmlFor={`quantity-${item.product.id}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`quantity-${item.product.id}`}
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                                />
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {localCart.length > 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
};

export default Cart;
