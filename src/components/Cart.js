import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const { userId, cart, removeFromCart } = useContext(AppContext);
    const [localCart, setLocalCart] = useState(cart);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        setLocalCart(cart);
    }, [cart]);

    useEffect(() => {
        calculateTotalAmount(localCart);
    }, [localCart]); // Recalculate total amount whenever localCart changes

    const fetchCartItems = async () => {
        try {
            const response = await api.get(`/cart/${userId}`, { withCredentials: true });
            console.log('Fetched the cart from DB:', response.data);
            setLocalCart(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error('Error fetching cart items.');
        }
    };

    const calculateTotalAmount = (cartItems = localCart) => {
        const total = cartItems.reduce((acc, item) => {
            if (item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
                return acc + item.product.price * item.quantity;
            }
            return acc;
        }, 0);
        console.log("Total amount:", total);
        setTotalAmount(total);
    };

    const handleQuantityChange = async (productId, quantity) => {
        try {
            if (quantity < 1) {
                setFeedbackMessage('Quantity must be at least 1.');
                return;
            }

            await api.put(`/cart/${productId}?quantity=${quantity}`, {}, { withCredentials: true });

            const updatedCart = localCart.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            );
            setLocalCart(updatedCart);
            setFeedbackMessage('Quantity updated successfully!');
            toast.success('Quantity updated successfully!');
        } catch (error) {
            console.error('Error updating quantity:', error);
            setFeedbackMessage('Error updating quantity.');
            toast.error('Error updating quantity.');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { totalAmount } });
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
                    <div className="cart-total">
                        <h2>Total Amount: ₹ {totalAmount.toFixed(2)}</h2>
                    </div>
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
