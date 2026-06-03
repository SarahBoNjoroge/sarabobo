'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function CartQueryParams() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  return null;
}

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => { loadCart(); }, []);

  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('sharedCart') || '[]');
      setCart(stored);
    } catch { setCart([]); }
  };

  const total = cart.reduce((sum, i) => sum + parseFloat(i.price) * (i.quantity || 1), 0);

  const removeItem = (id, type) => {
    const updated = cart.filter(item => !(item.id === id && item.type === type));
    setCart(updated);
    localStorage.setItem('sharedCart', JSON.stringify(updated));
  };

  const updateQty = (id, type, delta) => {
    const updated = cart.map(item => {
      if (item.id === id && item.type === type) {
        return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('sharedCart', JSON.stringify(updated));
  };

  // ✅ CHECK LOGIN BEFORE CHECKOUT
  const handleGoToCheckout = () => {
    if (cart.length === 0) { setMessage('Your cart is empty.'); return; }
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.push('/customer/login?msg=Please login to checkout');
      return;
    }
    router.push('/customer/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/customer/home" style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', textDecoration: 'none' }}>📚 Brightmind Books</Link>
        <Link href="/customer/home" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>← Continue Shopping</Link>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#6b21a8', marginBottom: '20px' }}>🛒 My Cart</h2>

        <Suspense fallback={null}><CartQueryParams /></Suspense>

        {message && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>
        )}

        {cart.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', border: '1px solid #ddd6fe' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🛒</div>
            <h3 style={{ color: '#6b21a8', marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Browse our books and stationery to get started</p>
            <Link href="/" style={{ background: '#f59e0b', color: '#1e1b4b', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Browse Products</Link>
          </div>
        ) : (
          <>
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ddd6fe', overflow: 'hidden', marginBottom: '20px' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: i < cart.length - 1 ? '1px solid #f3f0ff' : 'none', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Image */}
                  <div style={{ width: '60px', height: '60px', background: '#f5f3ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.title || item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      : <span style={{ fontSize: '28px' }}>{item.type === 'book' ? '📚' : '✏️'}</span>
                    }
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e1b4b' }}>{item.title || item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', textTransform: 'capitalize' }}>{item.type}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#6b21a8', marginTop: '4px' }}>KSh {parseFloat(item.price).toLocaleString()}</div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateQty(item.id, item.type, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1.5px solid #ddd6fe', background: '#f5f3ff', color: '#6b21a8', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>−</button>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e1b4b', minWidth: '20px', textAlign: 'center' }}>{item.quantity || 1}</span>
                    <button onClick={() => updateQty(item.id, item.type, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1.5px solid #ddd6fe', background: '#f5f3ff', color: '#6b21a8', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>+</button>
                  </div>

                  {/* Item total */}
                  <div style={{ fontWeight: 700, color: '#6b21a8', fontSize: '15px', minWidth: '80px', textAlign: 'right' }}>
                    KSh {(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id, item.type)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Remove</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ddd6fe', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span style={{ color: '#1e1b4b', fontWeight: 600 }}>KSh {total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #ddd6fe', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#6b21a8' }}>KSh {total.toLocaleString()}</span>
              </div>
              <button onClick={handleGoToCheckout} style={{ width: '100%', padding: '14px', background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                ✅ Proceed to Checkout
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '10px' }}>
                🔒 Login required to complete your order
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}