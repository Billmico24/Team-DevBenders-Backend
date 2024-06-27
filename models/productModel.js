import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  nutrition: { type: Object },
});

const Product = mongoose.model('Product', productSchema);

export { Product };