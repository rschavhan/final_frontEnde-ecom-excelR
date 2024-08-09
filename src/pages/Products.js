import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext'; // Import SearchContext
import ProductCard from '../components/ProductCard'; // Import the ProductCard component
import '../styles/Products.css';

const Products = () => {
  const { addToCart } = useContext(AppContext);
  const { searchQuery } = useSearch(); // Use SearchContext
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the selected product

  const initialProducts = [
    { id: 1, name: 'Phone 128gb', price: 300, imgSrc: 'deal-phone1.jpg', category: 'phone', storage: '128GB', color: 'Black', brand: 'Brand A' },
    { id: 2, name: 'Phone 2', price: 300, imgSrc: 'deal-phone2.jpg', category: 'phone', storage: '64GB', color: 'White', brand: 'Brand B' },
    { id: 3, name: 'Shoe 1', price: 50, imgSrc: 'path/to/shoe1.jpg', category: 'footwear', size: '42', color: 'Red', brand: 'Brand A' },
    { id: 4, name: 'Shoe 2', price: 70, imgSrc: 'path/to/shoe2.jpg', category: 'footwear', size: '44', color: 'Blue', brand: 'Brand B' },
    { id: 5, name: 'Shirt', price: 30, imgSrc: 'path/to/shirt.jpg', category: 'clothes', size: 'M', color: 'Red', gender: 'Men', brand: 'Brand C' },
    // Add more products as needed
  ];

  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({ storage: [], color: [], size: [], gender: [], brand: [] });

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredProducts(
      initialProducts.filter(product =>
        (category === 'all' || product.category === category) &&
        product.name.toLowerCase().includes(query) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
      )
    );
  }, [searchQuery, category, priceRange]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    switch(selectedCategory) {
      case 'phone':
        setFilters({
          storage: ['128GB', '64GB'],
          color: ['Black', 'White'],
          size: [],
          gender: [],
          brand: ['Brand A', 'Brand B']
        });
        break;
      case 'footwear':
        setFilters({
          color: ['Red', 'Blue'],
          size: ['42', '44'],
          gender: [],
          brand: ['Brand A', 'Brand B']
        });
        break;
      case 'clothes':
        setFilters({
          color: ['Red', 'Blue'],
          size: ['S', 'M', 'L'],
          gender: ['Men', 'Women'],
          brand: ['Brand C', 'Brand D']
        });
        break;
      default:
        setFilters({ storage: [], color: [], size: [], gender: [], brand: [] });
    }
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split(',').map(Number);
    setPriceRange([min, max]);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Set the selected product when a product is clicked
  };

  const handleCloseProductCard = () => {
    setSelectedProduct(null); // Clear the selected product when the ProductCard is closed
  };

  return (
    <div className="products-container">
      <div className="filters">
        <fieldset>
          <legend>Category:</legend>
          <label>
            <input
              type="radio"
              value="all"
              checked={category === 'all'}
              onChange={handleCategoryChange}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              value="phone"
              checked={category === 'phone'}
              onChange={handleCategoryChange}
            />
            Phones
          </label>
          <label>
            <input
              type="radio"
              value="footwear"
              checked={category === 'footwear'}
              onChange={handleCategoryChange}
            />
            Footwear
          </label>
          <label>
            <input
              type="radio"
              value="clothes"
              checked={category === 'clothes'}
              onChange={handleCategoryChange}
            />
            Clothes
          </label>
        </fieldset>
        {category && (
          <div className="filter-options">
            {filters.storage && filters.storage.length > 0 && (
              <div className="filter-group">
                <h4>Storage</h4>
                {filters.storage.map(storage => (
                  <label key={storage}>
                    <input type="checkbox" /> {storage}
                  </label>
                ))}
              </div>
            )}
            {filters.color && filters.color.length > 0 && (
              <div className="filter-group">
                <h4>Color</h4>
                {filters.color.map(color => (
                  <label key={color}>
                    <input type="checkbox" /> {color}
                  </label>
                ))}
              </div>
            )}
            {filters.size && filters.size.length > 0 && (
              <div className="filter-group">
                <h4>Size</h4>
                {filters.size.map(size => (
                  <label key={size}>
                    <input type="checkbox" /> {size}
                  </label>
                ))}
              </div>
            )}
            {filters.gender && filters.gender.length > 0 && (
              <div className="filter-group">
                <h4>Gender</h4>
                {filters.gender.map(gender => (
                  <label key={gender}>
                    <input type="checkbox" /> {gender}
                  </label>
                ))}
              </div>
            )}
            {filters.brand && filters.brand.length > 0 && (
              <div className="filter-group">
                <h4>Brand</h4>
                {filters.brand.map(brand => (
                  <label key={brand}>
                    <input type="checkbox" /> {brand}
                  </label>
                ))}
              </div>
            )}
            <div className="filter-group">
              <h4>Price Range</h4>
              <input
                type="range"
                min="0"
                max="80000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange({ target: { value: `${e.target.value},${priceRange[1]}` } })}
                step="10"
                style={{ marginBottom: '10px' }}
              />
              <input
                type="range"
                min="0"
                max="80000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange({ target: { value: `${priceRange[0]},${e.target.value}` } })}
                step="10"
                style={{ marginBottom: '10px' }}
              />
              <p>₹ {priceRange[0]} - ₹ {priceRange[1]}</p>
            </div>
          </div>
        )}
      </div>
      <div className="products">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            readOnly
          />
        </div>
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product" onClick={() => handleProductClick(product)}>
                <img src={product.imgSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <div className="product-actions">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Buy Now</button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          onClose={handleCloseProductCard} // Pass the function to close the ProductCard
        />
      )}
    </div>
  );
};

export default Products;
