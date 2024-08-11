import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/ProductManager.css';

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
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

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
      setShowForm(false); // Hide the form after adding the product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="product-manager">
      <h2>Product Manager</h2>

      {/* Button to Show Form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Add Product Form' : 'Show Add Product Form'}
      </button>

      {/* Conditional Rendering of Form */}
      {showForm && (
        <div className="add-product-form">
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
        </div>
      )}

      {/* Product List */}
      <ul className="product-list">
        {products.map(product => (
          <li key={product.id}>
            <img src={product.imgSrc} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
