'use client';
import { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost/bookshop/api/admin/customers.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCustomers(data.customers);
      });
  }, []);

  return (
    <div className="p-6 text-black">
      <h2 className="text-xl font-bold mb-4">👥 Customers</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="py-2 px-4 border">{c.id}</td>
              <td className="py-2 px-4 border">{c.username}</td>
              <td className="py-2 px-4 border">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
