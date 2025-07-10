import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from '../features/cart/cartSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateUserAsync } from '../features/user/userSlice';
import { useState, useEffect, useLayoutEffect } from 'react';
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStatus,
  resetOrder,
} from '../features/order/orderSlice';
import { selectUserInfo } from '../features/user/userSlice';
import { Grid } from 'react-loader-spinner';

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const totalAmount = items.reduce(
    (amount, item) => item.product.discountPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);

  // Reset order state and session token on mount
  useLayoutEffect(() => {
    dispatch(resetOrder());
    setSessionToken(Date.now().toString());
  }, [dispatch]);

  useEffect(() => {
    // Only redirect if the currentOrder has the same sessionToken as this session
    if (
      currentOrder &&
      currentOrder.sessionToken &&
      sessionToken &&
      currentOrder.sessionToken === sessionToken
    ) {
      if (currentOrder.paymentMethod === 'cash') {
        navigate(`/order-success/${currentOrder.id}`);
      }
      if (currentOrder.paymentMethod === 'card') {
        navigate('/razorpay-checkout/');
      }
    }
  }, [currentOrder, navigate, sessionToken]);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOrder = (e) => {
    if (selectedAddress && paymentMethod) {
      const order = {
        items,
        totalAmount,
        totalItems,
        user: user.id,
        paymentMethod,
        selectedAddress,
        status: 'pending',
        sessionToken, // attach session token to order
      };
      dispatch(createOrderAsync(order));
    } else {
      alert('Enter Address and Payment method');
    }
  };

  return (
    <>
      {!items.length && <Navigate to="/" replace={true}></Navigate>}
      {currentOrder && currentOrder.paymentMethod === 'cash' && (
        <Navigate
          to={`/order-success/${currentOrder.id}`}
          replace={true}
        ></Navigate>
      )}
      {currentOrder && currentOrder.paymentMethod === 'card' && null}

      {status === 'loading' ? (
        <Grid
          height="80"
          width="80"
          color="rgb(99,102,241)"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : <div className="bg-background min-h-screen animate-fadeIn">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-5">
            {/* Address & Payment */}
            <div className="lg:col-span-3">
              <form
                className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass px-8 py-10 mt-6 animate-slideUp"
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(
                    updateUserAsync({
                      ...user,
                      addresses: [...user.addresses, data],
                    })
                  );
                  reset();
                })}
              >
                <h2 className="text-2xl font-bold text-primary mb-6">Add New Address</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">Full name</label>
                    <input type="text" {...register('name', { required: 'name is required' })} id="name" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">Email address</label>
                    <input id="email" {...register('email', { required: 'email is required' })} type="email" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1">Phone</label>
                    <input id="phone" {...register('phone', { required: 'phone is required' })} type="tel" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.phone && (<p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="street" className="block text-sm font-semibold text-gray-900 mb-1">Street address</label>
                    <input type="text" {...register('street', { required: 'street is required' })} id="street" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.street && (<p className="text-red-500 text-xs mt-1">{errors.street.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-1">City</label>
                    <input type="text" {...register('city', { required: 'city is required' })} id="city" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.city && (<p className="text-red-500 text-xs mt-1">{errors.city.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-1">State / Province</label>
                    <input type="text" {...register('state', { required: 'state is required' })} id="state" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.state && (<p className="text-red-500 text-xs mt-1">{errors.state.message}</p>)}
                  </div>
                  <div>
                    <label htmlFor="pinCode" className="block text-sm font-semibold text-gray-900 mb-1">ZIP / Postal code</label>
                    <input type="text" {...register('pinCode', { required: 'pinCode is required' })} id="pinCode" className="block w-full rounded-lg border border-muted py-2 px-3 text-gray-900 bg-surface shadow focus:ring-2 focus:ring-primary" />
                    {errors.pinCode && (<p className="text-red-500 text-xs mt-1">{errors.pinCode.message}</p>)}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button type="button" className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors" onClick={() => reset()}>Reset</button>
                  <button type="submit" className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white shadow hover:bg-accent transition-all duration-300 focus:ring-2 focus:ring-accent animate-bounceIn">Add Address</button>
                </div>
              </form>
              {/* Address Selection */}
              <div className="bg-surface rounded-2xl shadow-soft p-6 mt-10 animate-fadeIn">
                <h2 className="text-lg font-bold text-primary mb-4">Choose Address</h2>
                <ul className="space-y-4">
                  {user.addresses.map((address, index) => (
                    <li key={index} className="flex justify-between items-center gap-x-6 px-5 py-4 rounded-xl border-2 border-muted bg-glass/60">
                      <div className="flex gap-x-4 items-center">
                        <input onChange={handleAddress} name="address" type="radio" value={index} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                        <div className="min-w-0 flex-auto">
                          <p className="text-base font-semibold text-gray-900">{address.name}</p>
                          <p className="mt-1 truncate text-xs text-gray-500">{address.street}, {address.city}, {address.state}, {address.pinCode}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm text-gray-900">Phone: {address.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Payment Methods */}
              <div className="bg-surface rounded-2xl shadow-soft p-6 mt-10 animate-fadeIn">
                <h2 className="text-lg font-bold text-primary mb-4">Payment Method</h2>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input id="cash" name="payments" onChange={handlePayment} value="cash" type="radio" checked={paymentMethod === 'cash'} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-base text-gray-900">Cash</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input id="card" onChange={handlePayment} name="payments" checked={paymentMethod === 'card'} value="card" type="radio" className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-base text-gray-900">Card Payment</span>
                  </label>
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass px-8 py-10 mt-6 animate-slideUp">
                <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>
                <ul role="list" className="-my-6 divide-y divide-muted">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6 animate-fadeIn">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-md">
                        <img src={item.product.thumbnail} alt={item.product.title} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
                            <h3 className="truncate">{item.product.title}</h3>
                            <p className="ml-4 text-primary">${item.product.discountPrice}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-2">
                          <div className="text-gray-500 flex items-center gap-2">
                            <span className="text-xs">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 border-t border-muted pt-8">
                  <div className="flex justify-between mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <p>Subtotal</p>
                    <p>${totalAmount}</p>
                  </div>
                  <div className="flex justify-between mb-2 text-base text-gray-700">
                    <p>Total Items</p>
                    <p>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-8">
                    <div
                      onClick={handleOrder}
                      className="w-full block text-center rounded-xl bg-primary text-white font-bold text-lg py-4 shadow-elevated hover:bg-accent transition-all duration-300 animate-bounceIn cursor-pointer"
                    >
                      Place Order
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or
                      <Link to="/">
                        <button
                          type="button"
                          className="font-medium text-primary hover:text-accent transition-colors ml-1"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}

export default Checkout;
