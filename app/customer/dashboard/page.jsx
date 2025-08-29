'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartIcon from '../../components/CartIcon';

// Child component that uses useSearchParams
function BookSearchParamsInfo() {
  // Dynamically import useSearchParams to avoid SSR issues
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  // Example: get a query param (not used in this code, but you can expand)
  const filter = searchParams.get('filter');
  // Render nothing or some info
  return null;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch('/bookshop/api/books/index.php')
      .then(res => res.json())
      .then(data => data.success ? setBooks(data.books) : setError('Failed to load books.'))
      .catch(() => setError('Network error.'));
  }, []);

  const handleQuantityChange = (bookId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [bookId]: qty }));
  };

  const addToCart = (book) => {
    const quantity = quantities[book.book_id] || 1;
    const currentCart = JSON.parse(localStorage.getItem('sharedCart') || '[]');
    const existingIndex = currentCart.findIndex(item => item.type === 'book' && item.id === book.book_id);

    if (existingIndex !== -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push({
        type: 'book',
        id: book.book_id,
        title: book.title,
        price: parseFloat(book.price),
        quantity
      });
    }

    localStorage.setItem('sharedCart', JSON.stringify(currentCart));
    setQuantities(prev => ({ ...prev, [book.book_id]: 1 }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 relative">
      {/* Top bar with CartIcon, title, and navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/customer/home" className="text-blue-600 hover:underline">🏠 Home</Link>
          <h1 className="text-2xl font-bold text-gray-800">📚 Books</h1>
          <Link href="/customer/stationery" className="text-blue-600 hover:underline">🖊️ Stationery</Link>
        </div>
        <CartIcon />
      </div>

      {/* Suspense boundary for child component using useSearchParams */}
      <Suspense fallback={null}>
        <BookSearchParamsInfo />
      </Suspense>

      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.book_id} className="bg-white p-4 rounded shadow">
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-48 object-cover mb-3 cursor-pointer"
              onClick={() => router.push(`/customer/books/${book.book_id}`)}
            />
            <h2
              className="font-semibold text-lg text-blue-600 cursor-pointer"
              onClick={() => router.push(`/customer/books/${book.book_id}`)}
            >
              {book.title}
            </h2>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="font-bold text-green-600 mt-2">Ksh {parseFloat(book.price).toFixed(2)}</p>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min={1}
                value={quantities[book.book_id] || 1}
                onChange={e => handleQuantityChange(book.book_id, e.target.value)}
                className="w-16 border px-2 py-1 rounded"
              />
              <button
                onClick={() => addToCart(book)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
