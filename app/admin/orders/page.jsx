'use client';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://process.env.server/bookshop/api/admin/order_items.php');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="mb-6 border p-4 rounded bg-white shadow">
            <h3 className="font-semibold text-lg mb-2">Order #{order.id}</h3>
            <p><strong>Customer ID:</strong> {order.customer_id}</p>
            <p><strong>Date:</strong> {order.order_date}</p>
            <p><strong>Total Amount:</strong> Ksh {parseFloat(order.total_amount).toFixed(2)}</p>

            <h4 className="font-medium mt-4">Items:</h4>
            <table className="w-full mt-2 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Item ID</th>
                  <th className="p-2 border">Title/Name</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 border">{item.type}</td>
                    <td className="p-2 border">{item.item_id}</td>
                    <td className="p-2 border">{item.title || item.name || 'N/A'}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">Ksh {parseFloat(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
