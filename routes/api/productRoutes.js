
import express from 'express';
import { searchProducts, addProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', searchProducts);
router.post('/products', addProduct);
router.delete('/products/:productId', deleteProduct);

export default router;
