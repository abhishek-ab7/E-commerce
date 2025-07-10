import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectCartStatus,
  selectItems,
  updateCartAsync,
} from './cartSlice';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Grid } from 'react-loader-spinner';
import Modal from '../common/Modal';

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(selectItems);
  const status = useSelector(selectCartStatus);
  const cartLoaded = useSelector(selectCartLoaded)
  const [openModal, setOpenModal] = useState(null);

  const totalAmount = items.reduce(
    (amount, item) =>
      item.product && item.product.discountPrice
        ? item.product.discountPrice * item.quantity + amount
        : amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({id:item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  return (
    <>
      {!items.length && cartLoaded && (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center animate-fadeIn">
          <div className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-10 mt-12 animate-slideUp text-center">
            <h1 className="text-4xl mb-4 font-extrabold tracking-tight text-primary">Your Cart</h1>
            <p className="text-lg text-gray-700 mb-6">Your cart is empty.</p>
            <Link to="/">
              <button
                type="button"
                className="rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-white shadow-elevated hover:bg-accent transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-background min-h-screen animate-fadeIn">
        <div className="mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-8 animate-slideUp">
            <h1 className="text-4xl mb-8 font-extrabold tracking-tight text-primary">Your Cart</h1>
            <div className="flow-root">
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
              ) : null}
              <ul className="-my-6 divide-y divide-muted">
                {items.map((item, idx) => (
                  <li key={item.id} className="flex py-6 animate-fadeIn">
                    {item.product ? (
                      <>
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-md">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <div className="ml-6 flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
                              <h3 className="truncate">
                                <Link to={`/product-detail/${item.product.id}`} className="hover:text-primary transition-colors">{item.product.title}</Link>
                              </h3>
                              <p className="ml-4 text-primary">
                                ${Math.round(item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm mt-4">
                            <div className="text-gray-500 flex items-center gap-2">
                              <label htmlFor="quantity" className="inline mr-2 text-sm font-medium leading-6 text-gray-900 dark:text-white">Qty</label>
                              <select
                                onChange={(e) => handleQuantity(e, item)}
                                value={item.quantity}
                                className="rounded-lg border border-primary px-4 py-2 bg-white text-base font-semibold focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 shadow-soft"
                                style={{ minWidth: '3.5rem', textAlign: 'center' }}
                              >
                                {[1,2,3,4,5].map(qty => <option key={qty} value={qty}>{qty}</option>)}
                              </select>
                            </div>
                            <div className="flex">
                              <Modal
                                title={`Delete ${item.product.title}`}
                                message="Are you sure you want to delete this Cart item ?"
                                dangerOption="Delete"
                                cancelOption="Cancel"
                                dangerAction={(e) => handleRemove(e, item.id)}
                                cancelAction={()=>setOpenModal(null)}
                                showModal={openModal === item.id}
                              ></Modal>
                              <button
                                onClick={e=>{setOpenModal(item.id)}}
                                type="button"
                                className="font-medium text-red-500 hover:text-red-700 transition-colors ml-4"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-red-500 flex-1">Product not found or deleted. <button onClick={e => handleRemove(e, item.id)} className="ml-2 underline text-red-700">Remove</button></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Cart Summary */}
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
                <Link
                  to="/checkout"
                  className="w-full block text-center rounded-xl bg-primary text-white font-bold text-lg py-4 shadow-elevated hover:bg-accent transition-all duration-300 animate-bounceIn"
                >
                  Proceed to Checkout
                </Link>
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
    </>
  );
}
