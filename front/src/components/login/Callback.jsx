import React, { useEffect, useState } from 'react';

const Callback = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  return (
    <div>
      {token ? <h1>Logged in with Spotify</h1> : <h1>Redirecting...</h1>}
    </div>
  );
};

export default Callback;