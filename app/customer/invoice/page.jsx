'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation';

const API = 'https://tender-empathy-production-c8ad.up.railway.app';
const SHOP = {
  name: 'Brightmind Books',
  phone: '+254 700 000 000',
  email: 'info@brightmindbooks.co.ke',
  location: 'Thika, Kenya',
};

function InvoiceSearchParams() {
  const searchParams = useSearchParams();
  return null;
}

export default function InvoicePage() {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState('');
  const invoiceRef = useRef();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('order_id');
    const localId = localStorage.getItem('lastOrderId');
    setOrderId(urlId || localId);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    fetch(`${API}/api/invoice.php?order_id=${orderId}`)
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          if (data.success) { setOrder(data.order); setItems(data.items); }
          else setError(data.message || 'Failed to fetch invoice.');
        } catch { setError('Server returned invalid response'); }
      })
      .catch(() => setError('Network error. Please try again.'));
  }, [orderId]);

  const total = items?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0;

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { backgroundColor: '#ffffff', useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const height = width / (imgProps.width / imgProps.height);
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`invoice_${order?.order_id}.pdf`);
  };

  const handlePayNow = async () => {
    const phone = prompt('Enter M-Pesa number (format: 2547XXXXXXXX)');
    if (!phone) return;
    setPaying(true);
    setPayMsg('');
    try {
      const res = await fetch(`${API}/api/pay.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: total, order_id: order.order_id }),
      });
      const data = await res.json();
      if (data.ResponseCode === '0' || data.success) {
        setPayMsg('📲 STK push sent! Check your phone to complete payment.');
      } else {
        setPayMsg('Payment request sent. Check your phone.');
      }
    } catch {
      setPayMsg('❌ Payment failed. Please try again.');
    }
    setPaying(false);
  };

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '14px', padding: '40px', textAlign: 'center', border: '1px solid #ddd6fe' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <p style={{ color: '#dc2626', fontSize: '16px' }}>{error}</p>
      </div>
    </div>
  );

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <p style={{ color: '#6b21a8', fontSize: '18px' }}>Loading invoice...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ff', fontFamily: "'Segoe UI', sans-serif", padding: '20px 16px' }}>
      <Suspense fallback={null}><InvoiceSearchParams /></Suspense>

      {/* Action buttons */}
      <div style={{ maxWidth: '720px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <a href="/customer/home" style={{ color: '#6b21a8', textDecoration: 'none', fontWeight: 600, fontSize: '14px', padding: '10px 16px', background: '#fff', borderRadius: '8px', border: '1.5px solid #ddd6fe' }}>← Continue Shopping</a>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPDF} style={{ background: '#6b21a8', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>⬇️ Download PDF</button>
          <button onClick={handlePayNow} disabled={paying} style={{ background: '#f59e0b', color: '#1e1b4b', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            {paying ? 'Processing...' : '📱 Pay via M-Pesa'}
          </button>
        </div>
      </div>

      {payMsg && (
        <div style={{ maxWidth: '720px', margin: '0 auto 16px', background: payMsg.includes('❌') ? '#fee2e2' : '#dcfce7', color: payMsg.includes('❌') ? '#dc2626' : '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
          {payMsg}
        </div>
      )}

      {/* Invoice */}
      <div ref={invoiceRef} style={{ maxWidth: '720px', margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(107,33,168,0.10)', border: '1px solid #ddd6fe', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: '#6b21a8', padding: '28px 28px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>📚 {SHOP.name}</div>
            <div style={{ fontSize: '13px', color: '#e9d5ff' }}>Your CBC Learning Partner</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 18px', textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>INVOICE</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fbbf24' }}>#{order.order_id}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{order.order_date}</div>
          </div>
        </div>

        {/* Contact strip */}
        <div style={{ background: '#4c1d95', padding: '10px 28px', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: '#fbbf24', fontWeight: 500 }}>
          <span>📞 {SHOP.phone}</span>
          <span>✉️ {SHOP.email}</span>
          <span>📍 {SHOP.location}</span>
        </div>

        {/* Order info */}
        <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f3f0ff' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Order Details</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e1b4b' }}>Order #{order.order_id}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Date: {order.order_date}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Status</div>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Pending Payment</span>
          </div>
        </div>

        {/* Items table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f3ff' }}>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#4c1d95', textAlign: 'left', borderBottom: '2px solid #ddd6fe' }}>#</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#4c1d95', textAlign: 'left', borderBottom: '2px solid #ddd6fe' }}>Item</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#4c1d95', textAlign: 'center', borderBottom: '2px solid #ddd6fe' }}>Qty</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#4c1d95', textAlign: 'center', borderBottom: '2px solid #ddd6fe' }}>Unit Price</th>
                <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#4c1d95', textAlign: 'right', borderBottom: '2px solid #ddd6fe' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#faf9ff' : '#fff' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #f3f0ff' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e1b4b', fontWeight: 500, borderBottom: '1px solid #f3f0ff' }}>{item.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280', textAlign: 'center', borderBottom: '1px solid #f3f0ff' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280', textAlign: 'center', borderBottom: '1px solid #f3f0ff' }}>KSh {parseFloat(item.price).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b21a8', fontWeight: 700, textAlign: 'right', borderBottom: '1px solid #f3f0ff' }}>KSh {parseFloat(item.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ padding: '20px 28px', background: '#faf9ff', borderTop: '1px solid #ddd6fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '15px', color: '#1e1b4b' }}>
            <span style={{ color: '#6b7280' }}>Subtotal</span>
            <span>KSh {total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', marginTop: '8px', borderTop: '2px solid #ddd6fe' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>TOTAL</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#6b21a8' }}>KSh {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment note */}
        <div style={{ margin: '0 28px 20px', padding: '14px 18px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #f59e0b' }}>
          <div style={{ fontWeight: 700, color: '#6b21a8', marginBottom: '6px' }}>💳 Pay via M-Pesa</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Pay to: <strong style={{ color: '#1e1b4b' }}>{SHOP.phone}</strong> — Use order number <strong>#{order.order_id}</strong> as reference.
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#6b21a8', padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
          Thank you for shopping with {SHOP.name}! 🎉 &nbsp;|&nbsp; {SHOP.phone} &nbsp;|&nbsp; {SHOP.email}
        </div>
      </div>
    </div>
  );
}