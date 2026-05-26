'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation';

function InvoiceSearchParams() {
  const searchParams = useSearchParams();
  const someParam = searchParams.get('someParam');
  return null;
}

export default function InvoicePage() {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const invoiceRef = useRef();

  // ✅ SAFE ORDER ID (URL + localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('order_id');
    const localId = localStorage.getItem('lastOrderId');

    setOrderId(urlId || localId);
  }, []);

  // ✅ FETCH INVOICE
  useEffect(() => {
    if (!orderId) return;

    fetch(`http://localhost/bookshop/api/invoice.php?order_id=${orderId}`)
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);

          if (data.success) {
            setOrder(data.order);
            setItems(data.items);
          } else {
            setError(data.message || 'Failed to fetch invoice.');
          }
        } catch (e) {
          console.log("RAW RESPONSE:", text);
          setError("Server returned invalid JSON");
        }
      })
      .catch(() => setError('Network error.'));
  }, [orderId]);

  // ✅ TOTAL
  const total = items?.reduce((sum, item) => {
    return sum + parseFloat(item.total || 0);
  }, 0) || 0;

  // ✅ PDF DOWNLOAD
  const handleDownloadPDF = async () => {
    const input = invoiceRef.current;

    const canvas = await html2canvas(input, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const width = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const height = width / (imgProps.width / imgProps.height);

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`invoice_${order?.order_id}.pdf`);
  };

  // ✅ FIXED PAYMENT FUNCTION
  const handlePayNow = async () => {
    try {
      const phone = prompt("Enter M-Pesa number (2547XXXXXXXX)");
      if (!phone) return;

      const res = await fetch("http://localhost/bookshop/api/pay.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          amount: total,
          order_id: order.order_id
        })
      });

      const text = await res.text();   // 👈 SAFE
      console.log("RAW:", text);

      const data = JSON.parse(text);

      alert("📲 Check your phone");

    } catch (err) {
      console.error(err);
      alert("❌ Payment failed - check backend");
    }
  };

  const deliveryFee = (() => {
    if (!order?.delivery_type) return 0;

    if (order.delivery_type === "doorstep") return 150;
    if (order.delivery_type === "pickup") return 50;
    if (order.delivery_type === "parcel") return 100;

    return 0;
  })();

  // ❌ ERROR STATE
  if (error) {
    return (
      <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>
        {error}
      </p>
    );
  }

  // ⏳ LOADING
  if (!order) {
    return (
      <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
        Loading invoice...
      </p>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '2rem 1rem' }}>

      <Suspense fallback={null}>
        <InvoiceSearchParams />
      </Suspense>

      {/* INVOICE */}
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
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/Brightmind books.png" style={{ height: '64px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Brightmind Books
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Official Invoice
          </p>
        </div>

        {/* ORDER INFO */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p><strong>Invoice ID:</strong> {order.order_id}</p>
            <p><strong>Date:</strong> {order.order_date}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Customer ID:</strong> {order.customer_id}</p>
            <p><strong>Total Items:</strong> {items.length}</p>
          </div>
        </div>

        {/* TABLE */}
        <table style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th align="left">Item</th>
              <th>Qty</th>
              <th align="right">Price</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td align="center">{item.quantity}</td>
                <td align="right">Ksh {item.price}</td>
                <td align="right">Ksh {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL */}
        <h3 style={{ textAlign: 'right', marginTop: '1rem' }}>
          Total: Ksh {total.toFixed(2)}
        </h3>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p>Thank you for shopping with us!</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '10px',
            borderRadius: '6px',
            border: 'none'
          }}
        >
          Download PDF
        </button>

        <button
          onClick={handlePayNow}
          style={{
            background: '#16a34a',
            color: '#fff',
            padding: '10px',
            borderRadius: '6px',
            border: 'none'
          }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}