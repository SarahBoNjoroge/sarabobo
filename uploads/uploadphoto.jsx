'use client';
import { useState } from 'react';

export default function UploadBook() {
  const [form, setForm] = useState({ title: '', author: '', description: '', price: '' });
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setCover(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (cover) formData.append('cover', cover);

    try {
      const res = await fetch('http://localhost/bookshop/api/books/upload.php', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Upload Book</h2>
      <input type="text" name="title" placeholder="Title" required onChange={handleChange} className="border w-full p-2" />
      <input type="text" name="author" placeholder="Author" required onChange={handleChange} className="border w-full p-2" />
      <textarea name="description" placeholder="Description" required onChange={handleChange} className="border w-full p-2" />
      <input type="number" name="price" placeholder="Price" required step="0.01" onChange={handleChange} className="border w-full p-2" />
      <input type="file" accept="image/*" onChange={handleFileChange} className="border w-full p-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </form>
  );
}
