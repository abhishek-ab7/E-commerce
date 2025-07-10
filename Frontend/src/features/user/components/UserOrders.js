import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchLoggedInUserOrderAsync,
  selectUserInfo,
  selectUserInfoStatus,
  selectUserOrders,
} from '../userSlice';
import { Grid } from 'react-loader-spinner';

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserInfoStatus);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrderAsync());
  }, [dispatch]);

  return (
    <div className="bg-background min-h-screen flex flex-col items-center animate-fadeIn">
      <div className="w-full max-w-4xl mt-12 space-y-8">
        {orders && orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-8 animate-slideUp">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h1 className="text-2xl font-extrabold text-primary">Order #{order.id}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className={
                  `inline-block px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`
                }>
                  {order.status}
                </span>
                <span className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm">{order.paymentStatus}</span>
              </div>
            </div>
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="flex py-6 animate-fadeIn">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 shadow-soft">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.title}</h3>
                        <p className="ml-4 text-primary font-bold">
  ${Math.round(item.product.price * (1 - item.product.discountPercentage / 100))}
</p>

                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="text-gray-500">
                          <span className="inline mr-5 text-sm font-medium leading-6 text-gray-900">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <div className="text-base font-medium text-gray-900">Subtotal: <span className="font-bold text-primary">₹{order.totalAmount}</span></div>
                <div className="text-base font-medium text-gray-900">Total Items: <span className="font-bold text-primary">{order.totalItems}</span></div>
              </div>
              <div className="bg-white/80 dark:bg-dark/80 rounded-xl shadow-soft p-4">
                <div className="text-sm text-gray-500 mb-2">Shipping Address:</div>
                <div className="font-semibold text-gray-900">{order.selectedAddress.name}</div>
                <div className="text-gray-600 text-xs">{order.selectedAddress.street}, {order.selectedAddress.city}, {order.selectedAddress.state} - {order.selectedAddress.pinCode}</div>
                <div className="text-gray-500 text-xs">Phone: {order.selectedAddress.phone}</div>
              </div>
            </div>
          </div>
        )) : <div className="text-gray-500 text-center">No orders found.</div>}
        {status === 'loading' ? (
          <div className="flex justify-center items-center py-12">
            <Grid
              height="80"
              width="80"
              color="rgb(79, 70, 229) "
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
