'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import CartIcon from '../../components/CartIcon';

const purple = '#6b21a8';
const darkPurple = '#4c1d95';
const yellow = '#f59e0b';

function StationerySearchParams() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  return filter ? (
    <div style={{ marginBottom: 12, textAlign: 'center', fontSize: 13, color: purple }}>
      Filter: <span style={{ fontWeight: 600 }}>{filter}</span>
    </div>
  ) : null;
}

export default function StationeryPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost/bookshop/api/stationery/index.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data.items);
        else setError('Failed to load stationery.');
      })
      .catch(() => setError('Network error.'));
  }, []);

  const getCart = () => JSON.parse(localStorage.getItem('sharedCart') || '[]');
  const saveCart = (cart) => localStorage.setItem('sharedCart', JSON.stringify(cart));

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, parseInt(value) || 1) }));
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const cart = getCart();
    const existing = cart.find(i => i.type === 'stationery' && i.id === item.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        type: 'stationery',
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity,
        image: item.image || null,
      });
    }

    saveCart(cart);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    alert('Added to cart!');
  };

  const filteredItems = items.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: 'sans-serif' }}>

      {/* Top bar — same as books page */}
      <div style={{ background: darkPurple, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <button onClick={() => router.push('/customer/home')} style={{ color: '#fff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            🏠 Home
          </button>
          <button onClick={() => router.push('/customer/dashboard')} style={{ color: yellow, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            📚 Books
          </button>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🖋️ Stationery</span>
        </div>
        <CartIcon />
      </div>

      <Suspense fallback={null}><StationerySearchParams /></Suspense>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>

        {/* Search bar — same as books page */}
        <input
          type="text"
          placeholder="🔍 Search stationery..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: `2px solid ${purple}`, fontSize: 14, marginBottom: 16, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }}
        />

        {/* Results count */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 20, boxShadow: '0 2px 8px rgba(107,33,168,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
            Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> items
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ fontSize: 12, color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
            >
              ✕ Clear Search
            </button>
          )}
        </div>

        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}

        {/* Items Grid — same layout as books */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 10 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🖋️</div>
            <h3 style={{ color: darkPurple, marginBottom: 8 }}>No items found</h3>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Try a different search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {filteredItems.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,33,168,0.08)' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => router.push(`/customer/stationery/${item.id}`)}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=220&h=180&fit=crop'; }}
                />
                <div style={{ padding: 12 }}>
                  <h2
                    style={{ fontWeight: 700, fontSize: 14, color: darkPurple, cursor: 'pointer', marginBottom: 4, lineHeight: 1.3 }}
                    onClick={() => router.push(`/customer/stationery/${item.id}`)}
                  >
                    {item.name}
                  </h2>
                  <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: 10, fontSize: 15 }}>
                    Ksh {parseFloat(item.price).toFixed(2)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number" min={1} value={quantities[item.id] || 1}
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                      style={{ width: 48, border: `1.5px solid ${purple}`, borderRadius: 4, padding: '4px 6px', fontSize: 13, color: '#1a1a1a' }}
                    />
                    <button
                      onClick={() => addToCart(item)}
                      style={{ flex: 1, background: yellow, color: '#1a1a1a', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}