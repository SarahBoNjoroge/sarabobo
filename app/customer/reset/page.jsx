'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordFormInner({ token }) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('❌ Token missing.');
      setChecking(false);
      return;
    }

    fetch(`https://tender-empathy-production-c8ad.up.railway.app/api/customer/verify_token.php?token=${token}`)
      .then(res => res.json())
      .then(data => {
        setValid(data.success);
        if (!data.success) setMessage('❌ Invalid or expired token');
      })
      .catch(() => setMessage('❌ Token verification failed'))
      .finally(() => setChecking(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('❌ Passwords do not match');
      return;
    }

    const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/customer/reset_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage('✅ Password updated. Redirecting...');
      setTimeout(() => router.push('/customer/login'), 2000);
    } else {
      setMessage(data.message || '❌ Reset failed');
    }
  };

  if (checking) return <p className="text-center mt-10">⏳ Verifying token...</p>;
  if (!valid) return <p className="text-red-600 text-center mt-10">{message}</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">🔐 Reset Password</h2>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 pr-10 border rounded text-black"
        />
        <span
          className="absolute right-2 top-2 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <div className="relative">
        <input
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-2 pr-10 border rounded text-black"
        />
        <span
          className="absolute right-2 top-2 cursor-pointer text-gray-500"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? '🙈' : '👁️'}
        </span>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded">Reset</button>
      {message && <p className="text-sm text-center text-red-600">{message}</p>}
    </form>
  );
}

// Child component that uses useSearchParams and renders ResetPasswordFormInner
function ResetPasswordFormWithToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  return <ResetPasswordFormInner token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">⏳ Loading reset form...</p>}>
      <ResetPasswordFormWithToken />
    </Suspense>
  );
}
