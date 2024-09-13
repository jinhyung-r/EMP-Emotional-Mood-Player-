import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Callback = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    const token = new URLSearchParams(hash.replace('#', '')).get('access_token');

    if (token) {
      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setUser(response.data);
        navigate('/create', { state: { user: response.data } });
      }).catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [location, navigate]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Callback;
