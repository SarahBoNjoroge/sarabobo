'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API = 'https://tender-empathy-production-c8ad.up.railway.app';

function LoginQueryMessage() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');
  if (!msg) return null;
  return (
    <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
      {msg}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone || !form.password) { setError('Phone number and password are required'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/customer/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success) {
        // ✅ Save cart BEFORE clearing localStorage
        const existingCart = localStorage.getItem('sharedCart');

        localStorage.removeItem('customerId');
        localStorage.removeItem('customerName');
        localStorage.removeItem('customerPhone');
        localStorage.removeItem('lastOrderId');
        // ✅ DO NOT remove sharedCart — keep items added before login

        localStorage.setItem('customerId', data.userId);
        localStorage.setItem('customerName', data.username || data.name || '');
        localStorage.setItem('customerPhone', data.phone || form.phone);

        // ✅ Restore cart if it was cleared
        if (existingCart && !localStorage.getItem('sharedCart')) {
          localStorage.setItem('sharedCart', existingCart);
        }

        // ✅ Go back to cart if they were checking out
        const urlParams = new URLSearchParams(window.location.search);
        const msg = urlParams.get('msg') || '';
        if (msg.toLowerCase().includes('checkout') || msg.toLowerCase().includes('cart')) {
          router.push('/customer/cart');
        } else {
          router.push('/customer/home');
        }
      } else {
        setError(data.message || 'Invalid phone number or password');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', textDecoration: 'none' }}>📚 Brightmind Books</Link>
        <Link href="/customer/register" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Create Account</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 58px)', padding: '20px 16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(107,33,168,0.10)', border: '1px solid #ddd6fe', padding: '36px 32px', width: '100%', maxWidth: '420px', boxSizing: 'border-box' }}>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#6b21a8', margin: '0 0 6px', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>Sign in to your account</p>

          <Suspense fallback={null}><LoginQueryMessage /></Suspense>

          {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" name="phone" placeholder="07XXXXXXXX" value={form.phone} onChange={handleChange} required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #ddd6fe', fontSize: '14px', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', background: '#faf9ff', marginBottom: '16px' }} />

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Your password" value={form.password} onChange={handleChange} required
                style={{ width: '100%', padding: '11px 44px 11px 14px', borderRadius: '8px', border: '1.5px solid #ddd6fe', fontSize: '14px', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', background: '#faf9ff' }} />
              <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link href="/customer/forgot" style={{ color: '#6b21a8', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Don&apos;t have an account?{' '}
            <Link href="/customer/register" style={{ color: '#6b21a8', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}