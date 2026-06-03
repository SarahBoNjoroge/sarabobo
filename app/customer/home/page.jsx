'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SearchBar() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/customer/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '520px', margin: '0 auto', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
      <input type="text" placeholder="Search for books or stationery..." value={query} onChange={e => setQuery(e.target.value)}
        style={{ flex: 1, padding: '13px 16px', border: 'none', fontSize: '15px', outline: 'none', color: '#1e1b4b', minWidth: 0 }} />
      <button type="submit" style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', padding: '13px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>
        🔍 Search
      </button>
    </form>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/customer/login'); return; }
    setCustomerName(localStorage.getItem('customerName') || 'Customer');
  }, []);

  const logout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('lastOrderId');
    router.push('/customer/login');
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .sidebar { display: flex; }
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-nav { display: flex; }
          .hero-title { font-size: 28px !important; }
          .hero-sub { font-size: 15px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>

        {/* ── MOBILE TOP NAV (visible only on phones) ── */}
        <div className="mobile-nav" style={{ background: '#6b21a8', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>📚 Brightmind</span>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '26px', cursor: 'pointer' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ background: '#4c1d95', padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: '52px', zIndex: 99 }}>
            {[
              { href: '/customer/profile', icon: '👤', label: customerName || 'My Profile' },
              { href: '/customer/dashboard', icon: '📚', label: 'Books' },
              { href: '/customer/stationery', icon: '✏️', label: 'Stationery' },
              { href: '/customer/cart', icon: '🛒', label: 'My Cart' },
              { href: '/customer/reviews', icon: '✍️', label: 'Reviews' },
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ color: '#fff', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ color: '#fca5a5', background: 'none', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🚪</span> Logout
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flex: 1 }}>
          {/* ── DESKTOP SIDEBAR ── */}
          <div className="sidebar" style={{ width: '220px', background: '#6b21a8', padding: '24px 16px', flexDirection: 'column', alignItems: 'center', gap: '16px', minHeight: '100vh', position: 'sticky', top: 0 }}>
            <Link href="/customer/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>👤</div>
              <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>{customerName || 'My Profile'}</span>
            </Link>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
              {[
                { href: '/customer/dashboard', icon: '📚', label: 'Books' },
                { href: '/customer/stationery', icon: '✏️', label: 'Stationery' },
                { href: '/customer/cart', icon: '🛒', label: 'My Cart' },
                { href: '/customer/profile', icon: '👤', label: 'My Profile' },
                { href: '/customer/reviews', icon: '✍️', label: 'Reviews' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  style={{ color: '#e9d5ff', textDecoration: 'none', padding: '10px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}
            </div>

            <button onClick={logout} style={{ marginTop: 'auto', width: '100%', padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              Logout
            </button>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 60%, #7c3aed 100%)', padding: 'clamp(32px,6vw,80px) 20px', textAlign: 'center' }}>
              <h1 className="hero-title" style={{ fontSize: 'clamp(24px,5vw,52px)', fontWeight: 800, color: '#fbbf24', marginBottom: '12px' }}>
                Welcome to Brightmind Books
              </h1>
              <p className="hero-sub" style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#e9d5ff', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                Discover CBC books, stationery, and educational resources.
              </p>
              <Suspense fallback={null}><SearchBar /></Suspense>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <Link href="/customer/dashboard" style={{ background: '#f59e0b', color: '#1e1b4b', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>Browse Books</Link>
                <Link href="/customer/stationery" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: '1.5px solid rgba(255,255,255,0.4)' }}>Browse Stationery</Link>
                <Link href="/customer/cart" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: '1.5px solid rgba(255,255,255,0.4)' }}>🛒 My Cart</Link>
              </div>
            </div>

            {/* About */}
            <section style={{ padding: 'clamp(32px,4vw,60px) clamp(16px,4vw,40px)', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 700, color: '#6b21a8', marginBottom: '12px' }}>About Brightmind Books</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7 }}>
                Brightmind Books is your gateway to academic excellence. We provide a curated selection of CBC textbooks, novels, and professional guides alongside essential stationery. Our mission is to empower learners across Kenya.
              </p>
            </section>

            {/* Features */}
            <section style={{ padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px)', background: 'linear-gradient(135deg, #ede9fe 0%, #fff 50%, #fef3c7 100%)' }}>
              <div className="features-grid" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  { icon: '📚', title: 'Extensive Book Collection', desc: 'From CBC academic material to your favourite reads.' },
                  { icon: '✏️', title: 'Premium Stationery', desc: 'Everything you need to write, draw, and plan.' },
                  { icon: '🧾', title: 'Smooth Online Ordering', desc: 'Order online with instant invoice generation.' },
                ].map(f => (
                  <div key={f.title} style={{ background: '#fff', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 2px 12px rgba(107,33,168,0.07)', borderTop: '4px solid #6b21a8', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b21a8', marginBottom: '8px' }}>{f.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section style={{ padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,40px)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#6b21a8', marginBottom: '12px' }}>Contact Us</h2>
              <p style={{ color: '#6b7280', marginBottom: '6px' }}>📧 info@brightmindbooks.co.ke</p>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>📞 +254 700 000 000</p>
              <Link href="/customer/reviews" style={{ background: '#6b21a8', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                ✍️ Leave a Review
              </Link>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1e1b4b', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', padding: '16px 20px' }}>
              © {new Date().getFullYear()} Brightmind Books. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}