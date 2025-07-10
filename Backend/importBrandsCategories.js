const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Brand } = require('./model/Brand');
const { Category } = require('./model/Category');

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://abhishek143saini:iltn3kqaFMi75N5E@e-commerce.0kd5ad5.mongodb.net/?retryWrites=true&w=majority&appName=E-commerce';

async function importBrandsCategories() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const brands = jsonData.brands;
    const categories = jsonData.categories;

    if (!Array.isArray(brands)) {
      throw new Error('brands key is not an array in data.json');
    }
    if (!Array.isArray(categories)) {
      throw new Error('categories key is not an array in data.json');
    }

    // Insert brands, skip duplicates by value
    for (const brand of brands) {
      try {
        await Brand.create({ label: brand.label, value: brand.value });
        console.log(`Inserted brand: ${brand.label}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Duplicate brand skipped: ${brand.label}`);
        } else {
          console.error(`Error inserting brand ${brand.label}:`, err.message);
        }
      }
    }

    // Insert categories, skip duplicates by value
    for (const category of categories) {
      try {
        await Category.create({ label: category.label, value: category.value });
        console.log(`Inserted category: ${category.label}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Duplicate category skipped: ${category.label}`);
        } else {
          console.error(`Error inserting category ${category.label}:`, err.message);
        }
      }
    }

    console.log('Brands and categories import finished.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

importBrandsCategories(); 