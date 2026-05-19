import React from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Digital Closet</h1>
      <p>Welcome to your virtual closet!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
