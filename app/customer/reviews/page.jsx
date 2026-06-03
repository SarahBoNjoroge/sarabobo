'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = 'https://tender-empathy-production-c8ad.up.railway.app';

export default function ReviewsPage() {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!customerId) { setMessage('Please login to submit a review.'); return; }
    if (!review.trim()) { setMessage('Please write a review.'); return; }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/api/customer/add_review.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, review, rating }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setMessage('✅ Thank you for your review!');
        setReview('');
        setRating(5);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Failed to submit review.');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: '#6b21a8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', textDecoration: 'none' }}>📚 Brightmind Books</Link>
        <Link href="/customer/home" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>← Back to Home</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 58px)', padding: '20px 16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(107,33,168,0.10)', border: '1px solid #ddd6fe', padding: '36px 32px', width: '100%', maxWidth: '520px', boxSizing: 'border-box' }}>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✍️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#6b21a8', margin: '0 0 8px' }}>Leave a Review</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Share your experience with Brightmind Books</p>
          </div>

          {message && (
            <div style={{ background: isSuccess ? '#dcfce7' : '#fee2e2', color: isSuccess ? '#16a34a' : '#dc2626', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 500 }}>
              {message}
            </div>
          )}

          {!customerId ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>You need to be logged in to leave a review.</p>
              <Link href="/customer/login" style={{ background: '#6b21a8', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Login to Review</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Star rating */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '10px' }}>Your Rating</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    style={{ fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s', transform: star <= rating ? 'scale(1.1)' : 'scale(1)' }}>
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
                <span style={{ fontSize: '14px', color: '#6b7280', alignSelf: 'center', marginLeft: '8px' }}>{rating}/5</span>
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c1d95', marginBottom: '6px' }}>Your Review</label>
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                rows={5}
                placeholder="Tell us about your experience..."
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #ddd6fe', fontSize: '14px', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', marginBottom: '20px' }}
              />

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Submitting...' : '⭐ Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}