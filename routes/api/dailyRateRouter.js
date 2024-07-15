import { Router } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import validation from "../../validations/validation.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import { countDailyRate } from "../../controllers/dailyRateController.js";
import { BloodType, ReqBodyParts } from "../../helpers/enums.js";

const getDailyRateSchema = Joi.object({
  weight: Joi.number().required().min(20).max(500),
  height: Joi.number().required().min(100).max(250),
  age: Joi.number().required().min(18).max(100),
  desiredWeight: Joi.number().required().min(20).max(500),
  bloodType: Joi.number()
    .required()
    .valid(BloodType.ONE, BloodType.TWO, BloodType.THREE, BloodType.FOUR),
});

const userIdSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(value);
      if (!isValidObjectId) {
        return helpers.message({
          custom: "Invalid 'userId'. Must be MongoDB object id",
        });
      }
      return value;
    })
    .required(),
});

const router = Router();

router.post("/", validation(getDailyRateSchema), ctrlWrapper(countDailyRate));

// get daily rate per userid
router.post(
  "/:userId",
  ctrlWrapper(authenticateToken),
  // validation(userIdSchema, "PARAMS"), // Using ReqBodyParts.PARAMS
  validation(getDailyRateSchema),
  ctrlWrapper(countDailyRate)
);  

export { router as dailyRateRouter };
