import express from "express";
import {
  addProduct,
  getEatenProduct,
  deleteProduct,
  findProducts,
  checkDailyRate,
  getDayInfo,
  getPeriodInfo
} from "../../controllers/specificDayController.js";

import {
  countDailyRate
} from "../../controllers/dailyRateController.js";

import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// const ctrl = require("../../controllers/dayController");

// import { 
//     addProduct,
//     getEatenProduct,
//     deleteProduct,
//     findProducts,
//     checkDailyRate,
//     getDayInfo,
//     getPeriodInfo,
//     addNewProduct,
//  } from "../../controllers/dayController.js"

const router = express.Router();

// daily-rate

// router.post("/", authenticateToken, ctrlWrapper(ctrl.checkDailyRate), validateBody(schemas.addProductSchema), ctrlWrapper(ctrl.addProduct));
router.post("/", authenticateToken, ctrlWrapper(checkDailyRate), ctrlWrapper(addProduct));
router.post("/product", authenticateToken, ctrlWrapper(checkDailyRate), ctrlWrapper(getEatenProduct));
// router.get("/info/:date", getDayInfo); // <-- Ensures consistency with frontend
router.post("/info", authenticateToken, getDayInfo);
router.delete("/info/:id", authenticateToken, deleteProduct);

export { router as specificDayRouter};

// router.post("/", authorize, ctrlWrapper(ctrl.checkDailyRate),
//  validateBody(schemas.addProductSchema), ctrlWrapper(ctrl.addProduct));

// router.post("/product", authorize, ctrlWrapper(ctrl.checkDailyRate), 
// validateBody(schemas.getProductSchema), ctrlWrapper(ctrl.getEatenProduct));

// router.post("/info", authorize, ctrlWrapper(ctrl.checkDailyRate), 
// validateBody(schemas.getDayInfoScheme), ctrlWrapper(ctrl.getDayInfo));

// router.get("/period", authorize, ctrlWrapper(ctrl.checkDailyRate), 
// ctrlWrapper(ctrl.getPeriodInfo));

// router.post("/delete", authorize, ctrlWrapper(ctrl.checkDailyRate), 
// validateBody(schemas.deleteProductSchema), ctrlWrapper(ctrl.deleteProduct));