// Script to fix missing price and discountPrice in all products
const mongoose = require('mongoose');
const { Product } = require('../model/Product');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce';
const DEFAULT_PRICE = 1000;

async function fixPrices() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    let updated = false;
    if (!product.price || typeof product.price !== 'number') {
      product.price = DEFAULT_PRICE;
      updated = true;
    }
    if (!product.discountPercentage || typeof product.discountPercentage !== 'number') {
      product.discountPercentage = 0;
      updated = true;
    }
    const newDiscountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
    if (product.discountPrice !== newDiscountPrice) {
      product.discountPrice = newDiscountPrice;
      updated = true;
    }
    if (updated) {
      await product.save();
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} products with missing price or discountPrice.`);
  await mongoose.disconnect();
}

fixPrices().catch(err => {
  console.error('Error updating products:', err);
  process.exit(1);
}); 