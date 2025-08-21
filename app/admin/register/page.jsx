'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ id: null, username: '', password: '' });
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost/bookshop/api/admin/admins.php');
      const data = await res.json();
      if (data.success && Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: null, username: '', password: '' });
    setIsEditing(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isEditing
      ? 'http://localhost/bookshop/api/admin/update.php'
      : 'http://localhost/bookshop/api/admin/register.php';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert(isEditing ? 'Admin updated successfully.' : 'Admin registered successfully.');
        resetForm();
        fetchAdmins();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  const handleEdit = (admin) => {
    setForm({ id: admin.id, username: admin.username, password: '' });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const res = await fetch(`http://localhost/bookshop/api/admin/delete.php?id=${id}`, {
        method: 'GET',
      });
      const data = await res.json();
      if (data.success) {
        alert('Admin deleted successfully.');
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to delete admin');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Admin' : 'Register New Admin'}</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder={isEditing ? 'Leave blank to keep existing password' : 'Password'}
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded pr-10"
            required={!isEditing}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2 right-3 text-xl"
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700">
            {isEditing ? 'Update Admin' : 'Register Admin'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Admins Table */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Registered Admins</h3>
        <table className="w-full bg-white border border-gray-300 rounded shadow text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id} className="border-t text-black">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{admin.username}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="text-blue-600 mr-3 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="3" className="py-3 px-4 text-center text-gray-500">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
