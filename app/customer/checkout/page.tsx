"use client";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
    const [deliveryType, setDeliveryType] = useState("");
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [pickup, setPickup] = useState("");
    const [parcel, setParcel] = useState("");
    const [receiver, setReceiver] = useState("");
    const [cart, setCart] = useState([]);
    const [locStatus, setLocStatus] = useState("");

    // ✅ Load from sharedCart (same key cart page uses)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = JSON.parse(localStorage.getItem("sharedCart") || "[]");
            setCart(stored);
        }
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ Get live GPS location
    const getLocation = () => {
        setLocStatus("Getting your location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude.toString(),
                    lng: pos.coords.longitude.toString(),
                });
                setLocStatus("✅ Location captured!");
            },
            () => {
                setLocStatus("❌ Location access denied. Please allow location.");
            }
        );
    };

    // ✅ Place order
    const placeOrder = async () => {
        // Validate delivery selection
        if (!deliveryType) {
            alert("Please select a delivery method.");
            return;
        }
        if (deliveryType === "doorstep" && (!location.lat || !location.lng)) {
            alert("Please click 'Use My Location' to share your delivery location.");
            return;
        }
        if (deliveryType === "pickup" && !pickup) {
            alert("Please select a pickup point.");
            return;
        }
        if (deliveryType === "parcel" && (!parcel || !receiver)) {
            alert("Please fill in parcel service and receiver phone.");
            return;
        }
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const customer_id = typeof window !== "undefined"
            ? localStorage.getItem("customerId")
            : null;

        const payload = {
            customer_id,
            total_price: total,
            delivery_type: deliveryType,
            latitude: location.lat || null,
            longitude: location.lng || null,
            pickup_point: pickup || null,
            parcel_service: parcel || null,
            receiver_phone: receiver || null,
            items: cart.map(item => ({
                type: item.type,
                id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const res = await fetch("http://localhost/bookshop/api/orders/add.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                // ✅ ONLY clear cart after successful order
                localStorage.removeItem("sharedCart");
                localStorage.setItem("lastOrderId", data.order_id);
                window.location.href = `/customer/invoice?order_id=${data.order_id}`;
            } else {
                alert("Order failed: " + (data.message || "Unknown error"));
                console.error(data);
            }
        } catch (err) {
            alert("Network error. Please try again.");
            console.error(err);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f3f4f6",
            display: "flex",
            justifyContent: "center",
            padding: "40px 16px",
            fontFamily: "Arial"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "500px",
                background: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>

                <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "#111827" }}>
                    📦 Checkout
                </h2>

                {/* Cart Summary */}
                <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
                    <p style={{ fontWeight: "700", marginBottom: "8px", color: "#000" }}>🛒 Order Summary</p>
                    {cart.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#374151", marginBottom: "4px" }}>
                            <span>{item.quantity} × {item.title || item.name}</span>
                            <span>Ksh {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid #d1d5db", marginTop: "8px", paddingTop: "8px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                        <span>Total</span>
                        <span>Ksh {total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Delivery Method */}
                <label style={{ fontWeight: "700", color: "#000" }}>Delivery Method</label>
                <select
                    onChange={(e) => setDeliveryType(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #000", color: "#000", fontWeight: "600" }}
                >
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
                            style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                        >
                            📍 Use My Location
                        </button>
                        {locStatus && (
                            <p style={{ marginTop: "8px", fontSize: "13px", color: locStatus.includes("✅") ? "green" : "red" }}>
                                {locStatus}
                            </p>
                        )}
                        {location.lat && (
                            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                                📌 {location.lat}, {location.lng}
                            </p>
                        )}
                    </div>
                )}

                {/* Pickup */}
                {deliveryType === "pickup" && (
                    <>
                        <label style={{ fontWeight: "700", color: "#000" }}>Pickup Point</label>
                        <select
                            onChange={(e) => setPickup(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #000", color: "#000", fontWeight: "600" }}
                        >
                            <option value="">Select Pickup Point</option>
                            <option value="Thika Town">Thika Town</option>
                            <option value="Juja">Juja</option>
                        </select>
                    </>
                )}

                {/* Parcel */}
                {deliveryType === "parcel" && (
                    <div style={{ marginBottom: "16px" }}>
                        <input
                            placeholder="Parcel Service (e.g. G4S, Fargo)"
                            onChange={(e) => setParcel(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #000", color: "#000", fontWeight: "600" }}
                        />
                        <input
                            placeholder="Receiver Phone (e.g. 0712345678)"
                            onChange={(e) => setReceiver(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #000", color: "#000", fontWeight: "600" }}
                        />
                    </div>
                )}

                {/* Confirm Button */}
                <button
                    onClick={placeOrder}
                    style={{ width: "100%", padding: "12px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
                >
                    ✅ Confirm Order
                </button>

            </div>
        </div>
    );
}