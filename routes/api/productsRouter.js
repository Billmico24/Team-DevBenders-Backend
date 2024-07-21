const express = require("express");
const router = express.Router();

const { auth, validation, joiGetDailyRateSchema, ctrlWrapper  } = require("../../middlewares");
const { products: ctrl } = require("../../controllers");

router.post("/", validation(joiGetDailyRateSchema), ctrlWrapper(ctrl.getDailyRateController));
router.post("/:userId", auth, ctrlWrapper(ctrl.getDailyRateUserController));
router.get("/searchProducts", ctrlWrapper(ctrl.getAllProductsByQuery));

module.exports = router;