import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, updateUserAsync } from '../userSlice';
import { useForm } from 'react-hook-form';

export default function UserProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses] }; // for shallow copy issue
    newUser.addresses.splice(index, 1, addressUpdate);
    dispatch(updateUserAsync(newUser));
    setSelectedEditIndex(-1);
  };
  const handleRemove = (e, index) => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses] }; // for shallow copy issue
    newUser.addresses.splice(index, 1);
    dispatch(updateUserAsync(newUser));
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = userInfo.addresses[index];
    setValue('name', address.name);
    setValue('email', address.email);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pinCode', address.pinCode);
    setValue('phone', address.phone);
    setValue('street', address.street);
  };

  const handleAdd = (address) => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses, address] };
    dispatch(updateUserAsync(newUser));
    setShowAddAddressForm(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center animate-fadeIn">
      <div className="w-full max-w-3xl bg-glass/80 dark:bg-glass-dark/80 backdrop-blur-md rounded-2xl shadow-glass p-10 mt-12 animate-slideUp">
        <div className="mb-8 text-center">
          <img src="/user.png" alt="User avatar" className="h-20 w-20 rounded-full border-4 border-primary mx-auto mb-4 shadow-elevated animate-bounceIn" />
          <h1 className="text-3xl font-extrabold text-primary mb-2">{userInfo.name ? userInfo.name : 'New User'}</h1>
          <h3 className="text-lg font-medium text-gray-700 mb-1">{userInfo.email}</h3>
          {userInfo.role === 'admin' && (
            <span className="inline-block bg-indigo-100 text-indigo-600 font-semibold px-4 py-1 rounded-full text-sm">Admin</span>
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Addresses</h2>
          <button
            onClick={() => {
              setShowAddAddressForm(true);
              setSelectedEditIndex(-1);
            }}
            type="button"
            className="rounded-xl mb-6 bg-primary px-5 py-2 text-sm font-semibold text-white shadow-elevated hover:bg-accent transition-colors duration-300 animate-bounceIn"
          >
            Add New Address
          </button>
          <div className="space-y-6">
            {userInfo.addresses && userInfo.addresses.length > 0 ? userInfo.addresses.map((address, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-dark/80 rounded-xl shadow-soft p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
                <div>
                  <div className="font-semibold text-gray-900">{address.name}</div>
                  <div className="text-gray-600 text-sm">{address.street}, {address.city}, {address.state} - {address.pinCode}</div>
                  <div className="text-gray-500 text-xs">Phone: {address.phone}</div>
                  <div className="text-gray-500 text-xs">Email: {address.email}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleEditForm(idx)} className="px-4 py-1 rounded-lg bg-accent/20 text-accent font-semibold hover:bg-accent/40 transition-colors duration-200">Edit</button>
                  <button onClick={e => handleRemove(e, idx)} className="px-4 py-1 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors duration-200">Remove</button>
                </div>
              </div>
            )) : <div className="text-gray-500">No addresses added yet.</div>}
          </div>
        </div>
        {/* Add/Edit Address Form */}
        {(showAddAddressForm || selectedEditIndex > -1) && (
          <form
            className="bg-white/90 dark:bg-dark/80 rounded-xl shadow-soft p-8 mt-8 animate-slideUp"
            noValidate
            onSubmit={handleSubmit((data) => {
              if (selectedEditIndex > -1) {
                handleEdit(data, selectedEditIndex);
              } else {
                handleAdd(data);
              }
              reset();
            })}
          >
            <h3 className="text-lg font-bold text-primary mb-4">{selectedEditIndex > -1 ? 'Edit Address' : 'Add New Address'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" {...register('name', { required: 'Name is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" {...register('email', { required: 'Email is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" {...register('phone', { required: 'Phone is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input type="text" {...register('street', { required: 'Street is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" {...register('city', { required: 'City is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" {...register('state', { required: 'State is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                <input type="text" {...register('pinCode', { required: 'Pin code is required' })} className="w-full rounded-lg border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary focus:ring-inset transition-all" />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode.message}</p>}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="px-6 py-2 rounded-xl bg-primary text-white font-semibold shadow-elevated hover:bg-accent transition-colors duration-300">{selectedEditIndex > -1 ? 'Save' : 'Add'}</button>
              <button type="button" onClick={() => { setShowAddAddressForm(false); setSelectedEditIndex(-1); reset(); }} className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition-colors duration-200">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
