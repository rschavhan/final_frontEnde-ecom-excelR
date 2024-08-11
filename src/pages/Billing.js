import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Billing.css';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
    const navigate = useNavigate();
    const { userId, cart, selectedAddress } = useContext(AppContext);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
    });

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
            // Prepare order payload
            const orderPayload = {
                user: { id: userId },          // User ID reference
                totalAmount: calculateTotalAmount(), // Function to calculate total amount
                orderDate: new Date().toISOString(), // Current date in ISO 8601 format
                status: 'Pending',              // Order status
            };

            // Send request to create an order
            const response = await api.post('/orders', orderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Payment successful!');
            // Navigate to order summary with order data
            navigate('/order-summary', { state: { order: response.data } });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Error processing payment.');
        }
    };

    // Mock function to calculate total amount based on cart items
    const calculateTotalAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="billing">
            <h1>Billing Information</h1>
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
