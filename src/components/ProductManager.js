import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imgSrc: '',
    category: '',
    storage: '',
    color: '',
    brand: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      const response = await api.post('/products/add', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        price: '',
        imgSrc: '',
        category: '',
        storage: '',
        color: '',
        brand: '',
      }); // Reset form after adding product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Product Manager</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleChange}
      />
      <input
        type="text"
        name="imgSrc"
        placeholder="Image Source"
        value={newProduct.imgSrc}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={newProduct.category}
        onChange={handleChange}
      />
      <input
        type="text"
        name="storage"
        placeholder="Storage"
        value={newProduct.storage}
        onChange={handleChange}
      />
      <input
        type="text"
        name="color"
        placeholder="Color"
        value={newProduct.color}
        onChange={handleChange}
      />
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={newProduct.brand}
        onChange={handleChange}
      />
      <button onClick={addProduct}>Add Product</button>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
