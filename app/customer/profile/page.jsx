'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function ProfileQueryInfo() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
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
  const [profile, setProfile] = useState({ id: '', username: '', full_name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', full_name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/customer/login'); return; }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://tender-empathy-production-c8ad.up.railway.app/api/customer/profile.php?id=${customerId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const u = data.data;
          setProfile({ id: u.id, username: u.username, full_name: u.full_name || '', phone: u.phone || '', email: u.email });
          setForm({ username: u.username, full_name: u.full_name || '', phone: u.phone || '', email: u.email });
          localStorage.setItem('customerName', u.username);
          localStorage.setItem('customerPhone', u.phone || '');
        } else {
          router.push('/customer/login');
        }
      } catch {
        router.push('/customer/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    ['customerId', 'customerName', 'customerPhone', 'sharedCart', 'lastOrderId'].forEach(k => localStorage.removeItem(k));
    router.push('/customer/login');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.full_name || !form.phone || !form.username || !form.email) {
      alert('All fields are required'); return;
    }
    if (!/^(07|01)\d{8}$/.test(form.phone)) {
      alert('Invalid phone. Use 07XXXXXXXX'); return;
    }

    setSaving(true);
    try {
      const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/customer/profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, ...form }),
      });
      const data = await res.json();

      if (data.success) {
        setProfile({ ...profile, ...form });
        localStorage.setItem('customerName', form.username);
        localStorage.setItem('customerPhone', form.phone);
        setEditing(false);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/customer/profile.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id }),
      });
      const data = await res.json();

      if (data.success) {
        ['customerId', 'customerName', 'customerPhone', 'sharedCart', 'lastOrderId'].forEach(k => localStorage.removeItem(k));
        router.push('/customer/register');
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch {
      alert('Network error');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-700">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
        <Suspense fallback={null}><ProfileQueryInfo /></Suspense>

        <div className="flex items-center mb-6 gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl">👤</div>
          <div>
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="text-sm text-gray-500">Customer ID: {profile.id}</p>
          </div>
        </div>

        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100" placeholder="Your full name" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100" placeholder="07XXXXXXXX" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editing}
              className="w-full border px-4 py-2 rounded text-black disabled:bg-gray-100" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between flex-wrap gap-2">
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={saving}
            className={`px-6 py-2 rounded text-white ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
          </button>

          {editing && (
            <button onClick={() => setEditing(false)} className="px-6 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white">
              Cancel
            </button>
          )}

          <button onClick={handleLogout} className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
            Logout
          </button>
        </div>

        {/* Delete Account */}
        <div className="mt-6 border-t pt-4">
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="text-red-500 text-sm hover:underline">
              🗑 Delete My Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-700 font-semibold mb-3">⚠️ Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                  Yes, Delete Account
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}