import React from "react";
import { useSelector } from 'react-redux';
import { selectCurrentOrder } from "../features/order/orderSlice";
import { useNavigate } from "react-router-dom";

const RazorpayCheckout = () => {
  const currentOrder = useSelector(selectCurrentOrder);
  const navigate = useNavigate();

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 1. Create order on backend
    const orderRes = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: currentOrder.totalAmount,
        currency: 'INR',
        receipt: `order_rcptid_${currentOrder.id}`
      })
    });
    const orderData = await orderRes.json();

    const options = {
      key: "rzp_live_o8x6BBkYMipWDF",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Anything",
      description: `Order #${currentOrder.id}`,
      order_id: orderData.id,
      handler: async function (response) {
        // 2. Verify payment on backend
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        const verifyData = await verifyRes.json();
        if (verifyData.status === 'success') {
          navigate(`/order-success/${currentOrder.id}`);
        } else {
          alert('Payment verification failed!');
        }
      },
      prefill: {
        email: currentOrder?.user?.email || "",
        contact: "",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <button onClick={handlePayment} style={{ background: '#6366f1', color: '#fff', padding: '1rem 2rem', border: 'none', borderRadius: '4px', fontSize: '1.2rem', cursor: 'pointer' }}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default RazorpayCheckout;