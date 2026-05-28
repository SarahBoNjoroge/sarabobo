'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SHOP_PHONE = '+254 700 000 000';
const SHOP_EMAIL = 'bookshopkenya@gmail.com';
const SHOP_NAME = 'Brightmind Books';
const SHOP_TAG = 'Your CBC Learning Partner';
const API = 'https://tender-empathy-production-c8ad.up.railway.app';

const CBC_LEVELS = ['Pre-Primary', 'Primary', 'Junior Secondary', 'Senior Secondary'];
const LEVEL_EMOJI = { 'All': '📚', 'Pre-Primary': '🌱', 'Primary': '📗', 'Junior Secondary': '📘', 'Senior Secondary': '📙' };

// Toast notification — no OK button needed
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
      ✓ {message}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingStationery, setLoadingStationery] = useState(true);
  const [activeLevel, setActiveLevel] = useState('All');
  const [activeTab, setActiveTab] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customerId');
    if (token) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('customerName') || 'Customer');
    }
    const cart = JSON.parse(localStorage.getItem('sharedCart') || '[]');
    setCartCount(cart.reduce((sum, i) => sum + (i.quantity || 1), 0));
    fetchBooks();
    fetchStationery();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/api/books/index.php`);
      const data = await res.json();
      if (data.success) setBooks(data.books || []);
    } catch { }
    setLoadingBooks(false);
  };

  const fetchStationery = async () => {
    try {
      const res = await fetch(`${API}/api/stationery/index.php`);
      const data = await res.json();
      if (data.success) setStationery(data.items || []);
    } catch { }
    setLoadingStationery(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    try {
      const res = await fetch(`${API}/api/search.php?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch { }
  };

  // ✅ Add to cart — NO login required
  const handleAddToCart = (item, type) => {
    const cart = JSON.parse(localStorage.getItem('sharedCart') || '[]');
    const key = type + '_' + (item.book_id || item.id);
    const existing = cart.find(c => c._key === key);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        _key: key,
        id: item.book_id || item.id,
        title: item.title || item.name,
        price: item.price,
        image: item.cover_image || item.image,
        quantity: 1,
        type,
      });
    }
    localStorage.setItem('sharedCart', JSON.stringify(cart));
    const newCount = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    setCartCount(newCount);
    setToast(`${item.title || item.name} added to cart!`);
  };

  // ✅ Checkout — login required
  const handleCheckout = () => {
    if (cartCount === 0) return;
    if (!isLoggedIn) {
      router.push('/customer/login?msg=Please login to checkout');
    } else {
      router.push('/customer/cart');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerPhone');
    setIsLoggedIn(false);
    setUserName('');
  };

  const filteredBooks = books.filter(b => {
    const matchLevel = activeLevel === 'All' || b.level === activeLevel;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || (b.title + ' ' + (b.author || '') + ' ' + (b.subject || '')).toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });

  const filteredStationery = stationery.filter(s => {
    const q = searchQuery.toLowerCase();
    return !q || (s.name || '').toLowerCase().includes(q);
  });

  const displayItems = searchResults !== null ? searchResults : null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ff; }
        .nav-desktop { display: flex !important; }
        .hamburger-btn { display: none !important; }
        .landing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .landing-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .hero-emojis { display: none !important; }
          .hero-buttons { flex-direction: column; }
          .footer-inner { flex-direction: column; gap: 20px; }
          .search-row { flex-direction: column; align-items: stretch; }
          .checkout-banner { flex-direction: column; text-align: center; }
          .hero-section { padding: 32px 16px !important; }
        }
        @media (max-width: 360px) {
          .landing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

        {/* ══ NAVBAR ══ */}
        <nav style={{ background: '#6b21a8', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: '58px', gap: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', flex: 1, whiteSpace: 'nowrap' }}>📚 {SHOP_NAME}</span>

            <div className="nav-desktop" style={{ alignItems: 'center', gap: '4px' }}>
              <button onClick={() => { setActiveTab('books'); setSearchResults(null); }} style={{ background: activeTab === 'books' ? 'rgba(255,255,255,0.18)' : 'transparent', color: activeTab === 'books' ? '#fbbf24' : 'rgba(255,255,255,0.8)', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Books</button>
              <button onClick={() => { setActiveTab('stationery'); setSearchResults(null); }} style={{ background: activeTab === 'stationery' ? 'rgba(255,255,255,0.18)' : 'transparent', color: activeTab === 'stationery' ? '#fbbf24' : 'rgba(255,255,255,0.8)', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Stationery</button>
            </div>

            <div className="nav-desktop" style={{ alignItems: 'center', gap: '8px' }}>
              <button onClick={handleCheckout} style={{ background: cartCount > 0 ? '#f59e0b' : 'rgba(255,255,255,0.12)', color: cartCount > 0 ? '#1e1b4b' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                🛒 {cartCount > 0 && <span style={{ background: '#6b21a8', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '12px' }}>{cartCount}</span>}
              </button>
              {isLoggedIn ? (
                <>
                  <Link href="/customer/home" style={{ background: '#fff', color: '#6b21a8', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>My Account</Link>
                  <button onClick={handleLogout} style={{ background: 'transparent', color: '#fbbf24', border: '1.5px solid #fbbf24', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/customer/login" style={{ background: 'transparent', color: '#fbbf24', border: '1.5px solid #fbbf24', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>Login</Link>
                  <Link href="/customer/register" style={{ background: '#f59e0b', color: '#1e1b4b', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>Register</Link>
                </>
              )}
            </div>

            <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: '26px', cursor: 'pointer', padding: '4px', display: 'none', alignItems: 'center' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          {menuOpen && (
            <div style={{ background: '#4c1d95', padding: '10px 16px 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => { setActiveTab('books'); setMenuOpen(false); }} style={{ color: '#fff', background: 'none', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>📚 Books</button>
              <button onClick={() => { setActiveTab('stationery'); setMenuOpen(false); }} style={{ color: '#fff', background: 'none', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>✏️ Stationery</button>
              <button onClick={() => { handleCheckout(); setMenuOpen(false); }} style={{ color: '#fbbf24', background: 'none', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>
                🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </button>
              {isLoggedIn ? (
                <>
                  <Link href="/customer/home" style={{ color: '#fff', textDecoration: 'none', padding: '10px 14px', fontWeight: 600, fontSize: '15px' }} onClick={() => setMenuOpen(false)}>👤 My Account</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ color: '#fca5a5', background: 'none', border: 'none', padding: '10px 14px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/customer/login" style={{ color: '#fbbf24', textDecoration: 'none', padding: '10px 14px', fontWeight: 600, fontSize: '15px', display: 'block' }} onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link href="/customer/register" style={{ color: '#fff', textDecoration: 'none', padding: '10px 14px', fontWeight: 600, fontSize: '15px', display: 'block' }} onClick={() => setMenuOpen(false)}>Register Free →</Link>
                </>
              )}
            </div>
          )}
        </nav>

        {/* ══ HERO ══ */}
        <div className="hero-section" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 55%, #7c3aed 100%)', padding: 'clamp(32px,6vw,60px) clamp(16px,4vw,40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '600px', flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '5px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '14px', border: '1px solid rgba(245,158,11,0.35)' }}>
              🇰🇪 CBC Curriculum — Browse freely, login only to checkout
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 42px)', fontWeight: 800, color: '#fbbf24', margin: '0 0 12px', lineHeight: 1.2 }}>{SHOP_TAG}</h1>
            <p style={{ color: '#e9d5ff', fontSize: 'clamp(13px, 2vw, 16px)', marginBottom: '24px', lineHeight: 1.7 }}>
              Browse &amp; add to cart freely. Login only needed when ready to checkout.
            </p>
            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '500px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
              <input type="text" placeholder="Search books, stationery..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '13px 16px', border: 'none', fontSize: '14px', outline: 'none', color: '#1e1b4b', minWidth: 0 }} />
              <button type="submit" style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', padding: '13px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>🔍 Search</button>
            </form>
            <div className="hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => { setActiveTab('books'); setSearchResults(null); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '10px', padding: '13px 26px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>Browse Books</button>
              <button onClick={() => { setActiveTab('stationery'); setSearchResults(null); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '10px', padding: '12px 26px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>Browse Stationery</button>
            </div>
          </div>
          <div className="hero-emojis" style={{ fontSize: 'clamp(34px,6vw,56px)', letterSpacing: '8px', opacity: 0.85 }}>📗📘📙✏️📐</div>
        </div>

        {/* Cart summary bar */}
        {cartCount > 0 && (
          <div style={{ background: '#4c1d95', padding: '10px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ color: '#e9d5ff', fontSize: '14px', fontWeight: 600 }}>🛒 {cartCount} item{cartCount !== 1 ? 's' : ''} in cart</span>
              <button onClick={handleCheckout} style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                {isLoggedIn ? 'View Cart & Checkout →' : 'Login to Checkout →'}
              </button>
            </div>
          </div>
        )}

        {/* CBC Level filter */}
        {activeTab === 'books' && !searchResults && (
          <div style={{ background: '#fff', borderBottom: '1px solid #ddd6fe', padding: '10px 16px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content', maxWidth: '1100px', margin: '0 auto' }}>
              {['All', ...CBC_LEVELS].map(lvl => (
                <button key={lvl} onClick={() => setActiveLevel(lvl)}
                  style={{ background: activeLevel === lvl ? '#6b21a8' : '#f5f3ff', color: activeLevel === lvl ? '#fff' : '#6b21a8', border: `1.5px solid ${activeLevel === lvl ? '#6b21a8' : '#ddd6fe'}`, borderRadius: '20px', padding: '7px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {LEVEL_EMOJI[lvl]} {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="search-row" id="shop" style={{ maxWidth: '1100px', margin: '0 auto', padding: '18px 16px 8px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '10px', padding: '4px', border: '1px solid #ddd6fe' }}>
            <button onClick={() => { setActiveTab('books'); setSearchResults(null); }} style={{ background: activeTab === 'books' && !searchResults ? '#6b21a8' : 'transparent', color: activeTab === 'books' && !searchResults ? '#fff' : '#6b7280', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>📚 Books</button>
            <button onClick={() => { setActiveTab('stationery'); setSearchResults(null); }} style={{ background: activeTab === 'stationery' && !searchResults ? '#6b21a8' : 'transparent', color: activeTab === 'stationery' && !searchResults ? '#fff' : '#6b7280', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>✏️ Stationery</button>
          </div>
          {searchResults && (
            <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>✕ Clear Search Results</button>
          )}
        </div>

        {/* Products */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 16px 40px' }}>

          {/* Search results */}
          {searchResults !== null && (
            <>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>Found {searchResults.length} results for "{searchQuery}"</p>
              {searchResults.length === 0
                ? <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>No results found.</div>
                : <div className="landing-grid">
                  {searchResults.map((item, i) => (
                    <ProductCard key={i} item={item} type={item.type} onAdd={handleAddToCart} addedId={null} />
                  ))}
                </div>
              }
            </>
          )}

          {/* Books tab */}
          {!searchResults && activeTab === 'books' && (
            loadingBooks
              ? <p style={{ textAlign: 'center', padding: '60px', color: '#6b21a8' }}>Loading books...</p>
              : filteredBooks.length === 0
                ? <div style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>No books found.</p>
                  <button onClick={() => { setActiveLevel('All'); setSearchQuery(''); }} style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Clear Filters</button>
                </div>
                : <div className="landing-grid">
                  {filteredBooks.map(book => <ProductCard key={book.book_id} item={book} type="book" onAdd={handleAddToCart} />)}
                </div>
          )}

          {/* Stationery tab */}
          {!searchResults && activeTab === 'stationery' && (
            loadingStationery
              ? <p style={{ textAlign: 'center', padding: '60px', color: '#6b21a8' }}>Loading stationery...</p>
              : filteredStationery.length === 0
                ? <div style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>No stationery found.</p>
                  <button onClick={() => setSearchQuery('')} style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Clear Search</button>
                </div>
                : <div className="landing-grid">
                  {filteredStationery.map(item => <ProductCard key={item.id} item={item} type="stationery" onAdd={handleAddToCart} />)}
                </div>
          )}
        </div>

        {/* Sticky checkout banner */}
        {cartCount > 0 && (
          <div style={{ background: '#fff', borderTop: '2px solid #ddd6fe', padding: '14px 20px', position: 'sticky', bottom: 0, zIndex: 50, boxShadow: '0 -4px 20px rgba(107,33,168,0.12)' }}>
            <div className="checkout-banner" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#1e1b4b' }}>🛒 {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</div>
                {!isLoggedIn && <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>Login or register to complete your order</div>}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {!isLoggedIn && <Link href="/customer/register" style={{ background: 'transparent', color: '#6b21a8', border: '2px solid #6b21a8', borderRadius: '8px', padding: '10px 18px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Register Free</Link>}
                <button onClick={handleCheckout} style={{ background: '#6b21a8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  {isLoggedIn ? '✅ Proceed to Checkout →' : '🔒 Login to Checkout →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ background: '#4c1d95', paddingTop: '36px' }}>
          <div className="footer-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', marginBottom: '6px' }}>📚 {SHOP_NAME}</div>
              <div style={{ color: '#c4b5fd', fontSize: '13px' }}>{SHOP_TAG}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#e9d5ff', fontSize: '14px' }}>📞 {SHOP_PHONE}</div>
              <div style={{ color: '#e9d5ff', fontSize: '14px' }}>✉️ {SHOP_EMAIL}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/customer/login" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Login</Link>
              <Link href="/customer/register" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Register</Link>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
            © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}

// Product card component
function ProductCard({ item, type, onAdd }) {
  const [added, setAdded] = useState(false);
  const imgSrc = item.cover_image || item.image || null;

  const handleAdd = () => {
    onAdd(item, type);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(107,33,168,0.07)', border: '1px solid #ede9fe', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '175px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imgSrc
          ? <img src={imgSrc} alt={item.title || item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
          : <span style={{ fontSize: '52px' }}>{type === 'book' ? '📚' : '✏️'}</span>
        }
        {item.level && <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#6b21a8', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>{item.level}</span>}
      </div>
      <div style={{ padding: '13px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e1b4b', lineHeight: 1.3 }}>{item.title || item.name}</div>
        {item.author && <div style={{ fontSize: '11px', color: '#6b7280' }}>by {item.author}</div>}
        {item.grade && <div style={{ fontSize: '11px', color: '#7e22ce', background: '#f5f3ff', borderRadius: '5px', padding: '2px 7px', display: 'inline-block', marginTop: '2px' }}>Grade: {item.grade}</div>}
        {item.subject && <div style={{ fontSize: '11px', color: '#7e22ce', background: '#f5f3ff', borderRadius: '5px', padding: '2px 7px', display: 'inline-block', marginTop: '2px' }}>📖 {item.subject}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6b21a8' }}>KSh {parseFloat(item.price).toLocaleString()}</span>
          <button onClick={handleAdd} style={{ background: added ? '#16a34a' : '#f59e0b', color: added ? '#fff' : '#1e1b4b', border: 'none', borderRadius: '8px', padding: '7px 12px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s', minWidth: '58px' }}>
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}