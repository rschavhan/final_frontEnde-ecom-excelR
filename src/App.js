import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './components/Cart';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { userRole } = useContext(AppContext);

  return (
    <div className="App">
      {userRole && userRole.includes('ADMIN') ? <AdminHeader /> : <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <SearchProvider>
      <Router>
        <AppContent />
      </Router>
    </SearchProvider>
  </AppProvider>
);

export default App;
