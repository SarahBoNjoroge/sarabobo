'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/customer/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[90vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-blue-900 opacity-80"></div>
        <div className="relative z-10 text-white w-full max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-xl leading-tight">
            Welcome to Brightmind books
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6">
            Discover books, stationery, and educational resources to fuel your knowledge.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Search books or stationery..."
              className="w-full sm:w-72 px-4 py-2 rounded sm:rounded-l-lg border-0 text-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-6 py-2 rounded sm:rounded-r-lg font-semibold hover:bg-yellow-500 transition w-full sm:w-auto"
            >
              Search
            </button>
          </form>

          {/* Login/Signup Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              href="/customer/login"
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition"
            >
              Login
            </Link>
            <Link
              href="/customer/register"
              className="bg-white text-purple-800 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">About Brightmind books</h2>
        <p className="text-base sm:text-lg text-gray-700">
          Brightmind books provides a curated selection of textbooks, novels, and professional guides alongside
          essential stationery. Our mission is to empower learners and lifelong readers across the globe.
        </p>
      </section>

      {/* Services / Features */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-100 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-center">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">📚 Extensive Book Collection</h3>
            <p className="text-gray-600 text-sm">Explore a wide range of academic and creative reads.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">🖊️ Premium Stationery</h3>
            <p className="text-gray-600 text-sm">Everything you need to write, draw, and plan — all in one place.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">🧾 Smooth Online Ordering</h3>
            <p className="text-gray-600 text-sm">Order with ease and receive an instant invoice.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 text-white text-center py-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Start Your Learning Journey Today</h2>
        <p className="text-sm sm:text-base mb-6">
          Join thousands of students and professionals who trust Brightmind books for their academic and creative needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/customer/register"
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Sign Up Now
          </Link>
          <Link
            href="/customer/login"
            className="bg-white text-purple-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 text-center max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-3">Contact Us</h2>
        <p className="text-gray-700 text-sm sm:text-base">📧 Email: support@Brightmind books.co.ke</p>
        <p className="text-gray-700 text-sm sm:text-base">📞 Phone: +254 712 345 678</p>
        <p className="mt-2 text-gray-500 text-sm">We're here to help — reach out anytime!</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-sm text-center py-4">
        © {new Date().getFullYear()} Brightmind books. All rights reserved.
      </footer>
    </div>
  );
}
