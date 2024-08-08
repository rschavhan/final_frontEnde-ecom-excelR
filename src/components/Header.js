// src/components/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import '../styles/Header.css'; // Import the CSS file for styling

const Header = () => {
  const { user, logout, cart } = useContext(AppContext);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <Link to="/">
            <img src="logo.png " alt="Logo" className="logo" />
          </Link>
          <span className="site-name">ShopEzy</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
