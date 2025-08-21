'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const cart = JSON.parse(localStorage.getItem('sharedCart') || '[]');
      setCount(cart.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/customer/cart">
      <div className="relative">
        <span className="text-white text-2xl">🛒</span>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}
