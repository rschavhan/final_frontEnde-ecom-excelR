// src/components/ProductCard.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(AppContext);

  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
