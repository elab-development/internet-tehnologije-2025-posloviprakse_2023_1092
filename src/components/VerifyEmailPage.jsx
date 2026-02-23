import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyEmailPage() {
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Nedostaje token za verifikaciju.');
      return;
    }
    authAPI.verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email je uspešno verifikovan! Možete se prijaviti.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Došlo je do greške pri verifikaciji.');
      });
  }, [location.search]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Verifikacija emaila</h2>
      {status === 'loading' && <p>Verifikujem...</p>}
      {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}
