  import React, { useState, useEffect, useContext } from 'react';
  import { AppContext } from '../context/AppContext';
  import '../styles/Home.css';

  const Home = () => {
    const { addToCart } = useContext(AppContext);

    const offers = [
      'offer3.png',
      'offer4.png',
      'offer5.png',
      'offer6.png',
      // Add more offer images as needed
    ];

    const initialPhones = [
      { id: 1, name: 'Phone 1', price: 300, imgSrc: 'path/to/phone1.jpg' },
      { id: 2, name: 'Phone 2', price: 400, imgSrc: 'path/to/phone2.jpg' },
      // Add more phones as needed
    ];

    const initialShoes = [
      { id: 3, name: 'Shoe 1', price: 50, imgSrc: 'path/to/shoe1.jpg' },
      { id: 4, name: 'Shoe 2', price: 70, imgSrc: 'path/to/shoe2.jpg' },
      // Add more shoes as needed
    ];

    const brands = [
      { name: 'Brand 1', imgSrc: 'path/to/brand1.jpg' },
      { name: 'Brand 2', imgSrc: 'path/to/brand2.jpg' },
      // Add more brands as needed
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phones, setPhones] = useState(initialPhones);
    const [shoes, setShoes] = useState(initialShoes);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }, [offers.length]);

    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    };

    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    };

    const handleSearch = (e) => {
      const query = searchQuery.toLowerCase();
      setPhones(initialPhones.filter(phone => phone.name.toLowerCase().includes(query)));
      setShoes(initialShoes.filter(shoe => shoe.name.toLowerCase().includes(query)));
    };

    return (
      <div className="home">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="latest-offers">
          <button className="prev" onClick={prevSlide}>❮</button>
          <img src={offers[currentIndex]} alt={`Offer ${currentIndex + 1}`} />
          <button className="next" onClick={nextSlide}>❯</button>
        </div>
        <div className="best-deals">
          <h2>Best Deals on Phones</h2>
          <div className="product-list">
            {phones.map((phone) => (
              <div key={phone.id} className="product">
                <img src={phone.imgSrc} alt={phone.name} />
                <h3>{phone.name}</h3>
                <p>₹ {phone.price}</p>
                <div className="product-actions">
                  <button onClick={() => addToCart(phone)}>Buy Now</button>
                  <button onClick={() => addToCart(phone)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="featured-brands">
          <h2>Featured Brands</h2>
          <div className="brand-list">
            {brands.map((brand) => (
              <div key={brand.name} className="brand">
                <img src={brand.imgSrc} alt={brand.name} />
                <p>{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shoes-section">
          <h2>Shoes</h2>
          <div className="product-list">
            {shoes.map((shoe) => (
              <div key={shoe.id} className="product">
                <img src={shoe.imgSrc} alt={shoe.name} />
                <h3>{shoe.name}</h3>
                <p>₹ {shoe.price}</p>
                <div className="product-actions">
                  <button onClick={() => addToCart(shoe)}>Buy Now</button>
                  <button onClick={() => addToCart(shoe)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default Home;
