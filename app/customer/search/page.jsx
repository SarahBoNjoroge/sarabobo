'use client';
import { Suspense } from 'react';

function SearchResultsContent() {
  const { useSearchParams } = require('next/navigation');
  const { useEffect, useState } = require('react');
  const Link = require('next/link').default;

  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1/bookshop/api/search.php?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-red-600">No results found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {results.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <img
                src={`http://127.0.0.1/bookshop/uploads/${item.image}`}
                alt={item.title}
                className="h-40 w-full object-cover mb-3 rounded"
              />
              <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
              {item.author && <p className="text-sm text-gray-600">By {item.author}</p>}
              <p className="text-sm text-green-700 font-medium">Ksh {item.price}</p>
              <Link
                href={`/customer/${item.type === 'book' ? 'books' : 'stationery'}/${item.id}`}
                className="block mt-3 text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
