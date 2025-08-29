'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

// Child component that uses useSearchParams
function ProfileQueryInfo() {
  // Import here to avoid "use client" warning in parent
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  // Example: get a query param (e.g., ?ref=abc)
  const ref = searchParams.get('ref');

  if (!ref) return null;
  return (
    <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded">
      Referral code: <span className="font-mono">{ref}</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ id: '', username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.push('/customer/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/bookshop/api/customer/profile.php?id=${customerId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const user = data.data;
          setProfile({
            id: user.customer_id || user.id,
            username: user.username,
            email: user.email,
          });
          setForm({ username: user.username, email: user.email });

          localStorage.setItem('customerName', user.username);
        } else {
          router.push('/customer/login');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        router.push('/customer/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('sharedCart');
    localStorage.removeItem('lastOrderId');
    router.push('/customer/login');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/bookshop/api/customer/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, ...form }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, ...form });
        localStorage.setItem('customerName', form.username);
        setEditing(false);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
        <Suspense fallback={null}>
          <ProfileQueryInfo />
        </Suspense>
        <div className="flex items-center mb-6 gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="text-sm text-gray-500">Customer ID: {profile.id}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            className={`px-6 py-2 rounded text-white ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editing ? 'Save' : 'Edit Profile'}
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
