import express from 'express';
import { searchProducts, addProduct, deleteProduct } from '../../controllers/productController.js';

const router = express.Router();

// Removed '/products' prefix to match frontend

router.get('/', searchProducts); // <-- Changed
router.post('/', addProduct); // <-- Changed
router.delete('/:productId', deleteProduct); // <-- Changed

export default router;

/*
import express from 'express';
import { searchProducts, addProduct, deleteProduct } from '../../controllers/productController.js';

const router = express.Router();

router.get('/products', searchProducts);
router.post('/products', addProduct);
router.delete('/products/:productId', deleteProduct);

export default router;
*/