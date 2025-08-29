'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

// Child component that uses useSearchParams
function CartQueryParams() {
  // Dynamically import useSearchParams to avoid SSR issues
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();

  // Example usage: get a query param (not used in parent, but can be extended)
  const ref = searchParams.get('ref');

  // You can display or use the param as needed
  return ref ? (
    <div className="mb-2 text-xs text-blue-600">Referral: {ref}</div>
  ) : null;
}

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    syncCart();
    const interval = setInterval(syncCart, 500);
    return () => clearInterval(interval);
  }, []);

  const syncCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('sharedCart') || '[]');
      setCart(stored);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      setCart([]);
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const removeItem = (id, type) => {
    const updated = cart.filter(item => !(item.id === id && item.type === type));
    setCart(updated);
    localStorage.setItem('sharedCart', JSON.stringify(updated));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setMessage('❗Cart is empty.');
      return;
    }

    if (!address.trim()) {
      setMessage('❗Please enter a delivery address.');
      return;
    }

    const customer_id = localStorage.getItem('customerId') || 1;

    const payload = {
      customer_id,
      address,
      items: cart.map(item => ({
        type: item.type,
        item_id: item.id,
        title: item.title || item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    };

    try {
      const res = await fetch('/bookshop/api/orders/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);

        if (data.success) {
          localStorage.removeItem('sharedCart'); // ✅ clear only if success
          localStorage.setItem('lastOrderId', data.order_id);
          router.push('/customer/invoice');
        } else {
          setMessage(data.message || '❌ Order failed.');
        }
      } catch (parseError) {
        console.error('Invalid JSON response:', text);
        setMessage('⚠️ Server error: check backend.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setMessage('❌ Network error. Try again.');
    }
  };

  return (
    <div className="p-6 max-w-2xl text-gray-600 mx-auto min-h-screen bg-gray-100">
      <h1 className="text-2xl text-gray-600 font-bold mb-4">🛒 Your Cart</h1>

      {/* Suspense boundary for child component */}
      <Suspense fallback={null}>
        <CartQueryParams />
      </Suspense>

      {cart.length === 0 ? (
        <p className="text-gray-600">No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-2 bg-white p-4 rounded shadow">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-gray-600 text-sm">
                <div>{item.quantity} × {item.title || item.name}</div>
                <div className="flex items-center gap-3">
                  <span>Ksh {(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeItem(item.id, item.type)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4 text-gray-600 font-bold text-lg">
            <span>Total:</span>
            <span>Ksh {total.toFixed(2)}</span>
          </div>

          {/* Delivery address input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your delivery address"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>

          {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </>
      )}
    </div>
  );
}
