import React, { useContext, useEffect, useState } from 'react';
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

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            const response = await api.get(`/addresses/user/${userId}`);
            if (response.data.length > 0) {
                setAddresses(response.data);
            } else {
                setShowAddressForm(true);
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
        try {
            const response = await api.post('/addresses', { ...newAddress, user: { id: userId } });
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
        // Handle checkout logic here (e.g., submit order)
        toast.success('Checkout completed successfully!');
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-content">
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
                    </div>
                ) : (
                    <div>
                        <h2>Add Address</h2>
                        <form onSubmit={handleAddressSubmit}>
                            <label>
                                Address Line 1:
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={newAddress.addressLine1}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </label>
                            <label>
                                Address Line 2:
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={newAddress.addressLine2}
                                    onChange={handleAddressChange}
                                />
                            </label>
                            <label>
                                City:
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </label>
                            <label>
                                State:
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </label>
                            <label>
                                Postal Code:
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={newAddress.postalCode}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </label>
                            <label>
                                Country:
                                <input
                                    type="text"
                                    name="country"
                                    value={newAddress.country}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </label>
                            <button type="submit">Save Address</button>
                        </form>
                    </div>
                )}
                {addresses.length > 0 && !showAddressForm && (
                    <button onClick={handleCheckout}>Proceed to Checkout</button>
                )}
            </div>
        </div>
    );
};

export default Checkout;
