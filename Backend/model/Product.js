const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  title:       { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price:       { type: Number, min: [1, 'wrong min price'], max: [10000, 'wrong max price'] },
  discountPercentage: { type: Number, min: [1, 'wrong min discount'], max: [99, 'wrong max discount'] },
  rating:      { type: Number, min: [0, 'wrong min rating'], max: [5, 'wrong max price'], default: 0 },
  stock:       { type: Number, min: [0, 'wrong min stock'], default: 0 },
  brand:       { type: String, required: true },
  category:    { type: String, required: true },
  thumbnail:   { type: String, required: true },
  images:      { type: [String], required: true },
  colors:      { type: [Schema.Types.Mixed] },
  
  // These two fields will now be **computed**, not stored:
  // discountPrice: Number,
  // (we remove it from the stored schema entirely)
});

// ——— Add this **uncommented** virtual field ———
// so that **every** find()/findById() will include `discountPrice` in the JSON:
const virtualDiscountPrice = productSchema.virtual('discountPrice');
productSchema.virtual('discountPrice').get(function() {
    return Math.round(this.price * (1 - this.discountPercentage / 100));
});

// Add a virtual 'id' field that mirrors _id
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// include virtuals on all toJSON / toObject calls:
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { delete ret._id; }
});
productSchema.set('toObject', { virtuals: true });
    

exports.Product = mongoose.model('Product', productSchema);