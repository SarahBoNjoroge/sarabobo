"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const purple = '#6b21a8';
const darkPurple = '#4c1d95';
const yellow = '#f59e0b';

export default function CheckoutPage() {
    const router = useRouter();
    const [deliveryType, setDeliveryType] = useState("");
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [pickup, setPickup] = useState("");
    const [parcel, setParcel] = useState("");
    const [receiver, setReceiver] = useState("");
    const [cart, setCart] = useState([]);
    const [locStatus, setLocStatus] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;

        // ✅ CHECK LOGIN — redirect if not logged in
        const customerId = localStorage.getItem("customerId");
        if (!customerId) {
            router.push("/customer/login?msg=Please login to checkout");
            return;
        }

        const stored = JSON.parse(localStorage.getItem("sharedCart") || "[]");
        setCart(stored);
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const getLocation = () => {
        setLocStatus("Getting your location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() });
                setLocStatus("✅ Location captured!");
            },
            () => { setLocStatus("❌ Location access denied. Please allow location."); }
        );
    };

    const placeOrder = async () => {
        if (!deliveryType) { alert("Please select a delivery method."); return; }
        if (deliveryType === "doorstep" && (!location.lat || !location.lng)) { alert("Please click 'Use My Location'."); return; }
        if (deliveryType === "pickup" && !pickup) { alert("Please select a pickup point."); return; }
        if (deliveryType === "parcel" && (!parcel || !receiver)) { alert("Please fill in parcel service and receiver phone."); return; }
        if (cart.length === 0) { alert("Your cart is empty."); return; }

        const customer_id = localStorage.getItem("customerId");
        const payload = {
            customer_id,
            total_price: total,
            delivery_type: deliveryType,
            latitude: location.lat || null,
            longitude: location.lng || null,
            pickup_point: pickup || null,
            parcel_service: parcel || null,
            receiver_phone: receiver || null,
            items: cart.map(item => ({ type: item.type, id: item.id, quantity: item.quantity, price: item.price }))
        };

        try {
            const res = await fetch("https://tender-empathy-production-c8ad.up.railway.app/api/orders/add.php", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                // ✅ Only clear cart on successful order
                localStorage.removeItem("sharedCart");
                localStorage.setItem("lastOrderId", data.order_id);
                window.location.href = `/customer/invoice?order_id=${data.order_id}`;
            } else {
                alert("Order failed: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            alert("Network error. Please try again.");
        }
    };

    const labelStyle = { fontWeight: "700", color: "#000000", display: 'block', marginBottom: 6 };
    const selectStyle = { width: "100%", padding: "10px", marginTop: "6px", marginBottom: "16px", borderRadius: "8px", border: `1.5px solid ${purple}`, color: "#000000", fontWeight: "600", fontSize: 14 };
    const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: `1.5px solid ${purple}`, color: "#000000", fontWeight: "600", fontSize: 14 };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "sans-serif" }}>

            {/* Top bar */}
            <div style={{ background: darkPurple, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={() => router.push('/customer/cart')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                    ← Back to Cart
                </button>
                <span style={{ color: yellow, fontWeight: 700, fontSize: 16 }}>📦 Checkout</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "30px 16px" }}>
                <div style={{ width: "100%", maxWidth: "520px", background: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(107,33,168,0.12)" }}>

                    <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: darkPurple }}>
                        Confirm Your Order
                    </h2>

                    {/* Cart Summary */}
                    <div style={{ background: "#f5f3ff", borderRadius: "8px", padding: "14px", marginBottom: "20px", border: `1px solid #ede9fe` }}>
                        <p style={{ fontWeight: "700", marginBottom: "10px", color: "#000000", fontSize: 15 }}>🛒 Order Summary</p>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#000000", fontWeight: 600, marginBottom: "6px" }}>
                                <span>{item.quantity} × {item.title || item.name}</span>
                                <span>Ksh {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: `1px solid #ddd6fe`, marginTop: "10px", paddingTop: "10px", fontWeight: "bold", display: "flex", justifyContent: "space-between", color: "#000000", fontSize: 15 }}>
                            <span>Total</span>
                            <span>Ksh {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Delivery Method */}
                    <label style={labelStyle}>Delivery Method</label>
                    <select onChange={(e) => setDeliveryType(e.target.value)} style={selectStyle}>
                        <option value="">Select Delivery Method</option>
                        <option value="doorstep">Doorstep</option>
                        <option value="pickup">Pickup</option>
                        <option value="parcel">Parcel</option>
                    </select>

                    {/* Doorstep */}
                    {deliveryType === "doorstep" && (
                        <div style={{ marginBottom: "16px" }}>
                            <button
                                onClick={getLocation}
                                style={{ width: "100%", padding: "10px", background: purple, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: 14 }}
                            >
                                📍 Use My Location
                            </button>
                            {locStatus && (
                                <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: 600, color: locStatus.includes("✅") ? "#16a34a" : "#dc2626" }}>
                                    {locStatus}
                                </p>
                            )}
                            {location.lat && (
                                <p style={{ fontSize: "12px", color: "#000000", fontWeight: 600, marginTop: "4px" }}>
                                    📌 {location.lat}, {location.lng}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Pickup */}
                    {deliveryType === "pickup" && (
                        <>
                            <label style={labelStyle}>Pickup Point</label>
                            <select onChange={(e) => setPickup(e.target.value)} style={selectStyle}>
                                <option value="">Select Pickup Point</option>
                                <option value="Thika Town">Thika Town</option>
                                <option value="Juja">Juja</option>
                            </select>
                        </>
                    )}

                    {/* Parcel */}
                    {deliveryType === "parcel" && (
                        <div style={{ marginBottom: "16px" }}>
                            <input placeholder="Parcel Service (e.g. G4S, Fargo)" onChange={(e) => setParcel(e.target.value)} style={inputStyle} />
                            <input placeholder="Receiver Phone (e.g. 0712345678)" onChange={(e) => setReceiver(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                        </div>
                    )}

                    {/* Confirm Button */}
                    <button
                        onClick={placeOrder}
                        style={{ width: "100%", padding: "13px", backgroundColor: yellow, color: "#000000", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}