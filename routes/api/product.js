import express from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import * as ctrl from "../../controllers/dayController.js";

import validate from "../../middlewares/validate.js";
import authorize from "../../middlewares/authorize.js";
import { schemas } from "../../models/day.js";
import { addNewProduct } from "../../models/product.js";
const router = express.Router();

router.post(
  "/",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validate(schemas.searchQuerySchema, "query"),
  ctrlWrapper(ctrl.findProducts)
);

router.post(
  "/add",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validate(addNewProduct),
  ctrlWrapper(ctrl.addNewProduct)
);

export default router;
