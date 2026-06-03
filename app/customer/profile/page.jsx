'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'https://tender-empathy-production-c8ad.up.railway.app';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ id: '', username: '', full_name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', full_name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) { router.push('/customer/login'); return; }

    fetch(`${API}/api/customer/profile.php?id=${customerId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const u = data.data;
          setProfile({ id: u.id, username: u.username, full_name: u.full_name || '', phone: u.phone || '', email: u.email });
          setForm({ username: u.username, full_name: u.full_name || '', phone: u.phone || '', email: u.email });
          localStorage.setItem('customerName', u.username);
          localStorage.setItem('customerPhone', u.phone || '');
        } else {
          router.push('/customer/login');
        }
      })
      .catch(() => router.push('/customer/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    ['customerId', 'customerName', 'customerPhone', 'lastOrderId'].forEach(k => localStorage.removeItem(k));
    router.push('/customer/login');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.full_name || !form.phone || !form.username || !form.email) { setMessage('All fields are required'); return; }
    if (!/^(07|01)\d{8}$/.test(form.phone)) { setMessage('Invalid phone. Use 07XXXXXXXX'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/customer/profile.php`, {
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
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch { setMessage('Network error'); }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API}/api/customer/profile.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id }),
      });
      const data = await res.json();
      if (data.success) {
        ['customerId', 'customerName', 'customerPhone', 'sharedCart', 'lastOrderId'].forEach(k => localStorage.removeItem(k));
        router.push('/customer/register');
      } else {
        setMessage(data.message || 'Delete failed');
      }
    } catch { setMessage('Network error'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f3ff' }}>
      <p style={{ color: '#6b21a8', fontSize: '16px' }}>Loading profile...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/customer/home" style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', textDecoration: 'none' }}>📚 Brightmind Books</Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/customer/home" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>← Home</Link>
          <button onClick={handleLogout} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '560px', margin: '30px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(107,33,168,0.10)', border: '1px solid #ddd6fe', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #6b21a8, #7c3aed)', padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '32px' }}>👤</div>
            <h2 style={{ color: '#fbbf24', fontSize: '22px', fontWeight: 800, margin: 0 }}>{profile.username}</h2>
            <p style={{ color: '#e9d5ff', fontSize: '13px', margin: '4px 0 0' }}>Customer ID: {profile.id}</p>
          </div>

          <div style={{ padding: '24px' }}>
            {message && (
              <div style={{ background: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#16a34a' : '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {message}
              </div>
            )}

            {[
              { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Your full name' },
              { label: 'Username', name: 'username', type: 'text', placeholder: 'Username' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '07XXXXXXXX' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '6px' }}>{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} disabled={!editing} placeholder={field.placeholder}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: `1.5px solid ${editing ? '#6b21a8' : '#ddd6fe'}`, fontSize: '14px', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', background: editing ? '#faf9ff' : '#f9fafb' }} />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
              <button onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}
                style={{ flex: 1, padding: '12px', background: editing ? '#16a34a' : '#6b21a8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                {saving ? 'Saving...' : editing ? '✅ Save Changes' : '✏️ Edit Profile'}
              </button>
              {editing && (
                <button onClick={() => { setEditing(false); setForm({ username: profile.username, full_name: profile.full_name, phone: profile.phone, email: profile.email }); }}
                  style={{ padding: '12px 20px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>

            {/* Delete account */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f0ff' }}>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} style={{ color: '#dc2626', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  🗑 Delete My Account
                </button>
              ) : (
                <div style={{ background: '#fee2e2', borderRadius: '10px', padding: '16px', border: '1px solid #fca5a5' }}>
                  <p style={{ color: '#dc2626', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>⚠️ This cannot be undone. Are you sure?</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleDeleteAccount} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Yes, Delete</button>
                    <button onClick={() => setShowDeleteConfirm(false)} style={{ background: '#6b7280', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}