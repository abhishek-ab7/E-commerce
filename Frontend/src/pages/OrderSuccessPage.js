import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetCartAsync } from '../features/cart/cartSlice';

function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/orders/${id}`);
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        setOrder(data);
        dispatch(resetCartAsync());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-fadeIn">
      <div className="text-xl text-primary font-bold animate-pulse">Loading order details...</div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-fadeIn">
      <div className="text-xl text-red-600 font-bold">Error: {error}</div>
    </div>
  );
  if (!order) return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-fadeIn">
      <div className="text-xl text-gray-700 font-bold">No order found.</div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Navbar with logo */}
      <nav className="flex items-center px-8 py-4 bg-glass/80 backdrop-blur-md shadow-glass sticky top-0 z-50 animate-fadeIn">
        <Link to="/" className="flex items-center gap-3 text-decoration-none">
          <img src="/logo.svg" alt="Logo" className="h-10 w-10 drop-shadow-lg" />
          <span className="text-2xl font-extrabold tracking-tight text-primary">Anything</span>
        </Link>
      </nav>
      <div className="flex flex-1 items-center justify-center py-12 px-4 animate-slideUp">
        <div className="w-full max-w-xl bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-10 flex flex-col items-center text-center animate-fadeIn">
          {/* Animated checkmark */}
          <div className="mb-6 animate-bounceIn">
            <svg className="h-16 w-16 mx-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#22C55E" fillOpacity="0.15" />
              <path d="M16 24l7 7 9-13" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-primary mb-2 animate-fadeIn">Order Successful!</h1>
          <p className="text-lg text-gray-700 mb-6 animate-fadeIn">Thank you for your purchase. Your order has been placed successfully.</p>
          <div className="flex flex-col gap-2 w-full items-center mb-6 animate-fadeIn">
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm">Order ID: {order.id}</span>
              <span className={
                `inline-block px-4 py-1 rounded-full text-sm font-semibold ${order.paymentStatus === 'received' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`
              }>
                Payment: {order.paymentStatus}
              </span>
              <span className={
                `inline-block px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`
              }>
                Status: {order.status}
              </span>
            </div>
          </div>
          <div className="w-full bg-white/80 dark:bg-dark/80 rounded-xl shadow-soft p-6 mb-6 animate-slideUp">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            <ul className="text-left space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{item.product?.title || item.title} <span className="text-gray-500">x {item.quantity}</span></span>
                  <span className="font-semibold text-primary"> ₹{item.product?.discountPrice || item.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-extrabold text-primary"> ₹{order.totalAmount}</span>
            </div>
          </div>
          <Link to="/" className="w-full">
            <button className="w-full px-8 py-3 bg-primary text-white font-semibold rounded-xl shadow-elevated hover:bg-accent transition-colors duration-300 animate-bounceIn mt-2">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
