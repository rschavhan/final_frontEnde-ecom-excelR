import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Checkout.css';

const Checkout = () => {
    const { userId, cart } = useContext(AppContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const response = await api.get(`/addresses/user/${userId}`);
            if (response.data.length > 0) {
                setAddresses(response.data);
                setShowAddressForm(false); // Hide form if addresses exist
            } else {
                setShowAddressForm(true); // Show form if no addresses exist
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Error fetching addresses.');
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value,
        });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            addressLine1: newAddress.addressLine1,
            addressLine2: newAddress.addressLine2,
            city: newAddress.city,
            state: newAddress.state,
            postalCode: newAddress.postalCode,
            country: newAddress.country,
            userId: userId,
        };
        try {
            const response = await api.post('/addresses', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAddresses([...addresses, response.data]);
            setNewAddress({
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
            });
            setShowAddressForm(false);
            toast.success('Address added successfully!');
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error('Error adding address.');
        }
    };

    const handleCheckout = () => {
        if (!selectedAddress) {
            toast.error('Please select an address for checkout.');
            return;
        }
        // Navigate to billing page
        navigate('/billing');
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-content">
                {showAddressForm ? (
                    <div>
                        <h2>Add Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            {/* Form fields here */}
                            <button type="submit">Save Address</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        {addresses.length > 0 ? (
                            <div>
                                <h2>Select Address</h2>
                                {addresses.map((address) => (
                                    <div key={address.id} className="address-item">
                                        <input
                                            type="radio"
                                            id={`address-${address.id}`}
                                            name="selectedAddress"
                                            value={address.id}
                                            onChange={() => setSelectedAddress(address.id)}
                                        />
                                        <label htmlFor={`address-${address.id}`}>
                                            <p>{address.addressLine1}</p>
                                            <p>{address.addressLine2}</p>
                                            <p>{address.city}, {address.state} {address.postalCode}</p>
                                            <p>{address.country}</p>
                                        </label>
                                    </div>
                                ))}
                                <button onClick={() => setShowAddressForm(true)}>Add New Address</button>
                                <button onClick={handleCheckout}>Proceed to Checkout</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Add Address</h2>
                                <form onSubmit={handleAddressSubmit}>
                                    {/* Form fields here */}
                                    <button type="submit">Save Address</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
