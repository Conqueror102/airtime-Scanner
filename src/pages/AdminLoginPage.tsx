import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin === '1234') {
      localStorage.setItem('admin_pin', '1234');
      window.dispatchEvent(new Event('admin_pin_change'));
      navigate('/admin', { replace: true });
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Admin PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 8 }}>Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default AdminLoginPage;