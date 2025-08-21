'use client';
import { useEffect, useState, Suspense } from 'react';

// Child component that uses useSearchParams
function ReviewQueryInfo() {
  // Dynamically import useSearchParams to avoid SSR issues
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const queryReview = searchParams.get('review');
  const queryRating = searchParams.get('rating');

  return (
    <div className="mb-4 text-sm text-gray-600">
      {queryReview && (
        <div>
          <strong>Prefilled Review:</strong> {queryReview}
        </div>
      )}
      {queryRating && (
        <div>
          <strong>Prefilled Rating:</strong> {queryRating}
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('customerId');
    if (!id) {
      setMessage('⚠️ Please log in to submit a review.');
    } else {
      setCustomerId(id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!customerId || !review.trim()) {
      setMessage('❌ Review cannot be empty.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1/bookshop/api/customer/add_review.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, review, rating }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Review submitted!');
        setReview('');
        setRating(5);
      } else {
        setMessage(data.message || '❌ Failed to submit review');
      }
    } catch (err) {
      setMessage('⚠️ Network error. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(to right, #f0f4ff, #e4e7ff)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          ✍️ Leave a Review
        </h1>

        {/* Suspense boundary for child component */}
        <Suspense fallback={null}>
          <ReviewQueryInfo />
        </Suspense>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          placeholder="Write your honest feedback..."
          className="w-full border border-gray-300 p-4 rounded mb-4 resize-none text-gray-700"
          required
        />

        <div className="flex items-center gap-2 mb-6">
          <label className="text-gray-700 font-medium">Your Rating:</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= rating}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg transition duration-200"
        >
          Submit Review
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

// ⭐ Star rating component
function Star({ filled, onClick }) {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer text-3xl transition duration-150 ${
        filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
      }`}
    >
      ★
    </span>
  );
}
