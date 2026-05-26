'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const purple = '#6b21a8';
const darkPurple = '#4c1d95';
const yellow = '#f59e0b';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/customer/forgot_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Reset link sent to your email.');
      } else {
        setMessage(data.message || '❌ Failed to send reset link.');
      }
    } catch {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(76,29,149,0.2)', padding: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: darkPurple, margin: 0 }}>Forgot Password</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0' }}>Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
        <input
          type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1.5px solid #e5e7eb`, fontSize: 14, color: '#000000', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
          onFocus={e => e.target.style.border = `1.5px solid ${purple}`}
          onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
        />
        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: 12, background: yellow, color: '#000000', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && (
        <p style={{
          marginTop: 16, fontSize: 14, fontWeight: 600, textAlign: 'center',
          color: message.includes('✅') ? '#16a34a' : '#dc2626'
        }}>
          {message}
        </p>
      )}

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
        Remember your password?{' '}
        <a href="/customer/login" style={{ color: purple, fontWeight: 600, textDecoration: 'none' }}>Login</a>
      </p>
    </div>
  );
}

function ForgotPasswordWithParams() {
  useSearchParams();
  return <ForgotPasswordForm />;
}

export default function ForgotPasswordPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: `linear-gradient(135deg, ${darkPurple} 0%, #7c3aed 100%)`,
      padding: '24px 16px', fontFamily: 'sans-serif',
    }}>
      <Suspense fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
        <ForgotPasswordWithParams />
      </Suspense>
    </div>
  );
}