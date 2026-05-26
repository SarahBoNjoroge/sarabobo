'use client';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/admin/order_items.php');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (order_id, status) => {
    try {
      const res = await fetch('https://tender-empathy-production-c8ad.up.railway.app/api/admin/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders(); // Refresh list
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (err) {
      alert('Network error');
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return { bg: '#fef3c7', color: '#92400e' };
      case 'PROCESSING': return { bg: '#dbeafe', color: '#1e40af' };
      case 'DELIVERED': return { bg: '#dcfce7', color: '#166534' };
      case 'CANCELLED': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getDeliveryColor = (type) => {
    if (type === 'doorstep') return '#2563eb';
    if (type === 'pickup') return '#16a34a';
    if (type === 'parcel') return '#d97706';
    return '#6b7280';
  };

  const statusButtons = [
    { label: '🕐 Pending', value: 'PENDING' },
    { label: '⚙️ Processing', value: 'PROCESSING' },
    { label: '✅ Delivered', value: 'DELIVERED' },
    { label: '❌ Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => {
          const statusStyle = getStatusStyle(order.status);
          return (
            <div key={order.id} className="mb-6 border p-4 rounded bg-white shadow">

              {/* Header Row */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                <div className="flex gap-2">
                  <span style={{ background: getDeliveryColor(order.delivery_type), color: 'white', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {order.delivery_type || 'N/A'}
                  </span>
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                    {order.status || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <p><strong>Customer ID:</strong> {order.customer_id}</p>
              <p><strong>Date:</strong> {order.order_date}</p>
              <p><strong>Total:</strong> Ksh {parseFloat(order.total_amount).toFixed(2)}</p>

              {/* Delivery Info */}
              <div className="mt-3 p-3 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p className="font-semibold mb-1">🚚 Delivery Details</p>

                {order.delivery_type === 'doorstep' && (
                  <>
                    <p><strong>Method:</strong> Doorstep Delivery</p>
                    {order.latitude && order.longitude ? (
                      <>
                        <p><strong>Location:</strong> {order.latitude}, {order.longitude}</p>
                        <a href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '13px' }}>
                          📍 View on Google Maps
                        </a>
                      </>
                    ) : <p className="text-red-500">No location provided</p>}
                  </>
                )}

                {order.delivery_type === 'pickup' && (
                  <>
                    <p><strong>Method:</strong> Pickup</p>
                    <p><strong>Pickup Point:</strong> {order.pickup_point || 'N/A'}</p>
                  </>
                )}

                {order.delivery_type === 'parcel' && (
                  <>
                    <p><strong>Method:</strong> Parcel</p>
                    <p><strong>Service:</strong> {order.parcel_service || 'N/A'}</p>
                    <p><strong>Receiver Phone:</strong> {order.receiver_phone || 'N/A'}</p>
                  </>
                )}

                {!order.delivery_type && <p className="text-gray-500">No delivery info</p>}
              </div>

              {/* ✅ Status Update Buttons */}
              <div className="mt-4">
                <p className="font-semibold mb-2">Update Status:</p>
                <div className="flex gap-2 flex-wrap">
                  {statusButtons.map(btn => {
                    const isActive = order.status?.toUpperCase() === btn.value;
                    const s = getStatusStyle(btn.value);
                    return (
                      <button
                        key={btn.value}
                        onClick={() => updateStatus(order.id, btn.value)}
                        disabled={isActive}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: isActive ? 'not-allowed' : 'pointer',
                          background: isActive ? s.bg : '#f3f4f6',
                          color: isActive ? s.color : '#374151',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          opacity: isActive ? 1 : 0.7
                        }}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items Table */}
              <h4 className="font-medium mt-4 mb-2">Items:</h4>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Item ID</th>
                    <th className="p-2 border">Title/Name</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{item.type}</td>
                      <td className="p-2 border">{item.item_id}</td>
                      <td className="p-2 border">{item.title || 'N/A'}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">Ksh {parseFloat(item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          );
        })
      )}
    </div>
  );
}