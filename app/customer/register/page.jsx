'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function RegisterQueryMessage() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  if (!ref) return null;
  return (
    <div className="bg-blue-100 text-blue-700 px-4 py-2 mb-4 rounded">
      You were referred by: <span className="font-semibold">{ref}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim())
      newErrors.full_name = 'Full name is required';

    if (!formData.username.trim())
      newErrors.username = 'Username is required';
    else if (formData.username.length < 3)
      newErrors.username = 'Username must be at least 3 characters';

    if (!formData.phone.trim())
      newErrors.phone = 'Phone number is required';
    else if (!/^(07|01)\d{8}$/.test(formData.phone))
      newErrors.phone = 'Use format 07XXXXXXXX or 01XXXXXXXX';

    if (!formData.email.trim())
      newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address';

    if (!formData.password.trim())
      newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("https://tender-empathy-production-c8ad.up.railway.app/api/customer/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("customerId");
        localStorage.removeItem("customerName");
        localStorage.removeItem("customerPhone");
        localStorage.removeItem("sharedCart");
        localStorage.removeItem("lastOrderId");

        localStorage.setItem("customerId", data.userId);
        localStorage.setItem("customerName", data.username || formData.username);
        localStorage.setItem("customerPhone", data.phone || formData.phone);

        setSuccess(true);
        setFormData({ full_name: '', username: '', phone: '', email: '', password: '' });

        setTimeout(() => router.push('/customer/home'), 2000);
      } else {
        setErrors({ general: data.message || "Registration failed" });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-6"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1470&q=80')` }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-8 w-full max-w-md z-10">
        <Suspense fallback={null}>
          <RegisterQueryMessage />
        </Suspense>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-6">Redirecting you to your dashboard...</p>
            <button onClick={() => router.push('/customer/home')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Account</h2>

            {errors.general && (
              <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="text-gray-600 space-y-4">

              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded ${errors.full_name ? 'border-red-400' : 'border-gray-300'}`}
                  disabled={loading} placeholder="Your full name"
                />
                {errors.full_name && <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>}
              </div>

              {/* Username */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text" name="username" value={formData.username} onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
                  disabled={loading} placeholder="Choose a username"
                />
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                  disabled={loading} placeholder="07XXXXXXXX"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                  disabled={loading} placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                    className={`w-full border px-4 py-2 rounded pr-10 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                    disabled={loading} placeholder="At least 6 characters"
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600 text-xl">
                    {showPassword ? "🚫" : "👁"}
                  </span>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <Link href="/customer/login" className="text-emerald-600 hover:underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}