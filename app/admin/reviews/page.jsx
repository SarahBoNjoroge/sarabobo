'use client';
import { useEffect, useState } from 'react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://process.env.server/bookshop/api/admin/fetch_reviews.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.reviews);
        else setError('Failed to load reviews.');
      })
      .catch(() => setError('Network error.'));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">📋 Customer Reviews</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="max-w-4xl mx-auto space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-4 shadow rounded">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-blue-800">{review.username}</span>
              <span className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleString()}</span>
            </div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <p className="text-gray-700">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
