'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return <p className="text-center mt-10 text-gray-600">Checking credentials...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-center text-blue-600">📚 Admin Panel</h2>
        <nav className="space-y-4">
          <a href="/admin/register" className="block text-blue-600">➕ Register Admin</a>
          <a href="/admin/books" className="block text-blue-700 hover:underline">📘 Manage Books</a>
          <a href="/admin/stationery" className="block text-blue-700 hover:underline">🖊 Manage Stationery</a>
          <a href="/admin/orders" className="block text-blue-700 hover:underline">📦 View Orders</a>
          <a href="/admin/customers" className="block text-blue-700 hover:underline">👤 View Customers</a>
          <a href="/admin/reviews" className="block text-blue-700 hover:underline">📝 View Reviews</a>

          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              router.push('/admin/login');
            }}
            className="text-red-600 hover:underline"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Select a section from the sidebar to manage content.</p>
      </main>
    </div>
  );
}
