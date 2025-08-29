'use client';
import { useEffect, useState } from 'react';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    book_id: null,
    title: '',
    author: '',
    price: '',
    stock: '',
    description: '',
    cover_image: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://process.env.server/bookshop/api/books/index.php');
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover_image') {
      setForm({ ...form, cover_image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      book_id: null,
      title: '',
      author: '',
      price: '',
      stock: '',
      description: '',
      cover_image: null,
    });
    setIsEditing(false);
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
        ? 'http://process.env.server/bookshop/api/admin/books/update.php'
        : 'http://process.env.server/bookshop/api/books/add.php';

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert(isEditing ? 'Book updated successfully' : 'Book added successfully');
        resetForm();
        fetchBooks();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleEdit = (book) => {
    setForm({
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      description: book.description,
      cover_image: null,
    });
    setIsEditing(true);
    window.scrollTo(0, 0); // Scroll to form
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`http://process.env.server/bookshop/api/admin/books/delete.php?id=${id}`, {
        method: 'GET',
      });
      const data = await res.json();
      if (data.success) {
        alert('Book deleted successfully');
        fetchBooks();
      } else {
        alert(data.message || 'Failed to delete book');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">{isEditing ? '✏️ Edit Book' : '📚 Add Book'}</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 text-black" required />
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2 text-black" />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 text-black" required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 text-black" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 col-span-2 text-black" />
          <input name="cover_image" type="file" accept="image/*" onChange={handleChange} className="col-span-2" />
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? 'Update Book' : 'Add Book'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Book Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Author</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Stock</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.book_id} className="border-t text-black">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{book.title}</td>
                <td className="py-2 px-4 border">{book.author}</td>
                <td className="py-2 px-4 border">Ksh {book.price}</td>
                <td className="py-2 px-4 border">{book.stock}</td>
                <td className="py-2 px-4 border text-sm">{book.description}</td>
                <td className="py-2 px-4 border text-sm">{book.cover_image}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button onClick={() => handleEdit(book)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(book.book_id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
