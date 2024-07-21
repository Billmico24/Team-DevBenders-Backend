const express = require('express');

const {
  validation,
  auth,
  ctrlWrapper,
  joiAddMyProductSchema,
  joiDeleteMyProductSchema,
  joiGetMyProductSchema,
} = require('../../middlewares');
const { myProducts: ctrl } = require('../../controllers');

const router = express.Router();

router.use(auth);
router.post(
  '/addProduct',
  validation(joiAddMyProductSchema),
  ctrlWrapper(ctrl.addMyProducts)
);
router.delete(
  '/:productId',
  validation(joiDeleteMyProductSchema),
  ctrlWrapper(ctrl.deleteMyProducts)
);
router.post(
  '/listMyProduct',
  validation(joiGetMyProductSchema),
  ctrlWrapper(ctrl.getMyProducts)
);

module.exports = router;
