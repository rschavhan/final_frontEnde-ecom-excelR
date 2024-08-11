import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/UserManager.css'; // Import the CSS file

const UserManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users'); // Ensure the API endpoint is correct
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`); // Delete user by ID
      setUsers(users.filter(user => user.id !== userId)); // Update state to remove deleted user
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-manager">
      <h2>User Manager</h2>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-item">
            <span className="user-email">{user.email}</span>
            <button 
              onClick={() => deleteUser(user.id)} 
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
