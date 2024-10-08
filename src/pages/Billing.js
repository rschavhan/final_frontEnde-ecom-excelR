import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../styles/Billing.css';
import { AppContext } from '../context/AppContext';

const Billing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useContext(AppContext); // Retrieve userId from context
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
    });

    // Retrieve the total amount from location state
    const totalAmount = location.state?.totalAmount || 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo({
            ...paymentInfo,
            [name]: value,
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const orderPayload = {
                totalAmount, // Use the totalAmount directly
                orderDate: new Date().toISOString(),
                status: 'Pending',
            };

            // POST order to /orders/user/{userId}
            const response = await api.post(`/orders/user/${userId}`, orderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Clear the cart after a successful payment
            await clearCart();

            toast.success('Payment successful!');
            navigate('/order-summary', { state: { order: response.data } });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Error processing payment.');
        }
    };

    const clearCart = async () => {
        try {
            // Send a request to clear the cart
            await api.delete(`/cart/user/${userId}`, { withCredentials: true });
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Error clearing cart.');
        }
    };

    const formatAmount = (amount) => {
        if (isNaN(amount)) {
            return '₹0';
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="billing">
            <h1>Billing Information</h1>
            <h2>Total Amount: {formatAmount(totalAmount)}</h2> {/* Display total amount here */}
            <form onSubmit={handlePayment}>
                <label>
                    Card Number:
                    <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Expiry Date:
                    <input
                        type="text"
                        name="cardExpiry"
                        value={paymentInfo.cardExpiry}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    CVC:
                    <input
                        type="text"
                        name="cardCvc"
                        value={paymentInfo.cardCvc}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Billing;
