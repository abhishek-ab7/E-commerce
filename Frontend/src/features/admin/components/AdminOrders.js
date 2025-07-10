import { useEffect, useState, useRef } from 'react';
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from '../../order/orderSlice';
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../common/Pagination';
import Modal from '../../common/Modal';

function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});
  const [viewOrder, setViewOrder] = useState(null);
  const [modalKey, setModalKey] = useState(0); // for forcing modal re-mount
  const closingTimeout = useRef(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
    setEditOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
  };
  const handleShow = (order) => {
    if (viewOrder && viewOrder.id !== order.id) {
      // Animate close, then open new
      setViewOrder(null);
      clearTimeout(closingTimeout.current);
      closingTimeout.current = setTimeout(() => {
        setViewOrder(order);
        setModalKey(prev => prev + 1);
      }, 200); // match fade-out duration
    } else {
      setViewOrder(order);
      setModalKey(prev => prev + 1);
    }
  };
  const handleSaveEdit = () => {
    const updatedOrder = { ...editOrder, status: editStatus, paymentStatus: editPaymentStatus };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
    setEditOrder(null);
  };
  const handleCancelEdit = () => {
    setEditableOrderId(-1);
    setEditOrder(null);
  };

  const handleOrderStatus = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleOrderPaymentStatus = (e, order) => {
    const updatedOrder = { ...order, paymentStatus: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    console.log({ sort });
    setSort(sort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-200 text-purple-600';
      case 'dispatched':
        return 'bg-yellow-200 text-yellow-600';
      case 'delivered':
        return 'bg-green-200 text-green-600';
      case 'received':
        return 'bg-green-200 text-green-600';
      case 'cancelled':
        return 'bg-red-200 text-red-600';
      default:
        return 'bg-purple-200 text-purple-600';
    }
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  return (
    <div className="bg-background min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-8 animate-slideUp">
          <h1 className="text-3xl font-extrabold text-primary mb-8">All Orders</h1>
          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-xl overflow-hidden shadow-md animate-fadeIn">
              <thead>
                <tr className="bg-primary/10 text-primary uppercase text-sm leading-normal">
                  <th className="py-3 px-2 text-left">Order#</th>
                  <th className="py-3 px-2 text-left">Items</th>
                  <th className="py-3 px-2 text-center">Total Amount</th>
                  <th className="py-3 px-2 text-center">Shipping Address</th>
                  <th className="py-3 px-2 text-center">Order Status</th>
                  <th className="py-3 px-2 text-center">Payment Method</th>
                  <th className="py-3 px-2 text-center">Payment Status</th>
                  <th className="py-3 px-2 text-left">Order Time</th>
                  <th className="py-3 px-2 text-left">Last Updated</th>
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-glass/40 hover:bg-primary/5 transition-colors duration-150">
                    <td className="py-3 px-2 text-left font-semibold">{order.id}</td>
                    <td className="py-3 px-2 text-left">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                          <img className="w-8 h-8 rounded-lg shadow" src={item.product.thumbnail} alt={item.product.title} />
                          <span className="truncate">{item.product.title} × {item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-primary">
  ${order.items.reduce((sum, item) => {
    const unitPrice = Math.round(item.product.price * (1 - item.product.discountPercentage / 100));
    return sum + unitPrice * item.quantity;
  }, 0)}
</td>
                    <td className="py-3 px-2 text-center">
                      <div className="text-xs text-gray-600">
                        <div><strong>{order.selectedAddress.name}</strong></div>
                        <div>{order.selectedAddress.street}, {order.selectedAddress.city}</div>
                        <div>{order.selectedAddress.state}, {order.selectedAddress.pinCode}</div>
                        <div>{order.selectedAddress.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {editableOrderId === order.id ? (
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="rounded-lg border px-2 py-1">
                          <option value="pending">pending</option>
                          <option value="dispatched">dispatched</option>
                          <option value="delivered">delivered</option>
                          <option value="received">received</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs shadow-soft ${chooseColor(order.status)} animate-fadeIn`}>{order.status}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-accent/10 text-accent shadow-soft animate-fadeIn">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {editableOrderId === order.id ? (
                        <select value={editPaymentStatus} onChange={e => setEditPaymentStatus(e.target.value)} className="rounded-lg border px-2 py-1">
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="failed">failed</option>
                          <option value="refunded">refunded</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full font-semibold text-xs shadow-soft ${chooseColor(order.paymentStatus)} animate-fadeIn`}>{order.paymentStatus}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-left text-xs">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-2 text-left text-xs">{new Date(order.updatedAt).toLocaleString()}</td>
                    <td className="py-3 px-2 text-center">
                      {editableOrderId === order.id ? (
                        <>
                          <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-600 text-white rounded-lg font-semibold shadow-soft hover:bg-green-700 transition-colors duration-200 mr-2">Save</button>
                          <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow-soft hover:bg-gray-400 transition-colors duration-200">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(order)} className="px-3 py-1 bg-primary text-white rounded-lg font-semibold shadow-soft hover:bg-accent transition-colors duration-200 animate-bounceIn mr-2">Edit</button>
                          <button onClick={() => handleShow(order)} className="px-3 py-1 bg-white/80 text-primary border border-primary rounded-lg font-semibold shadow-soft hover:bg-primary hover:text-white transition-colors duration-200">View</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination page={page} setPage={setPage} handlePage={handlePage} totalItems={totalOrders} />
          </div>
        </div>
      </div>
      {viewOrder && (
        <Modal
          key={modalKey}
          title={`Order #${viewOrder.id}`}
          message={
            <div className="text-left animate-fadeIn">
              <div className="mb-2"><strong>Status:</strong> {viewOrder.status}</div>
              <div className="mb-2"><strong>Payment Status:</strong> {viewOrder.paymentStatus}</div>
              <div className="mb-2"><strong>Payment Method:</strong> {viewOrder.paymentMethod}</div>
              <div className="mb-2"><strong>Order Time:</strong> {new Date(viewOrder.createdAt).toLocaleString()}</div>
              <div className="mb-2"><strong>Last Updated:</strong> {new Date(viewOrder.updatedAt).toLocaleString()}</div>
              <div className="mb-2"><strong>Shipping Address:</strong> {viewOrder.selectedAddress.name}, {viewOrder.selectedAddress.street}, {viewOrder.selectedAddress.city}, {viewOrder.selectedAddress.state}, {viewOrder.selectedAddress.pinCode}, {viewOrder.selectedAddress.phone}</div>
              <div className="mb-2"><strong>Items:</strong></div>
              <ul className="ml-4 list-disc">
                {viewOrder.items.map((item, idx) => (
                  <li key={idx}>{item.product.title} × {item.quantity}</li>
                ))}
              </ul>
              <div className="mt-2 font-bold text-primary">Total: ${viewOrder.items.reduce((sum, item) => Math.round(item.product.price * (1 - item.product.discountPercentage / 100)) * item.quantity + sum, 0)}</div>
            </div>
          }
          dangerOption={undefined}
          cancelOption="Close"
          dangerAction={undefined}
          cancelAction={() => setViewOrder(null)}
          showModal={!!viewOrder}
        />
      )}
    </div>
  );
}

export default AdminOrders;
