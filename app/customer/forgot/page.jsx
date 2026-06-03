'use client';
import { useState } from 'react';
import Link from 'next/link';

const API = 'https://tender-empathy-production-c8ad.up.railway.app';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setMessage('Please enter your email address'); return; }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/api/customer/forgot_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setMessage('✅ Password reset link sent! Check your email inbox.');
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Failed to send reset email. Try again.');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', textDecoration: 'none' }}>📚 Brightmind Books</Link>
        <Link href="/customer/login" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>← Back to Login</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 58px)', padding: '20px 16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(107,33,168,0.10)', border: '1px solid #ddd6fe', padding: '36px 32px', width: '100%', maxWidth: '420px', boxSizing: 'border-box' }}>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#6b21a8', margin: '0 0 8px' }}>Forgot Password?</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Enter your email and we'll send you a reset link</p>
          </div>

          {message && (
            <div style={{ background: isSuccess ? '#dcfce7' : '#fee2e2', color: isSuccess ? '#16a34a' : '#dc2626', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #ddd6fe', fontSize: '14px', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', background: '#faf9ff', marginBottom: '20px' }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Didn't receive the email? Check your spam folder or try again.</p>
              <button onClick={() => { setIsSuccess(false); setMessage(''); setEmail(''); }} style={{ background: '#6b21a8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Try Again</button>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '20px' }}>
            Remember your password?{' '}
            <Link href="/customer/login" style={{ color: '#6b21a8', fontWeight: 600, textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}