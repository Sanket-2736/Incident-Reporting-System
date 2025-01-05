import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = '/login';
    return null; 
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/get-user/${username}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login')    
  }

  useEffect(() => {
    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl">
      <div className="text-center">
        {/* Using FontAwesome user-circle icon */}
        <i className="fas fa-user-circle text-white text-6xl mb-4"></i>
        <h2 className="text-3xl font-semibold text-white">Welcome, {user.firstName}!</h2>
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
        <div className="space-y-4">
          <p className="text-gray-700 font-medium"><strong>Username:</strong> {user.username}</p>
          <p className="text-gray-700 font-medium"><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
          <p className="text-gray-700 font-medium"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-700 font-medium"><strong>Role:</strong> {user.role}</p>
          <p className="text-gray-700 font-medium"><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
          <p className="text-gray-700 font-medium"><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          <p className="text-gray-700 font-medium"><strong>Date Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
          <p className="text-gray-700 font-medium"><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Edit Profile
        </button>
        <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
