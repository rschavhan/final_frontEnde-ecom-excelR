// import React, { useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// import './Cart.css';

// const Cart = () => {
//   const { cart, setCart, removeFromCart } = useContext(AppContext);

//   const handleQuantityChange = (id, quantity) => {
//     setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
//     toast.success('Product added successfully to cart!');
//   };

//   return (
//     <div className="cart">
//       <h1>Cart</h1>
//       {cart.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <div className="cart-items">
//           {cart.map(item => (
//             <div key={item.id} className="cart-item">
//               <img src={item.imgSrc} alt={item.name} className="cart-item-image" />
//               <div className="cart-item-details">
//                 <h3>{item.name}</h3>
//                 <p>${item.price}</p>
//                 <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
//                 <input
//                   type="number"
//                   id={`quantity-${item.id}`}
//                   value={item.quantity}
//                   min="1"
//                   onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
//                 />
//                 <button onClick={() => removeFromCart(item.id)}>Remove</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';

const Cart = () => {
  const { user } = useContext(AppContext); // Assuming you have a user context to get the logged-in user
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Error fetching cart items');
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    try {
      await axios.put(`http://localhost:8080/api/cart/${id}`, { quantity });
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
      toast.success('Quantity updated successfully!');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error updating quantity');
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${id}`);
      setCart(cart.filter(item => item.id !== id));
      toast.success('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item');
    }
  };

  return (
    <div className="cart">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.product.imgSrc} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p>${item.product.price}</p>
                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                />
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;

