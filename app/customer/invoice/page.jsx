'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Child component that uses useSearchParams
import { useSearchParams } from 'next/navigation';

function InvoiceSearchParams() {
  const searchParams = useSearchParams();
  // Example usage: get a param (not used in parent, but for demonstration)
  const someParam = searchParams.get('someParam');
  // You can use this param as needed, or just render nothing if not needed
  return null;
}

export default function InvoicePage() {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const invoiceRef = useRef();

  useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (!orderId) {
      setError('No recent order found.');
      return;
    }

    fetch(`/bookshop/api/invoice.php?order_id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.order);
          setItems(data.items);
        } else {
          setError(data.message || 'Failed to fetch invoice.');
        }
      })
      .catch(() => setError('Network error.'));
  }, []);

  const handleDownloadPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
      allowTaint: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = pageWidth / (imgProps.width / imgProps.height);

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    pdf.save(`invoice_${order.id}.pdf`);
  };

  const handlePayNow = () => {
    alert('Redirecting to payment...');
  };

  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</p>;
  if (!order) return <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>Loading invoice...</p>;

  const total = items.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '2rem 1rem' }}>
      {/* Suspense boundary for child */}
      <Suspense fallback={null}>
        <InvoiceSearchParams />
      </Suspense>
      <div
        ref={invoiceRef}
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
          borderRadius: '0.75rem',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          color: '#111827'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="Compeers Bookshop" style={{ height: '64px', margin: '0 auto 0.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Compeers Bookshop</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Official Invoice</p>
        </div>

        {/* Order Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <div>
            <p><strong>Invoice ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {order.order_date}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Customer ID:</strong> {order.customer_id}</p>
            <p><strong>Total Items:</strong> {items.length}</p>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ color: '#374151', fontWeight: '600' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Item</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.5rem 0', color: '#4b5563' }}>{item.name}</td>
                <td style={{ textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', color: '#4b5563' }}>Ksh {parseFloat(item.price).toFixed(2)}</td>
                <td style={{ textAlign: 'right', color: '#4b5563' }}>Ksh {parseFloat(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.125rem', color: '#111827', marginTop: '1rem' }}>
          Total: Ksh {total.toFixed(2)}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Thank you for shopping at Compeers Bookshop!</p>
          <p>Email: support@compeersbookshop.com | Phone: +254 712 345678</p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
        >
          📥 Download PDF
        </button>
        <button
          onClick={handlePayNow}
          style={{ backgroundColor: '#16a34a', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
        >
          💳 Pay Now
        </button>
      </div>
    </div>
  );
}
