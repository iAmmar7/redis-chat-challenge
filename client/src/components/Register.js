import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './chat.scss';

function Register() {
  const [username, setUsername] = useState('');
  const history = useHistory();

  const onJoinChannel = () => {
    console.log('username', username);

    if (username.length > 0) {
      history.push({ pathname: '/chat/random', state: { username } });
    }
  };

  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile"></i> RedisChat
        </h1>
      </header>
      <main className="join-main">
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            valuue={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            required
          />
        </div>
        <button type="submit" className="btn" onClick={onJoinChannel}>
          Join Chat
        </button>
      </main>
    </div>
  );
}

export default Register;
