import { Product } from '../models/productModel.js';

// Controller functions for product management
const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;
    // Example search logic based on query
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { name, description, nutrition } = req.body;
    const newProduct = new Product({
      name,
      description,
      nutrition,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { searchProducts, addProduct, deleteProduct };