import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2>Order Manager</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>Order #{order.id} - {order.total}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManager;
