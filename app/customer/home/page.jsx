'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import CartIcon from '../../components/CartIcon';

function SearchBar() {
  'use client';
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
    <form onSubmit={handleSearch} className="flex justify-center mt-4">
      <input
        type="text"
        placeholder="Search for books or stationery..."
        className="w-full max-w-md px-4 py-2 rounded-l-lg text-black"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-r-lg font-semibold hover:opacity-90"
        style={{ background: '#f59e0b', color: '#1e1b4b' }}
      >
        🔍 Search
      </button>
    </form>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      try {
        const res = await fetch(`http://127.0.0.1/bookshop/api/customer/profile.php?id=${customerId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setCustomerName(data.data.username);
        } else {
          setCustomerName('');
        }
      } catch { setCustomerName(''); }
    };
    fetchProfile();
  }, []);

  // ✅ LOGOUT — does NOT clear sharedCart
  const logout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('lastOrderId');
    // ✅ sharedCart is intentionally NOT removed here
    router.push('/customer/login');
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans flex" style={{ background: '#f5f3ff' }}>

      {/* Sidebar */}
      <div className="w-56 text-white p-6 hidden md:flex flex-col items-center gap-6 pt-10" style={{ background: '#6b21a8' }}>
        <Link href="/customer/profile" className="flex flex-col items-center gap-2 hover:opacity-90 transition">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#f59e0b' }}>
            <span className="text-3xl">👤</span>
          </div>
          <span className="text-sm font-semibold text-center" style={{ color: '#fbbf24' }}>
            {customerName || 'My Profile'}
          </span>
        </Link>
        <button
          onClick={logout}
          className="mt-2 px-4 py-2 rounded text-sm font-semibold w-full"
          style={{ background: '#dc2626', color: '#fff' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center h-[95vh] flex items-center justify-center text-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1470&q=80')" }}
        >
          <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 60%, #7c3aed 100%)' }}></div>
          <div className="relative z-10 text-white px-6 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl" style={{ color: '#fbbf24' }}>
              Welcome to Brightmind Books
            </h1>
            <p className="text-xl mb-6" style={{ color: '#e9d5ff' }}>
              Discover books, stationery, and educational resources designed to elevate your learning and fuel your passion for knowledge.
            </p>
            <Suspense fallback={null}><SearchBar /></Suspense>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <Link href="/customer/dashboard" className="px-6 py-2 rounded-lg font-semibold shadow-md transition hover:opacity-90" style={{ background: '#f59e0b', color: '#1e1b4b' }}>
                Browse Books
              </Link>
              <Link href="/customer/stationery" className="px-6 py-2 rounded-lg font-semibold shadow-md transition hover:opacity-90" style={{ background: '#fff', color: '#6b21a8' }}>
                Browse Stationery
              </Link>
              <Link href="/customer/cart" className="px-6 py-2 rounded-lg font-semibold shadow-md transition hover:opacity-90" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
                🛒 My Cart
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-16 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#6b21a8' }}>About Brightmind Books</h2>
          <p className="text-lg text-gray-700">
            Brightmind Books is your gateway to academic excellence. We provide a curated selection of textbooks, novels, and professional guides alongside essential stationery. Our mission is to empower learners and lifelong readers across Kenya.
          </p>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #fff 50%, #fef3c7 100%)' }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6 bg-white shadow rounded-lg border-t-4" style={{ borderColor: '#6b21a8' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#6b21a8' }}>📚 Extensive Book Collection</h3>
              <p className="text-gray-600">From academic material to your favorite reads, explore a world of stories and knowledge.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg border-t-4" style={{ borderColor: '#f59e0b' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#6b21a8' }}>🖊️ Premium Stationery</h3>
              <p className="text-gray-600">Everything you need to write, draw, and plan — all in one place.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg border-t-4" style={{ borderColor: '#6b21a8' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#6b21a8' }}>🧾 Smooth Online Ordering</h3>
              <p className="text-gray-600">Order books and stationery online with instant invoice generation.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#6b21a8' }}>Contact Us</h2>
          <p className="text-gray-700">📧 Email: support@brightmindbooks.co.ke</p>
          <p className="text-gray-700">📞 Phone: +254 712 345 678</p>
          <p className="mt-2 text-gray-500">We're here to help — reach out anytime!</p>
          <Link href="/customer/reviews" className="mt-4 inline-block text-white px-6 py-2 rounded hover:opacity-90 transition" style={{ background: '#6b21a8' }}>
            ✍️ Give a Review
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-gray-300 text-sm text-center py-4" style={{ background: '#1e1b4b' }}>
          © {new Date().getFullYear()} Brightmind Books. All rights reserved.
        </footer>
      </div>
    </div>
  );
}