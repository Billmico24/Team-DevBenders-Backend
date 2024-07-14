import express from "express";
import ctrlWrapper from "../../helpers/ctrlWrapper.js";
import ctrl from "../../controllers/daily-rateController.js";

import validateBody from "../../middlewares/validateBody.js";
import isValidId from "../../middlewares/isValidId.js";
import authorize from "../../middlewares/authorize.js";
import getDailyRateSchema from "../../models/daily-rate.js";
const router = express.Router();

router.post(
  "/",
  validateBody(getDailyRateSchema),
  ctrlWrapper(ctrl.countDailyRate)
);

router.post(
  "/:userId",
  authorize,
  isValidId,
  validateBody(getDailyRateSchema),
  ctrlWrapper(ctrl.countDailyRate)
);

export default router;
