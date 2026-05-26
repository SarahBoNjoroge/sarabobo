'use client';
import { useEffect, useState } from 'react';

// CBC Kenya curriculum structure
const CBC_LEVELS = {
  'Pre-Primary': {
    grades: ['PP1', 'PP2'],
    subjects: ['Activities', 'Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Creative Activities']
  },
  'Primary': {
    grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    subjects: ['Literacy', 'Kiswahili', 'English', 'Mathematics', 'Environmental & Social Studies', 'CRE/IRE', 'Creative Arts', 'Music', 'Home Science', 'Agriculture', 'Physical Education']
  },
  'Junior Secondary': {
    grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Health Education', 'Pre-Technical Studies', 'Social Studies', 'Religious Education', 'Business Studies', 'Agriculture', 'Life Skills', 'Physical Education', 'Creative Arts & Sports']
  },
  'Senior Secondary': {
    grades: ['Grade 10', 'Grade 11', 'Grade 12'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE/IRE', 'Business Studies', 'Economics', 'Computer Science', 'Agriculture', 'Art & Design', 'Music']
  }
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [form, setForm] = useState({
    book_id: null,
    title: '',
    author: '',
    price: '',
    stock: '',
    description: '',
    cover_image: null,
    level: '',
    grade: '',
    subject: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost/bookshop/api/books/index.php');
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover_image') {
      setForm({ ...form, cover_image: files[0] });
    } else if (name === 'level') {
      // Reset grade and subject when level changes
      setForm({ ...form, level: value, grade: '', subject: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({ book_id: null, title: '', author: '', price: '', stock: '', description: '', cover_image: null, level: '', grade: '', subject: '' });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null && form[key] !== '') {
        formData.append(key, form[key]);
      }
    }

    try {
      const url = isEditing
        ? 'http://localhost/bookshop/api/admin/books/update.php'
        : 'http://localhost/bookshop/api/books/add.php';

      const res = await fetch(url, { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        alert(isEditing ? 'Book updated!' : 'Book added!');
        resetForm();
        fetchBooks();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch {
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
      level: book.level || '',
      grade: book.grade || '',
      subject: book.subject || '',
    });
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return;
    try {
      const res = await fetch(`http://localhost/bookshop/api/admin/books/delete.php?id=${id}`);
      const data = await res.json();
      if (data.success) { alert('Deleted!'); fetchBooks(); }
      else alert(data.message || 'Failed');
    } catch { alert('Network error'); }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    if (filterLevel && book.level !== filterLevel) return false;
    if (filterGrade && book.grade !== filterGrade) return false;
    if (filterSubject && book.subject !== filterSubject) return false;
    return true;
  });

  const levelGrades = form.level ? CBC_LEVELS[form.level]?.grades : [];
  const levelSubjects = form.level ? CBC_LEVELS[form.level]?.subjects : [];

  const filterGrades = filterLevel ? CBC_LEVELS[filterLevel]?.grades : [];
  const filterSubjects = filterLevel ? CBC_LEVELS[filterLevel]?.subjects : [];

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">{isEditing ? '✏️ Edit Book' : '📚 Add Book'}</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 text-black" required />
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2 text-black" />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 text-black" required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 text-black" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 col-span-2 text-black" />
          <input name="cover_image" type="file" accept="image/*" onChange={handleChange} className="col-span-2" />

          {/* CBC Fields */}
          <div className="col-span-2 grid grid-cols-3 gap-4 mt-2">
            {/* Level */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">CBC Level</label>
              <select name="level" value={form.level} onChange={handleChange} className="border p-2 w-full text-black rounded">
                <option value="">Select Level</option>
                {Object.keys(CBC_LEVELS).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Grade</label>
              <select name="grade" value={form.grade} onChange={handleChange} className="border p-2 w-full text-black rounded" disabled={!form.level}>
                <option value="">Select Grade</option>
                {levelGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Subject</label>
              <select name="subject" value={form.subject} onChange={handleChange} className="border p-2 w-full text-black rounded" disabled={!form.level}>
                <option value="">Select Subject</option>
                {levelSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? 'Update Book' : 'Add Book'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>

      {/* ✅ FILTER BAR */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-3 text-gray-700">🔍 Filter Books</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setFilterGrade(''); setFilterSubject(''); }} className="border p-2 w-full rounded text-black">
              <option value="">All Levels</option>
              {Object.keys(CBC_LEVELS).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="border p-2 w-full rounded text-black" disabled={!filterLevel}>
              <option value="">All Grades</option>
              {filterGrades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="border p-2 w-full rounded text-black" disabled={!filterLevel}>
              <option value="">All Subjects</option>
              {filterSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing {filteredBooks.length} of {books.length} books</p>
      </div>

      {/* ✅ BOOKS TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Author</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Stock</th>
              <th className="py-2 px-4 border">Level</th>
              <th className="py-2 px-4 border">Grade</th>
              <th className="py-2 px-4 border">Subject</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, index) => (
              <tr key={book.book_id} className="border-t text-black">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{book.title}</td>
                <td className="py-2 px-4 border">{book.author}</td>
                <td className="py-2 px-4 border">Ksh {book.price}</td>
                <td className="py-2 px-4 border">{book.stock}</td>
                <td className="py-2 px-4 border">
                  <span style={{ background: '#ede9fe', color: '#6b21a8', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                    {book.level || 'N/A'}
                  </span>
                </td>
                <td className="py-2 px-4 border">{book.grade || 'N/A'}</td>
                <td className="py-2 px-4 border">{book.subject || 'N/A'}</td>
                <td className="py-2 px-4 border text-sm">{book.cover_image ? '✅' : '❌'}</td>
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