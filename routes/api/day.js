import express from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import * as ctrl from "../../controllers/dayController.js";
import validateBody from "../../middlewares/validateBody.js";
import authorize from "../../middlewares/authorize.js";
import { schemas } from "../../models/day.js";
const router = express.Router();

router.post(
  "/",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validateBody(schemas.addProductSchema),
  ctrlWrapper(ctrl.addProduct)
);

router.post(
  "/product",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validateBody(schemas.getProductSchema),
  ctrlWrapper(ctrl.getEatenProduct)
);

router.post(
  "/info",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validateBody(schemas.getDayInfoScheme),
  ctrlWrapper(ctrl.getDayInfo)
);

router.get(
  "/period",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  ctrlWrapper(ctrl.getPeriodInfo)
);

router.post(
  "/delete",
  authorize,
  ctrlWrapper(ctrl.checkDailyRate),
  validateBody(schemas.deleteProductSchema),
  ctrlWrapper(ctrl.deleteProduct)
);

export default router;
