'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartIcon from '../../components/CartIcon';

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

const purple = '#6b21a8';
const darkPurple = '#4c1d95';
const yellow = '#f59e0b';

function BookSearchParamsInfo() {
  const { useSearchParams } = require('next/navigation');
  useSearchParams();
  return null;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [filterLevel, setFilterLevel] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://tender-empathy-production-c8ad.up.railway.app/api/books/index.php')
      .then(res => res.json())
      .then(data => data.success ? setBooks(data.books) : setError('Failed to load books.'))
      .catch(() => setError('Network error.'));
  }, []);

  const handleQuantityChange = (bookId, value) => {
    setQuantities(prev => ({ ...prev, [bookId]: Math.max(1, parseInt(value) || 1) }));
  };

  const addToCart = (book) => {
    const quantity = quantities[book.book_id] || 1;
    const currentCart = JSON.parse(localStorage.getItem('sharedCart') || '[]');
    const idx = currentCart.findIndex(item => item.type === 'book' && item.id === book.book_id);

    if (idx !== -1) {
      currentCart[idx].quantity += quantity;
    } else {
      currentCart.push({
        type: 'book',
        id: book.book_id,
        title: book.title,
        price: parseFloat(book.price),
        quantity,
        image: book.cover_image || null,
      });
    }

    localStorage.setItem('sharedCart', JSON.stringify(currentCart));
    setQuantities(prev => ({ ...prev, [book.book_id]: 1 }));
    alert('Book added to cart!');
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    if (filterLevel && book.level !== filterLevel) return false;
    if (filterGrade && book.grade !== filterGrade) return false;
    if (filterSubject && book.subject !== filterSubject) return false;
    if (search && !book.title.toLowerCase().includes(search.toLowerCase()) &&
      !book.author?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const availableGrades = filterLevel ? CBC_LEVELS[filterLevel]?.grades : [];
  const availableSubjects = filterLevel ? CBC_LEVELS[filterLevel]?.subjects : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: 'sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: darkPurple, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/customer/home" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>🏠 Home</Link>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>📚 Books</span>
          <Link href="/customer/stationery" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>🖊️ Stationery</Link>
        </div>
        <CartIcon />
      </div>

      <Suspense fallback={null}><BookSearchParamsInfo /></Suspense>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>

        {/* Search bar */}
        <input
          type="text"
          placeholder="🔍 Search books by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: `2px solid ${purple}`, fontSize: 14, marginBottom: 16, color: '#1a1a1a', outline: 'none' }}
        />

        {/* CBC Filter Bar */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(107,33,168,0.08)' }}>
          <p style={{ fontWeight: 700, color: darkPurple, marginBottom: 12, fontSize: 15 }}>📖 Filter by CBC Curriculum</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>

            {/* Level */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>LEVEL</label>
              <select
                value={filterLevel}
                onChange={e => { setFilterLevel(e.target.value); setFilterGrade(''); setFilterSubject(''); }}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1.5px solid ${purple}`, color: '#1a1a1a', fontSize: 14 }}
              >
                <option value="">All Levels</option>
                {Object.keys(CBC_LEVELS).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>GRADE</label>
              <select
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                disabled={!filterLevel}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1.5px solid ${filterLevel ? purple : '#ddd'}`, color: '#1a1a1a', fontSize: 14, opacity: filterLevel ? 1 : 0.5 }}
              >
                <option value="">All Grades</option>
                {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>SUBJECT</label>
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                disabled={!filterLevel}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1.5px solid ${filterLevel ? purple : '#ddd'}`, color: '#1a1a1a', fontSize: 14, opacity: filterLevel ? 1 : 0.5 }}
              >
                <option value="">All Subjects</option>
                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Active filters + clear */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              Showing <strong>{filteredBooks.length}</strong> of <strong>{books.length}</strong> books
              {filterLevel && <span style={{ color: purple, fontWeight: 600 }}> — {filterLevel}{filterGrade ? ` › ${filterGrade}` : ''}{filterSubject ? ` › ${filterSubject}` : ''}</span>}
            </p>
            {(filterLevel || filterGrade || filterSubject || search) && (
              <button
                onClick={() => { setFilterLevel(''); setFilterGrade(''); setFilterSubject(''); setSearch(''); }}
                style={{ fontSize: 12, color: '#ef4444', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Level quick filter buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.keys(CBC_LEVELS).map(level => (
            <button
              key={level}
              onClick={() => { setFilterLevel(filterLevel === level ? '' : level); setFilterGrade(''); setFilterSubject(''); }}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: filterLevel === level ? purple : '#fff',
                color: filterLevel === level ? '#fff' : purple,
                boxShadow: '0 1px 4px rgba(107,33,168,0.15)',
                transition: 'all 0.2s'
              }}
            >
              {level === 'Pre-Primary' ? '' : level === 'Primary' ? '' : level === 'Junior Secondary' ? '' : ''} {level}
            </button>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 10 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h3 style={{ color: darkPurple, marginBottom: 8 }}>No books found</h3>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Try changing your filters or search term</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {filteredBooks.map(book => (
              <div key={book.book_id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(107,33,168,0.08)', transition: 'transform 0.2s' }}>
                <img
                  src={book.cover_image}
                  alt={book.title}
                  style={{ width: '100%', height: 180, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => router.push(`/customer/books/${book.book_id}`)}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=220&h=180&fit=crop'; }}
                />
                <div style={{ padding: 12 }}>
                  {/* CBC badges */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                    {book.level && (
                      <span style={{ background: '#ede9fe', color: purple, fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999 }}>
                        {book.level}
                      </span>
                    )}
                    {book.grade && (
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999 }}>
                        {book.grade}
                      </span>
                    )}
                  </div>

                  <h2
                    style={{ fontWeight: 700, fontSize: 14, color: darkPurple, cursor: 'pointer', marginBottom: 2, lineHeight: 1.3 }}
                    onClick={() => router.push(`/customer/books/${book.book_id}`)}
                  >
                    {book.title}
                  </h2>
                  {book.subject && <p style={{ fontSize: 12, color: '#7c3aed', marginBottom: 2 }}>{book.subject}</p>}
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>by {book.author}</p>
                  <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: 10, fontSize: 15 }}>Ksh {parseFloat(book.price).toFixed(2)}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number" min={1} value={quantities[book.book_id] || 1}
                      onChange={e => handleQuantityChange(book.book_id, e.target.value)}
                      style={{ width: 48, border: `1.5px solid ${purple}`, borderRadius: 4, padding: '4px 6px', fontSize: 13, color: '#1a1a1a' }}
                    />
                    <button
                      onClick={() => addToCart(book)}
                      style={{ flex: 1, background: yellow, color: '#1a1a1a', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}