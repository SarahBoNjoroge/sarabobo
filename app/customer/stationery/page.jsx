'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import CartIcon from '../../components/CartIcon';

// Child component that uses useSearchParams
function StationerySearchParams() {
  // Import here to avoid "use client" issues
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();

  // Example usage: get a query param (customize as needed)
  const filter = searchParams.get('filter');

  // Render nothing or something based on your needs
  return filter ? (
    <div className="mb-4 text-center text-sm text-gray-600">
      Filter: <span className="font-semibold">{filter}</span>
    </div>
  ) : null;
}

export default function StationeryPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch('http://localhost/bookshop/api/stationery/index.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data.items);
        else setError('Failed to load stationery.');
      })
      .catch(() => setError('Network error.'));
  }, []);

  const getCart = () => JSON.parse(localStorage.getItem('sharedCart') || '[]');

  const saveCart = (cart) => {
    localStorage.setItem('sharedCart', JSON.stringify(cart));
  };

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: qty }));
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const cart = getCart();

    const existing = cart.find(i => i.type === 'stationery' && i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        type: 'stationery',
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity
      });
    }

    saveCart(cart);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    alert('Added to cart');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1590080876570-5984c1a011ab?auto=format&fit=crop&w=1470&q=80')",
        backgroundBlendMode: 'lighten',
        backgroundColor: 'rgba(32, 15, 15, 0.17)'
      }}
    >
      {/* Cart Icon */}
      <div className="absolute top-4 right-4 z-20">
        <CartIcon />
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => router.push('/customer')}
          className="text-purple-800 font-semibold hover:underline"
        >
          🏠 Home
        </button>
        <button
          onClick={() => router.push('/customer/dashboard')}
          className="text-purple-800 font-semibold hover:underline"
        >
          📚 Books
        </button>
      </div>

      {/* Suspense boundary for search params */}
      <Suspense fallback={null}>
        <StationerySearchParams />
      </Suspense>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🖋️ Stationery</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover mb-3 cursor-pointer"
              onClick={() => router.push(`/customer/stationery/${item.id}`)}
            />
            <h2
              className="font-semibold text-lg cursor-pointer text-blue-600 hover:underline"
              onClick={() => router.push(`/customer/stationery/${item.id}`)}
            >
              {item.name}
            </h2>
            <p className="font-bold text-green-600 mt-2">
              Ksh {parseFloat(item.price).toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min={1}
                value={quantities[item.id] || 1}
                onChange={e => handleQuantityChange(item.id, e.target.value)}
                className="w-16 border px-2 py-1 rounded"
              />
              <button
                onClick={() => addToCart(item)}
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
