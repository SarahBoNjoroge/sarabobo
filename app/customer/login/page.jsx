'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Child component using useSearchParams ---
import { useSearchParams } from 'next/navigation';

function LoginQueryMessage() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');
  if (!msg) return null;
  return (
    <div className="text-green-600 text-sm text-center mb-2">
      {msg}
    </div>
  );
}

// --- Parent component ---
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/customer/login.php`, {
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
          localStorage.removeItem("sharedCart");
          localStorage.removeItem("lastOrderId");

          localStorage.setItem("customerId", data.userId);
          if (data.name) {
            localStorage.setItem("customerName", data.name);
          }

          router.push("/customer/home");
        } else {
          setError(data.message || "Invalid email or password");
        }
      } catch (jsonErr) {
        setError("Server error. Not returning JSON.");
      }
    } catch (err) {
      setError("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1470&q=80')"
        }}
      ></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl text-gray-600 font-bold text-center">Customer Login</h2>

        {/* Suspense boundary for child */}
        <Suspense fallback={null}>
          <LoginQueryMessage />
        </Suspense>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded text-black"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
          <span
            onClick={togglePassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-600 text-xl"
            title={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? "🚫" : "👁"}
          </span>
        </div>

        <div className="text-right">
          <Link href="/customer/forgot" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="text-center">
          <Link href="/customer/register" className="text-blue-600 hover:underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
