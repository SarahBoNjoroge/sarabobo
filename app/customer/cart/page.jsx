'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function CartQueryParams() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  return ref ? <div style={{ marginBottom: 8, fontSize: 12, color: '#6b21a8' }}>Referral: {ref}</div> : null;
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

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const removeItem = (id, type) => {
    const updated = cart.filter(item => !(item.id === id && item.type === type));
    setCart(updated);
    localStorage.setItem('sharedCart', JSON.stringify(updated));
  };

  const updateQty = (id, type, delta) => {
    const updated = cart.map(item => {
      if (item.id === id && item.type === type) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('sharedCart', JSON.stringify(updated));
  };

  const handleGoToCheckout = () => {
    if (cart.length === 0) { setMessage('❗ Cart is empty.'); return; }
    router.push('/customer/checkout');
  };

  // ✅ Use real saved image, fallback by type
  const getItemImage = (item) => {
    if (item.image) return item.image;
    if (item.type === 'book')
      return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=80&fit=crop';
    return 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=80&h=80&fit=crop';
  };

  // System colors: purple #6b21a8, yellow #f59e0b, dark purple #4c1d95
  const purple = '#6b21a8';
  const darkPurple = '#4c1d95';
  const yellow = '#f59e0b';
  const yellowHover = '#d97706';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f3f0ff', fontFamily: "'DM Sans', sans-serif", padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ background: purple, borderRadius: 10, padding: '8px 12px', fontSize: 22 }}>🛒</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: darkPurple, margin: 0 }}>Shopping Cart</h1>
              <p style={{ fontSize: 13, color: '#7c3aed', margin: 0 }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            {/* Back to shop */}
            <button
              onClick={() => router.push('/customer/home')}
              style={{ marginLeft: 'auto', background: 'none', border: `1.5px solid ${purple}`, color: purple, borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              ← Continue Shopping
            </button>
          </div>

          <Suspense fallback={null}><CartQueryParams /></Suspense>
          {message && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 6, padding: '10px 16px', marginBottom: 16, fontSize: 14, color: '#92400e' }}>
              {message}
            </div>
          )}

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

            {/* LEFT: Items */}
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(107,33,168,0.08)', overflow: 'hidden' }}>

              {/* Panel header */}
              <div style={{ background: purple, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Your Items</span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{cart.length} product{cart.length !== 1 ? 's' : ''}</span>
              </div>

              {cart.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: darkPurple, marginBottom: 8 }}>Your cart is empty</h3>
                  <p style={{ fontSize: 14, color: '#9ca3af' }}>Browse our books and stationery to get started!</p>
                  <button
                    onClick={() => router.push('/customer/home')}
                    style={{ marginTop: 20, background: purple, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                    borderBottom: idx < cart.length - 1 ? '1px solid #f3f0ff' : 'none',
                    transition: 'background 0.15s',
                  }}>
                    {/* Product image */}
                    <img
                      src={getItemImage(item)}
                      alt={item.title || item.name}
                      style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '2px solid #ede9fe', flexShrink: 0, background: '#f5f3ff' }}
                      onError={e => {
                        e.target.src = item.type === 'book'
                          ? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=80&fit=crop'
                          : 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=80&h=80&fit=crop';
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title || item.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#7c3aed', textTransform: 'capitalize', marginBottom: 4, fontWeight: 500 }}>
                        {item.type}
                      </div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>
                        Ksh {Number(item.price).toLocaleString()} each
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${purple}`, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                      <button
                        onClick={() => updateQty(item.id, item.type, -1)}
                        style={{ width: 30, height: 30, background: '#f5f3ff', border: 'none', cursor: 'pointer', fontSize: 16, color: purple, fontWeight: 700 }}
                      >−</button>
                      <span style={{ width: 34, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: darkPurple, borderLeft: `1px solid #ede9fe`, borderRight: `1px solid #ede9fe` }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.type, 1)}
                        style={{ width: 30, height: 30, background: '#f5f3ff', border: 'none', cursor: 'pointer', fontSize: 16, color: purple, fontWeight: 700 }}
                      >+</button>
                    </div>

                    {/* Subtotal + remove */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: darkPurple }}>
                        Ksh {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id, item.type)}
                        style={{ fontSize: 12, color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontWeight: 500 }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT: Order Summary */}
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(107,33,168,0.08)', overflow: 'hidden', position: 'sticky', top: 20 }}>

              <div style={{ background: darkPurple, padding: '14px 20px' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Order Summary</span>
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#555' }}>
                  <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Ksh {total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#555' }}>
                  <span>Delivery</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>At checkout</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed #ede9fe', margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: darkPurple }}>Ksh {total.toLocaleString()}</span>
                </div>

                {/* Checkout button — yellow like system */}
                <button
                  onClick={handleGoToCheckout}
                  disabled={cart.length === 0}
                  style={{
                    width: '100%', padding: 13, background: yellow, color: '#1a1a1a',
                    border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 700,
                    cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                    marginBottom: 10, letterSpacing: 0.3,
                    opacity: cart.length === 0 ? 0.5 : 1,
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.target.style.background = yellowHover}
                  onMouseOut={e => e.target.style.background = yellow}
                >
                  Proceed to Checkout →
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}