'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); }
    else { setAuthorized(true); }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!authorized) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f3ff' }}>
      <p style={{ color: '#6b21a8' }}>Checking credentials...</p>
    </div>
  );

  const menuItems = [
    { href: '/admin/books', icon: '📚', label: 'Manage Books', desc: 'Add, edit, delete books' },
    { href: '/admin/stationery', icon: '✏️', label: 'Manage Stationery', desc: 'Add, edit, delete stationery' },
    { href: '/admin/orders', icon: '📦', label: 'View Orders', desc: 'Manage customer orders' },
    { href: '/admin/customers', icon: '👥', label: 'View Customers', desc: 'Browse registered customers' },
    { href: '/admin/register', icon: '➕', label: 'Register Admin', desc: 'Add new admin accounts' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>📚 Brightmind Books — Admin</span>
        <button onClick={handleLogout} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Logout</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#6b21a8', marginBottom: '8px' }}>Admin Dashboard</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Manage your bookshop from here.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {menuItems.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 2px 12px rgba(107,33,168,0.07)', border: '1px solid #ddd6fe', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#6b21a8', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}