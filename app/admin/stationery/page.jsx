'use client';
import { useEffect, useState } from 'react';

export default function AdminStationeryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchStationery = async () => {
    try {
      const res = await fetch('http://localhost/bookshop/api/admin/index.php');
      const data = await res.json();
      if (data.success && Array.isArray(data.stationery)) {
        setItems(data.stationery);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchStationery();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', price: '', image: null });
    setIsEditing(false);
    document.getElementById('imageInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      const url = isEditing
        ? 'http://localhost/bookshop/api/admin/update_stationery.php'
        : 'http://localhost/bookshop/api/admin/add_stationery.php';

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert(isEditing ? '✅ Stationery updated successfully' : '✅ Stationery added successfully');
        resetForm();
        fetchStationery();
      } else {
        alert(data.message || '❌ Operation failed');
      }
    } catch (err) {
      alert('⚠️ Network error');
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: null,
    });
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`http://localhost/bookshop/api/admin/delete_stationery.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        alert('🗑️ Deleted successfully');
        fetchStationery();
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (err) {
      alert('⚠️ Network error');
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">{isEditing ? '✏️ Edit Stationery' : '🖋 Add Stationery'}</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" required />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 col-span-2" />
          <input id="imageInput" name="image" type="file" accept="image/*" onChange={handleChange} className="col-span-2" />
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left font-semibold">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{item.name}</td>
                <td className="py-2 px-4 border">Ksh {item.price}</td>
                <td className="py-2 px-4 border">{item.description}</td>
                <td className="py-2 px-4 border">{item.image}</td>
                <td className="py-2 px-4 border">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
