// /app/customer/books/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookDetails() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost/bookshop/api/books/show.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBook(data.book);
        } else {
          setError('Book not found.');
        }
      })
      .catch(() => setError('Network error.'));
  }, [id]);

  const addToCart = () => {
    if (!book) return;

    const cart = JSON.parse(localStorage.getItem('sharedCart')) || [];
    const index = cart.findIndex(item => item.type === 'book' && item.id === book.book_id);

    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        type: 'book',
        id: book.book_id,
        title: book.title,
        price: parseFloat(book.price),
        quantity
      });
    }

    localStorage.setItem('sharedCart', JSON.stringify(cart));
    alert('Book added to cart');
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow mt-8">
      <button onClick={() => router.back()} className="text-blue-600 underline mb-4">← Back</button>
      <img src={book.cover_image} alt={book.title} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-2xl text-gray-600 font-bold mb-2">{book.title}</h1>
      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
      <p className="text-gray-600 mb-4">{book.description}</p>
      <p className="font-bold text-green-600 text-lg mb-2">Ksh {parseFloat(book.price).toFixed(2)}</p>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 border px-2 py-1 rounded"
        />
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

