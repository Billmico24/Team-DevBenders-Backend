import { Router } from "express";
import Joi from "joi";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validation from "../validations/validation.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { findProducts, checkDailyRate } from "../controllers/productController.js";

const searchQuerySchema = Joi.object({
  search: Joi.string().min(1).max(30).required(),
});

const router = Router();


router.get(
    "/",
    ctrlWrapper(authenticateToken),
    ctrlWrapper(checkDailyRate),
    validation(searchQuerySchema, "query"),
    ctrlWrapper(findProducts)
);

router.post(
"/add-product",
ctrlWrapper(authenticateToken),
ctrlWrapper(addProduct)
);

router.delete(
"/delete-product",
ctrlWrapper(authenticateToken),
ctrlWrapper(deleteProduct)
);

router.get(
"/day-info",
ctrlWrapper(authenticateToken),
ctrlWrapper(getDayInfo)
);


export { router as productRouter };
