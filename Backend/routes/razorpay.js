const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order } = require('../model/Order');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_live_o8x6BBkYMipWDF',
  key_secret: 'tcxzN7v9I1TTDZFnvaJby7Xo'
});

// Create Razorpay order
router.post('/order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || `rcptid_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    // Extract app orderId from receipt (format: order_rcptid_<appOrderId>)
    let appOrderId = null;
    if (options.receipt && options.receipt.startsWith('order_rcptid_')) {
      appOrderId = options.receipt.replace('order_rcptid_', '');
    }
    if (appOrderId) {
      await Order.findByIdAndUpdate(appOrderId, { razorpayOrderId: order.id });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Razorpay payment
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = 'tcxzN7v9I1TTDZFnvaJby7Xo';

  const hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is verified, update order status in DB
    try {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'received', status: 'received' },
        { new: true }
      );
      res.json({ status: 'success', order });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  } else {
    res.status(400).json({ status: 'failure' });
  }
});

module.exports = router; 