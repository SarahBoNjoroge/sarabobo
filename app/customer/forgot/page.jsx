'use client';
import { Suspense } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/bookshop/api/customer/forgot_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Reset link sent to your email.');
      } else {
        setMessage(data.message || '❌ Failed to send reset link.');
      }
    } catch (err) {
      setMessage('❌ Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-700">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
      {message && <p className="text-sm text-gray-800 text-center mt-2">{message}</p>}
    </form>
  );
}

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

function ForgotPasswordWithParams() {
  const searchParams = useSearchParams();
  // You can use searchParams here if needed, e.g.:
  // const ref = searchParams.get('ref');
  return <ForgotPasswordForm />;
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordWithParams />
      </Suspense>
    </div>
  );
}
