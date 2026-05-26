'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginQueryMessage() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');
  if (!msg) return null;
  return <div className="text-green-600 text-sm text-center mb-2">{msg}</div>;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone || !form.password) {
      setError('Phone number and password are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://tender-empathy-production-c8ad.up.railway.app/api/customer/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);

        if (data.success) {
          localStorage.removeItem("customerId");
          localStorage.removeItem("customerName");
          localStorage.removeItem("customerPhone");
          localStorage.removeItem("sharedCart");
          localStorage.removeItem("lastOrderId");

          localStorage.setItem("customerId", data.userId);
          localStorage.setItem("customerName", data.username || data.name || '');
          localStorage.setItem("customerPhone", data.phone || form.phone);

          router.push("/customer/home");
        } else {
          setError(data.message || "Invalid phone number or password");
        }
      } catch {
        setError("Server error. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1470&q=80')" }}
      ></div>

      <form onSubmit={handleSubmit} className="z-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
        <h2 className="text-2xl text-gray-600 font-bold text-center">Customer Login</h2>

        <Suspense fallback={null}>
          <LoginQueryMessage />
        </Suspense>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <input
            type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="07XXXXXXXX"
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600 text-xl">
              {showPassword ? "🚫" : "👁"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <Link href="/customer/forgot" className="text-blue-500 text-sm hover:underline">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="text-center">
          <Link href="/customer/register" className="text-blue-600 hover:underline">Don't have an account? Sign Up</Link>
        </div>
      </form>
    </div>
  );
}