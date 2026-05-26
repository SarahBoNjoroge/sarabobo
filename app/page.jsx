'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

const purple = '#6b21a8';
const darkPurple = '#4c1d95';
const yellow = '#f59e0b';

function SearchBar() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/customer/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Search books or stationery..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flex: 1, padding: '12px 16px', borderRadius: '8px 0 0 8px', border: 'none', fontSize: 14, color: '#000', outline: 'none' }}
      />
      <button
        type="submit"
        style={{ padding: '12px 20px', background: yellow, color: '#000', border: 'none', borderRadius: '0 8px 8px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
      >
        Search
      </button>
    </form>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured books
    fetch('https://tender-empathy-production-c8ad.up.railway.app/api/books/index.php')
      .then(res => res.json())
      .then(data => { if (data.success) setBooks(data.books.slice(0, 4)); })
      .catch(() => { });

    // Fetch featured stationery
    fetch('https://tender-empathy-production-c8ad.up.railway.app/api/stationery/index.php')
      .then(res => res.json())
      .then(data => { if (data.success) setStationery(data.items.slice(0, 4)); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: 'sans-serif', overflowX: 'hidden' }}>

      {/* ✅ TOP NAVBAR */}
      <nav style={{ background: darkPurple, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ color: yellow, fontWeight: 700, fontSize: 20 }}>📚 Brightmind Books</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/customer/login" style={{
            padding: '8px 20px', background: yellow, color: '#000', borderRadius: 6,
            fontWeight: 700, fontSize: 14, textDecoration: 'none'
          }}>
            Login
          </Link>
          <Link href="/customer/register" style={{
            padding: '8px 20px', background: '#fff', color: purple, borderRadius: 6,
            fontWeight: 700, fontSize: 14, textDecoration: 'none', border: `1.5px solid ${purple}`
          }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ✅ HERO SECTION */}
      <div style={{
        background: `linear-gradient(135deg, ${darkPurple} 0%, #7c3aed 100%)`,
        backgroundImage: "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply',
        padding: '80px 24px', textAlign: 'center', color: '#fff',
      }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: yellow, marginBottom: 16, lineHeight: 1.2 }}>
          Welcome to Brightmind Books
        </h1>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#e9d5ff', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Discover books, stationery, and educational resources designed to elevate your learning.
        </p>

        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>

        {/* Browse buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link href="/customer/login" style={{ padding: '10px 24px', background: yellow, color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Browse Books
          </Link>
          <Link href="/customer/login" style={{ padding: '10px 24px', background: '#fff', color: purple, borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Browse Stationery
          </Link>
        </div>
      </div>

      {/* ✅ FEATURED BOOKS */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: darkPurple, margin: 0 }}>📚 Featured Books</h2>
          <Link href="/customer/login" style={{ color: purple, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading books...</p>
        ) : books.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>No books available yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {books.map(book => (
              <div key={book.book_id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,33,168,0.08)', cursor: 'pointer' }}
                onClick={() => router.push('/customer/login')}>
                <img
                  src={book.cover_image}
                  alt={book.title}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=180&fit=crop'; }}
                />
                <div style={{ padding: 12 }}>
                  {book.level && (
                    <span style={{ background: '#ede9fe', color: purple, fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, display: 'inline-block', marginBottom: 6 }}>
                      {book.level}
                    </span>
                  )}
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: darkPurple, marginBottom: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {book.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>by {book.author}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 10 }}>Ksh {parseFloat(book.price).toFixed(2)}</p>
                  <button
                    onClick={() => router.push('/customer/login')}
                    style={{ width: '100%', padding: '7px', background: yellow, color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                  >
                    Login to Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ FEATURED STATIONERY */}
      <section style={{ background: '#fff', padding: '48px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: darkPurple, margin: 0 }}>🖊️ Featured Stationery</h2>
            <Link href="/customer/login" style={{ color: purple, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading stationery...</p>
          ) : stationery.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center' }}>No stationery available yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {stationery.map(item => (
                <div key={item.id} style={{ background: '#f5f3ff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,33,168,0.08)', cursor: 'pointer' }}
                  onClick={() => router.push('/customer/login')}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&h=180&fit=crop'; }}
                  />
                  <div style={{ padding: 12 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: darkPurple, marginBottom: 8, lineHeight: 1.3 }}>{item.name}</h3>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 10 }}>Ksh {parseFloat(item.price).toFixed(2)}</p>
                    <button
                      onClick={() => router.push('/customer/login')}
                      style={{ width: '100%', padding: '7px', background: yellow, color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      Login to Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section style={{ background: `linear-gradient(135deg, ${darkPurple}, #7c3aed)`, padding: '60px 24px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 700, marginBottom: 12 }}>Start Your Learning Journey Today</h2>
        <p style={{ fontSize: 14, color: '#e9d5ff', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
          Join thousands of students who trust Brightmind Books for their academic needs.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/customer/register" style={{ padding: '12px 28px', background: yellow, color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
            Sign Up Free
          </Link>
          <Link href="/customer/login" style={{ padding: '12px 28px', background: '#fff', color: purple, borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
            Login
          </Link>
        </div>
      </section>

      {/* ✅ FEATURES */}
      <section style={{ padding: '48px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {[
            { icon: '📚', title: 'Extensive Book Collection', desc: 'CBC curriculum books for all levels — Pre-Primary to Senior Secondary.' },
            { icon: '🖊️', title: 'Premium Stationery', desc: 'Everything you need to write, draw and plan in one place.' },
            { icon: '🚚', title: 'Flexible Delivery', desc: 'Doorstep delivery, pickup points, or parcel service across Kenya.' },
            { icon: '📱', title: 'M-Pesa Payments', desc: 'Pay securely via M-Pesa STK push — fast and easy.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(107,33,168,0.08)', borderTop: `4px solid ${i % 2 === 0 ? purple : yellow}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: darkPurple, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CONTACT */}
      <section style={{ background: '#fff', padding: '40px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: darkPurple, marginBottom: 12 }}>Contact Us</h2>
        <p style={{ color: '#374151', marginBottom: 6, fontWeight: 500 }}>📧 support@brightmindbooks.co.ke</p>
        <p style={{ color: '#374151', marginBottom: 6, fontWeight: 500 }}>📞 +254 712 345 678</p>
        <p style={{ color: '#6b7280', fontSize: 13 }}>We're here to help — reach out anytime!</p>
      </section>

      {/* ✅ FOOTER */}
      <footer style={{ background: '#1e1b4b', color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '16px 24px' }}>
        © {new Date().getFullYear()} Brightmind Books. All rights reserved.
      </footer>
    </div>
  );
}