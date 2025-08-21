'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function StationeryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost/bookshop/api/stationery/show.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setItem(data.item);
        } else {
          setError('Item not found.');
        }
      })
      .catch(() => setError('Network error.'));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('sharedCart')) || [];
    const index = cart.findIndex(i => i.type === 'stationery' && i.id === item.id);

    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        type: 'stationery',
        id: item.id,
        title: item.name,
        price: parseFloat(item.price),
        quantity
      });
    }

    localStorage.setItem('sharedCart', JSON.stringify(cart));
    alert('Item added to cart');
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!item) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow mt-8">
      <button onClick={() => router.back()} className="text-blue-600 underline mb-4">← Back</button>
      <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-2xl text-gray-600 font-bold mb-2">{item.name}</h1>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <p className="font-bold text-green-600 text-lg mb-2">Ksh {parseFloat(item.price).toFixed(2)}</p>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 border px-2 py-1 rounded"
        />
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
