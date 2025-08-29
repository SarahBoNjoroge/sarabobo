'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import CartIcon from '../../components/CartIcon';

// Child component that uses useSearchParams
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
        className="bg-yellow-400 text-black px-6 py-2 rounded-r-lg font-semibold hover:bg-yellow-500"
      >
        Search
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
        const res = await fetch(`/bookshop/api/customer/profile.php?id=${customerId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setCustomerName(data.data.username);
        } else {
          setCustomerName('');
        }
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setCustomerName('');
      }
    };

    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('customerId');
    router.push('/customer/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white p-6 hidden md:flex flex-col justify-between">
        {/* Top Section: Profile */}
        <div className="flex flex-col items-center">
          <Link href="/customer/profile" className="flex flex-col items-center hover:opacity-90 transition">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3 shadow">
              <span className="text-gray-400 text-4xl">👤</span>
            </div>
            <p className="text-lg font-medium">{customerName || 'My Profile'}</p>
          </Link>
          <button
            onClick={logout}
            className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* Bottom Section: Cart Icon */}
        <div className="mt-10 flex justify-center">
          <CartIcon />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center h-[95vh] flex items-center justify-center text-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1470&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-blue-900 opacity-80"></div>
          <div className="relative z-10 text-white px-6 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-xl">
              Welcome to Compeers Bookshop
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Discover books, stationery, and educational resources designed to elevate your learning and fuel your passion for knowledge.
            </p>

            {/* Search Bar */}
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/customer/dashboard"
                className="bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-200 transition"
              >
                Browse Books
              </Link>
              <Link
                href="/customer/stationery"
                className="bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-200 transition"
              >
                Browse Stationery
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-16 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-800 mb-4">About Compeers Bookshop</h2>
          <p className="text-lg text-gray-700">
            Compeers Bookshop is your gateway to academic excellence. We provide a curated selection of textbooks, novels, and professional guides alongside essential stationery. Our mission is to empower learners and lifelong readers across the globe.
          </p>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-100 py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">📚 Extensive Book Collection</h3>
              <p className="text-gray-600">From academic material to your favorite reads, explore a world of stories and knowledge.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">🖊️ Premium Stationery</h3>
              <p className="text-gray-600">Everything you need to write, draw, and plan — all in one place.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">🧾 Smooth Online Ordering</h3>
              <p className="text-gray-600">Order books and stationery online with instant invoice generation.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-purple-800 mb-3">Contact Us</h2>
          <p className="text-gray-700">📧 Email: support@compeersbookshop.com</p>
          <p className="text-gray-700">📞 Phone: +254 712 345 678</p>
          <p className="mt-2 text-gray-500">We're here to help — reach out anytime!</p>

          <Link
            href="/customer/reviews"
            className="mt-4 inline-block bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
          >
            ✍️ Give a Review
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 text-sm text-center py-4">
          © {new Date().getFullYear()} Compeers Bookshop. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
