const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Product } = require('./model/Product');

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://abhishek143saini:iltn3kqaFMi75N5E@e-commerce.0kd5ad5.mongodb.net/?retryWrites=true&w=majority&appName=E-commerce';

async function importProducts() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const products = jsonData.products;

    if (!Array.isArray(products)) {
      throw new Error('products key is not an array in data.json');
    }

    // Insert products, skip duplicates by title
    for (const product of products) {
      // Remove the 'id' field if it exists
      const { id, ...productData } = product;
      try {
        await Product.create(productData);
        console.log(`Inserted: ${product.title}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Duplicate skipped: ${product.title}`);
        } else {
          console.error(`Error inserting ${product.title}:`, err.message);
        }
      }
    }

    console.log('Import finished.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

importProducts(); 