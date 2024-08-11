import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'; // Import AppContext
import '../styles/OrderSummary.css';

const OrderSummary = () => {
    const location = useLocation();
    const { userId } = useContext(AppContext); // Get userId from context
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders/user/${userId}`);
                console.log("Orders fetched:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setOrders(response.data);
                } else {
                    toast.error('No orders found.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Error fetching orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-summary">
            <h1>Order Summary</h1>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-details">
                        <div className="order-header">
                            <h2>Order ID: {order.id}</h2>
                            <p><strong>Total Amount:</strong> ₹ {order.totalAmount !== null ? order.totalAmount.toFixed(2) : 'N/A'}</p>
                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p className="status"><strong>Status:</strong> {order.status}</p>
                            <p className="address"><strong>Address:</strong> {order.user.addresses.length > 0 ? order.user.addresses.map(address => (
                                <span key={address.id}>
                                    {address.addressLine1}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                                </span>
                            )) : 'N/A'}</p>
                        </div>
                        <div className="products-section">
                            <h3>Products in this Order:</h3>
                            {/* Handle product display if applicable */}
                            <p>No products available for this order.</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderSummary;
