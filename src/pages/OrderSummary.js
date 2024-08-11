import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../styles/OrderSummary.css';

const OrderSummary = () => {
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Assuming you want to fetch specific order details, adapt the URL as needed
                const response = await api.get('/orders');
                console.log("order details: ", response.data);
                // Handle multiple orders if necessary, or select the relevant one
                // For example, use location.state.order if you're navigating with order details
                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Handle single order or first order in the list
                    setOrder(response.data[0]); // Adjust as necessary
                } else {
                    toast.error('No order details found.');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Error fetching order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location.state]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-summary">
            <h1>Order Summary</h1>
            {order ? (
                <div className="order-details">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Total Amount:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</p>
                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Address:</strong> {/* Display address details if needed */}</p>
                    {/* You might want to display cart items or other related details here */}
                </div>
            ) : (
                <p>No order details available.</p>
            )}
        </div>
    );
};

export default OrderSummary;
